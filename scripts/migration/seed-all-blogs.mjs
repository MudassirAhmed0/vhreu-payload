#!/usr/bin/env node
/**
 * Seed ALL blog posts from the live WordPress site.
 * Runs seed-blog-post.mjs for each slug sequentially.
 *
 * Usage:
 *   node seed-all-blogs.mjs
 *   node seed-all-blogs.mjs --skip-existing
 */

import { execFileSync } from 'child_process'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const args = process.argv.slice(2)
const skipExisting = args.includes('--skip-existing')

const PAYLOAD_URL = process.env.PAYLOAD_URL || 'http://localhost:3030'

const SLUGS = [
  'cheapest-electric-car-ireland',
  'best-hybrid-cars-in-ireland',
  'how-to-find-service-history-of-a-car',
  'most-popular-car-in-poland',
  'the-truth-about-volvo-performance',
  'how-to-check-bmw-chassis-number-explained-for-beginners',
  'best-peugeot-car',
  'best-citroen-car',
  'citroen-vin-check-free-why-its-important-and-where-to-do-it',
  'top-european-car-brands',
  'what-is-good-fuel-economy-for-a-car',
  'how-many-cars-in-europe',
  'vin-cloning',
  'how-much-over-the-speed-limit-are-you-allowed-in-ireland',
  'what-is-a-gt-car',
  'body-control-module',
  'car-dashboard-symbols-and-meanings',
  'buying-a-car-that-was-in-an-accident',
  'what-is-vin-etching',
  'signs-of-flood-damage-car',
  'best-vauxhall-car',
  'where-to-find-vin-number-on-car',
  'how-to-check-how-many-owners-a-car-has-had',
  'what-is-the-best-used-suv-to-buy-in',
  'what-is-considered-bad-gas-mileage',
  'best-family-suv-2024',
  'best-used-electric-cars',
  'how-to-check-equipment-by-vin-number',
  'why-a-mileage-check-is-crucial-when-buying-a-used-car',
  'why-a-hyundai-vin-check-is-crucial-before-you-buy-a-used-car-in-europe',
  'how-to-check-engine-size-by-vin-number',
  'what-is-the-best-site-to-check-the-vin-number',
  'how-to-jump-start-a-car-a-comprehensive-guide',
  'tips-for-securing-your-vehicle-at-night',
  'electrifying-savings-finding-the-cheapest-electric-car-in-ireland',
  'european-car-check-tools-7-essential-resources-for-every-european-car-owner',
  'how-much-does-it-cost-to-charge-an-electric-car-in-ireland',
  'the-check-engine-light-on-car-what-does-it-mean',
]

async function getExistingSlugs() {
  try {
    const login = await fetch(`${PAYLOAD_URL}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'lame@lame.com', password: 'lame@lame.com' }),
    })
    const { token } = await login.json()
    const res = await fetch(`${PAYLOAD_URL}/api/posts?limit=100&depth=0`, {
      headers: { Authorization: `JWT ${token}` },
    })
    const data = await res.json()
    return new Set(data.docs.map(p => p.slug))
  } catch {
    return new Set()
  }
}

async function main() {
  console.log('\n═══════════════════════════════════════')
  console.log('  SEED ALL BLOG POSTS')
  console.log('═══════════════════════════════════════\n')

  const existing = skipExisting ? await getExistingSlugs() : new Set()
  if (skipExisting) console.log(`  Existing posts: ${existing.size}\n`)

  let success = 0
  let skipped = 0
  let failed = 0
  const failures = []

  for (let i = 0; i < SLUGS.length; i++) {
    const slug = SLUGS[i]
    const num = `[${i + 1}/${SLUGS.length}]`

    if (skipExisting && existing.has(slug)) {
      console.log(`  ${num} ${slug.padEnd(60)} SKIP`)
      skipped++
      continue
    }

    process.stdout.write(`  ${num} ${slug.padEnd(60)} `)

    try {
      execFileSync('node', [join(__dirname, 'seed-blog-post.mjs'), '--slug', slug], {
        encoding: 'utf8',
        timeout: 120_000,
        stdio: ['pipe', 'pipe', 'pipe'],
      })
      console.log('OK')
      success++
    } catch (err) {
      const stderr = err.stderr || err.stdout || err.message
      const errorLine = stderr.split('\n').find(l => l.includes('FAILED') || l.includes('Error')) || 'Unknown error'
      console.log(`FAIL: ${errorLine.trim().slice(0, 80)}`)
      failures.push({ slug, error: errorLine.trim() })
      failed++
    }

    // Small delay to avoid overwhelming the server
    await new Promise(r => setTimeout(r, 500))
  }

  console.log(`\n═══════════════════════════════════════`)
  console.log(`  Success: ${success}  Skipped: ${skipped}  Failed: ${failed}`)
  console.log(`  Total: ${SLUGS.length}`)
  console.log(`═══════════════════════════════════════\n`)

  if (failures.length > 0) {
    console.log('  Failed posts:')
    failures.forEach(f => console.log(`    - ${f.slug}: ${f.error.slice(0, 100)}`))
    console.log()
  }
}

main()
