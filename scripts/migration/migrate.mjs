#!/usr/bin/env node
/**
 * Full migration script: resets Payload DB, re-registers admin,
 * creates content groups, uploads media, seeds all pages + FAQs + blog.
 *
 * Usage:
 *   node migrate.mjs                    # full migration
 *   node migrate.mjs --skip-blog        # skip blog seeding
 *   node migrate.mjs --db-reset         # also delete the SQLite DB file
 *
 * Requires Payload to be STOPPED when using --db-reset, then restarted after.
 * Without --db-reset, assumes Payload is running with fresh schema.
 */

import { execSync } from 'child_process'
import { existsSync, unlinkSync } from 'fs'
import path from 'path'

const PAYLOAD_URL = process.env.PAYLOAD_URL || 'http://localhost:3030'
const EMAIL = 'lame@lame.com'
const PASSWORD = 'lame@lame.com'
const PAYLOAD_DIR = path.resolve(import.meta.dirname, '../..')
const CLIENT_DIR = path.resolve(import.meta.dirname, '../../../vehicle-history-euro-client')
const MIGRATION_DIR = import.meta.dirname
const DB_PATH = path.join(PAYLOAD_DIR, '.db')

const args = process.argv.slice(2)
const dbReset = args.includes('--db-reset')
const skipBlog = args.includes('--skip-blog')

function run(cmd, opts = {}) {
  console.log(`  $ ${cmd}`)
  try {
    execSync(cmd, { cwd: MIGRATION_DIR, stdio: 'inherit', timeout: 300_000, ...opts })
  } catch (err) {
    // Some seed commands timeout but data still gets saved — continue
    if (err.status === 1) {
      console.log('  (command failed but continuing)')
    }
  }
}

async function waitForPayload(maxWait = 60_000) {
  const start = Date.now()
  while (Date.now() - start < maxWait) {
    try {
      const res = await fetch(`${PAYLOAD_URL}/api/users`, { signal: AbortSignal.timeout(3000) })
      if (res.ok || res.status === 401 || res.status === 403) return true
    } catch { /* not ready */ }
    await new Promise(r => setTimeout(r, 2000))
    process.stdout.write('.')
  }
  return false
}

async function apiCall(endpoint, method, body, token) {
  const res = await fetch(`${PAYLOAD_URL}/api/${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `JWT ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(30_000),
  })
  return res.json()
}

async function login() {
  const data = await apiCall('users/login', 'POST', { email: EMAIL, password: PASSWORD })
  return data.token
}

async function main() {
  console.log('\n═══════════════════════════════════════')
  console.log('  VEHICLE HISTORY EU — FULL MIGRATION')
  console.log('═══════════════════════════════════════\n')

  // ── Step 0: DB Reset (optional) ──
  if (dbReset) {
    console.log('STEP 0: Database reset')
    if (existsSync(DB_PATH)) {
      unlinkSync(DB_PATH)
      console.log(`  Deleted ${DB_PATH}`)
    } else {
      console.log('  DB file not found — already clean')
    }
    console.log('  ⚠️  Restart Payload now, then press Enter...')
    await new Promise(r => process.stdin.once('data', r))
  }

  // ── Step 1: Wait for Payload ──
  console.log('\nSTEP 1: Waiting for Payload...')
  const ready = await waitForPayload()
  if (!ready) {
    console.error('\n  Payload not responding. Start it and try again.')
    process.exit(1)
  }
  console.log(' ready!\n')

  // ── Step 2: Register admin user ──
  console.log('STEP 2: Register admin user')
  try {
    const reg = await apiCall('users/first-register', 'POST', { email: EMAIL, password: PASSWORD })
    console.log(`  ${reg.message || 'User exists'}\n`)
  } catch {
    console.log('  User already exists\n')
  }

  const token = await login()
  if (!token) { console.error('  Login failed'); process.exit(1) }
  console.log('  Authenticated\n')

  // ── Step 3: Create content groups ──
  console.log('STEP 3: Content groups')
  const groups = [
    { name: 'VIN Check', slug: 'vin-check' },
    { name: 'VIN Decoder', slug: 'vin-decoder' },
    { name: 'Window Sticker', slug: 'window-sticker' },
  ]
  for (const group of groups) {
    const existing = await apiCall(`content-groups?where[slug][equals]=${group.slug}&limit=1`, 'GET', null, token)
    if (existing.docs?.length > 0) {
      console.log(`  ${group.name} — exists (id=${existing.docs[0].id})`)
    } else {
      const created = await apiCall('content-groups', 'POST', group, token)
      console.log(`  ${group.name} — created (id=${created.doc?.id})`)
    }
  }
  console.log()

  // ── Step 4: Upload media ──
  console.log('STEP 4: Upload media')
  const mediaFiles = [
    { file: 'public/report-preview.webp', alt: 'Vehicle History Report preview', mime: 'image/webp' },
    { file: 'public/damaged-car.webp', alt: 'Damaged car with warning labels showing common used car problems', mime: 'image/webp' },
  ]
  const mediaIds = {}
  for (const m of mediaFiles) {
    const filePath = path.join(CLIENT_DIR, m.file)
    if (!existsSync(filePath)) {
      console.log(`  Skipping ${m.file} — file not found`)
      continue
    }
    // Check if already uploaded
    const existing = await apiCall(`media?where[alt][equals]=${encodeURIComponent(m.alt)}&limit=1`, 'GET', null, token)
    if (existing.docs?.length > 0) {
      mediaIds[m.file] = existing.docs[0].id
      console.log(`  ${m.file} — exists (id=${existing.docs[0].id})`)
      continue
    }
    // Upload via curl (multipart form)
    try {
      const result = execSync(
        `curl -s '${PAYLOAD_URL}/api/media' -X POST ` +
        `-H "Authorization: JWT ${token}" ` +
        `-F '_payload={"alt":"${m.alt}"};type=application/json' ` +
        `-F 'file=@${filePath};type=${m.mime}'`,
        { encoding: 'utf8', timeout: 30_000 }
      )
      const data = JSON.parse(result)
      mediaIds[m.file] = data.doc?.id
      console.log(`  ${m.file} — uploaded (id=${data.doc?.id})`)
    } catch (err) {
      console.log(`  ${m.file} — FAILED: ${err.message}`)
    }
  }
  console.log()

  // ── Step 5: Run scrape + improvise + map pipeline ──
  console.log('STEP 5: Scrape → Improvise → Map pipeline')
  console.log('  Scraping...')
  run('node scrape-content.mjs --all --out scraped-content.json')
  console.log('  Improvising...')
  run('node improvise-content.mjs --report-out migration-report.md')
  console.log('  Mapping...')
  run('node map-to-payload.mjs --out payload-blocks.json')
  console.log()

  // ── Step 6: Seed pages ──
  console.log('STEP 6: Seed pages')
  run('node seed-payload.mjs')
  console.log()

  // ── Step 7: Seed FAQs ──
  console.log('STEP 7: Scrape & seed FAQs')
  run('node scrape-faqs.mjs --all --out scraped-faqs.json')
  run('node seed-faqs.mjs')
  console.log()

  // ── Step 8: Patch media onto pages ──
  console.log('STEP 8: Patch media')
  const heroMediaId = mediaIds['public/report-preview.webp']
  const carMediaId = mediaIds['public/damaged-car.webp']

  if (heroMediaId || carMediaId) {
    const token2 = await login() // refresh token
    // Get homepage
    const homeRes = await apiCall('pages?where[slug][equals]=home&limit=1', 'GET', null, token2)
    const home = homeRes.docs?.[0]
    if (home) {
      const blocks = home.content || []
      if (heroMediaId) blocks[0].heroImage = heroMediaId
      for (const b of blocks) {
        if (b.content) {
          for (const inner of b.content) {
            if (inner.blockType === 'split-content' && inner.heading?.includes('Costly') && carMediaId) {
              inner.media = carMediaId
            }
          }
        }
      }
      try {
        await fetch(`${PAYLOAD_URL}/api/pages/${home.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token2}` },
          body: JSON.stringify({ content: blocks }),
          signal: AbortSignal.timeout(60_000),
        })
        console.log('  Homepage media patched')
      } catch {
        console.log('  Homepage media patch timed out (may still succeed)')
      }
    }
  }
  console.log()

  // ── Step 9: Seed blog (optional) ──
  if (!skipBlog) {
    console.log('STEP 9: Seed blog')
    run('node seed-blog.mjs')
    console.log()
  }

  // ── Done ──
  console.log('═══════════════════════════════════════')
  console.log('  MIGRATION COMPLETE')
  console.log('═══════════════════════════════════════')
  console.log(`\n  Payload admin: ${PAYLOAD_URL}/admin`)
  console.log('  Client: http://localhost:3000\n')
}

main().catch(err => {
  console.error('Fatal:', err.message)
  process.exit(1)
})
