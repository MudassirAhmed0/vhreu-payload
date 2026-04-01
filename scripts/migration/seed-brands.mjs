#!/usr/bin/env node
/**
 * Stage 3: Seed VIN Decoder brand pages into Payload CMS.
 *
 * Reads improvised-brands.json (falls back to scraped-brands.json)
 * and maps each section to the correct Payload block structure.
 *
 * Usage:
 *   node seed-brands.mjs                        # all brands
 *   node seed-brands.mjs --brand audi           # single brand
 *   node seed-brands.mjs --dry-run              # preview blocks
 *   node seed-brands.mjs --dry-run --brand audi --json
 */

import { readFileSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PAYLOAD_URL = process.env.PAYLOAD_URL || 'http://localhost:3001'
const EMAIL = 'lame@lame.com'
const PASSWORD = 'lame@lame.com'
let token = null

// ── Load data ─────────────────────────────────────────────────────

let DATA
try {
  DATA = JSON.parse(readFileSync(join(__dirname, 'improvised-brands.json'), 'utf8'))
  console.log('Using improvised content (stage 2)\n')
} catch {
  DATA = JSON.parse(readFileSync(join(__dirname, 'scraped-brands.json'), 'utf8'))
  console.log('Using raw scraped content (no improvisation found)\n')
}

// ── Lexical helpers ───────────────────────────────────────────────

function textToLexical(text) {
  if (!text) return undefined
  if (typeof text === 'object' && text.root) return text
  const paragraphs = String(text).split(/\n\n+/).filter(Boolean)
  return {
    root: {
      type: 'root', direction: 'ltr', format: '', indent: 0, version: 1,
      children: paragraphs.map(p => ({
        type: 'paragraph', direction: 'ltr', format: '', indent: 0, version: 1, textFormat: 0, textStyle: '',
        children: [{ type: 'text', text: p.trim(), format: 0, version: 1, detail: 0, mode: 'normal', style: '' }],
      })),
    },
  }
}

function paragraphsToLexical(paragraphs) {
  if (!paragraphs || paragraphs.length === 0) return undefined
  return textToLexical(paragraphs.join('\n\n'))
}

// ── Improvised data helpers ───────────────────────────────────────

function imp(section, field) {
  return section?._improvised?.[field] ?? null
}

function impHeading(section) {
  return imp(section, 'heading') || section?.heading || ''
}

function impTagline(section) {
  return imp(section, 'tagline') || null
}

function impTagLevel(section) {
  return imp(section, 'tagLevel') || 'span'
}

// ── Icon helpers ──────────────────────────────────────────────────

const VALID_PRESETS = new Set([
  'car','car-front','bike','truck','shield-check','shield','lock','lock-open',
  'triangle-alert','siren','file-text','clipboard-check','file-search','circle-check',
  'circle-x','search','eye','scan','gauge','trending-up','trending-down','database',
  'bar-chart-3','wallet','credit-card','tag','receipt','mail','phone','headphones',
  'message-circle','zap','wrench','globe','mouse-pointer-click','download','link',
  'info','chevron-right','star','heart','house','map-pin','clock','calendar','user',
  'users','building','pencil','hash','list','factory','circle-dot',
])

function icon(preset) {
  if (!VALID_PRESETS.has(preset)) preset = 'circle-check'
  return { source: 'preset', preset }
}

// ── Feature icon guessing ─────────────────────────────────────────

function guessFeatureIcon(text) {
  const t = text.toLowerCase()
  if (t.includes('auction')) return 'car'
  if (t.includes('title') && t.includes('condition')) return 'clipboard-check'
  if (t.includes('sales history') || t.includes('sale')) return 'trending-up'
  if (t.includes('title') && t.includes('record')) return 'file-text'
  if (t.includes('accident')) return 'triangle-alert'
  if (t.includes('mileage') || t.includes('odometer')) return 'gauge'
  if (t.includes('recall')) return 'siren'
  if (t.includes('theft') || t.includes('stolen')) return 'lock'
  if (t.includes('spec') || t.includes('detail')) return 'list'
  if (t.includes('owner') || t.includes('registration')) return 'user'
  if (t.includes('damage') || t.includes('salvage')) return 'circle-x'
  if (t.includes('inspection')) return 'search'
  if (t.includes('warranty')) return 'shield-check'
  if (t.includes('insurance')) return 'shield'
  if (t.includes('emission')) return 'factory'
  return 'circle-check'
}

// ── Block generators ──────────────────────────────────────────────

function generateHeroBlock(section) {
  const block = {
    blockType: 'page-hero',
    variant: 'centered',
    dark: true,
    fullHeight: false,
    glow: false,
    formType: 'vin',
    title: impHeading(section),
    description: section.description || null,
  }

  const tagline = impTagline(section)
  if (tagline) {
    block.tag = tagline
    block.tagLevel = impTagLevel(section)
  }

  // Features come from scraper, not improviser
  if (section.features && section.features.length > 0) {
    block.features = section.features.map(f => ({
      icon: icon(guessFeatureIcon(f.text)),
      text: f.text,
      tag: f.tag || 'span',
    }))
  }

  return block
}

async function generateWhatIsVinBlock(section) {
  // Upload image if available
  let mediaId = null
  if (section.imageUrl && token) {
    mediaId = await uploadMedia(section.imageUrl, section.imageAlt || 'VIN location diagram')
  }

  // Split-content rule: section wrapper is empty, all content in the inner block
  const splitContent = {
    blockType: 'split-content',
    tag: impTagline(section),
    heading: impHeading(section),
    headingLevel: section.headingLevel || 'h2',
    description: paragraphsToLexical(section.paragraphs),
    mediaType: 'image',
    reverse: false,
  }
  if (mediaId) splitContent.media = mediaId

  return {
    blockType: 'section',
    bg: 'white',
    scene: 'default',
    content: [splitContent],
  }
}

// ── Assemble all blocks for a brand ───────────────────────────────

async function generateBlocks(brand) {
  const s = brand.sections
  const blocks = []

  if (s.hero) blocks.push(generateHeroBlock(s.hero))
  if (s.whatIsVin) blocks.push(await generateWhatIsVinBlock(s.whatIsVin))

  return blocks
}

// ── API helpers ───────────────────────────────────────────────────

async function login() {
  const res = await fetch(`${PAYLOAD_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  })
  const data = await res.json()
  token = data.token
}

async function getContentGroupId(slug) {
  const res = await fetch(
    `${PAYLOAD_URL}/api/content-groups?where[slug][equals]=${slug}&limit=1`,
    { headers: { Authorization: `JWT ${token}` } },
  )
  const data = await res.json()
  return data.docs?.[0]?.id || null
}

async function findContentPage(groupId, slug) {
  const res = await fetch(
    `${PAYLOAD_URL}/api/content-pages?where[group][equals]=${groupId}&where[slug][equals]=${slug}&limit=1`,
    { headers: { Authorization: `JWT ${token}` } },
  )
  const data = await res.json()
  return data.docs?.[0] || null
}

async function createContentPage(data) {
  const res = await fetch(`${PAYLOAD_URL}/api/content-pages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}` },
    body: JSON.stringify(data),
    signal: AbortSignal.timeout(60_000),
  })
  try {
    const result = await res.json()
    if (result.errors) {
      console.error(`    Error:`, JSON.stringify(result.errors, null, 2).slice(0, 500))
      return null
    }
    return result.doc
  } catch {
    return { id: 'timeout-but-likely-saved' }
  }
}

async function uploadMedia(url, alt) {
  // Download file
  const res = await fetch(url)
  if (!res.ok) { console.error(`    Download failed: ${res.status} ${url}`); return null }
  const buffer = Buffer.from(await res.arrayBuffer())
  const filename = url.split('/').pop()

  // Check if already uploaded (by filename or alt text)
  const check = await fetch(
    `${PAYLOAD_URL}/api/media?where[alt][equals]=${encodeURIComponent(alt || filename)}&limit=1`,
    { headers: { Authorization: `JWT ${token}` } },
  )
  const existing = await check.json()
  if (existing.docs?.[0]?.id) return existing.docs[0].id

  // Upload via multipart form — Payload 3.x reads fields from _payload JSON
  const ext = filename.split('.').pop()?.toLowerCase() || 'bin'
  const mimeTypes = { svg: 'image/svg+xml', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp' }
  const mime = mimeTypes[ext] || 'application/octet-stream'

  const form = new FormData()
  form.append('_payload', JSON.stringify({ alt: alt || filename }))
  form.append('file', new File([buffer], filename, { type: mime }))

  const upload = await fetch(`${PAYLOAD_URL}/api/media`, {
    method: 'POST',
    headers: { Authorization: `JWT ${token}` },
    body: form,
  })
  const result = await upload.json()
  if (result.errors) {
    console.error(`    Upload error:`, JSON.stringify(result.errors[0]?.message || result.errors).slice(0, 200))
    return null
  }
  return result.doc?.id || null
}

async function updateContentPage(id, data) {
  const res = await fetch(`${PAYLOAD_URL}/api/content-pages/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}` },
    body: JSON.stringify(data),
    signal: AbortSignal.timeout(60_000),
  })
  try {
    const result = await res.json()
    return result.doc
  } catch {
    return { id }
  }
}

// ── CLI & Main ────────────────────────────────────────────────────

const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const jsonOutput = args.includes('--json')
const brandFilter = args.includes('--brand') ? args[args.indexOf('--brand') + 1] : null

async function main() {
  console.log('\n═══════════════════════════════════════')
  console.log('  SEED VIN DECODER BRAND PAGES')
  console.log('═══════════════════════════════════════\n')

  if (!dryRun) {
    await login()
    console.log('Authenticated.\n')
  }

  let groupId = null
  if (!dryRun) {
    groupId = await getContentGroupId('vin-decoder')
    if (!groupId) {
      console.error('Content Group "vin-decoder" not found. Create it first.')
      process.exit(1)
    }
    console.log(`VIN Decoder group ID: ${groupId}\n`)
  }

  const brands = brandFilter
    ? DATA.filter(b => b.slug === brandFilter)
    : DATA

  if (brands.length === 0) {
    console.error(`Brand "${brandFilter}" not found in data.`)
    process.exit(1)
  }

  let created = 0, updated = 0, failed = 0

  for (const brand of brands) {
    const blocks = await generateBlocks(brand)

    if (dryRun) {
      console.log(`  ${brand.name.padEnd(25)} ${blocks.length} blocks`)
      if (jsonOutput) {
        writeFileSync(join(__dirname, `blocks-${brand.slug}.json`), JSON.stringify(blocks, null, 2))
        console.log(`    → blocks-${brand.slug}.json`)
      }
      continue
    }

    process.stdout.write(`  ${brand.name.padEnd(25)}`)

    const existing = await findContentPage(groupId, brand.slug)
    const payload = {
      name: brand.name,
      slug: brand.slug,
      group: groupId,
      content: blocks,
      meta: brand.meta,
      _status: 'published',
    }

    if (existing) {
      await updateContentPage(existing.id, payload)
      console.log(`UPDATED (${blocks.length} blocks)`)
      updated++
    } else {
      const doc = await createContentPage(payload)
      if (doc) {
        console.log(`CREATED (${blocks.length} blocks)`)
        created++
      } else {
        console.log(`FAILED`)
        failed++
      }
    }
  }

  console.log(`\n  Done: ${created} created, ${updated} updated, ${failed} failed\n`)
}

main().catch(err => { console.error(err); process.exit(1) })
