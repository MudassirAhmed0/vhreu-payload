#!/usr/bin/env node
/**
 * Scrape WP categories for all blog posts and assign them in Payload.
 * Deletes old categories, creates WP ones, updates all posts.
 */

import * as cheerio from 'cheerio'

const PAYLOAD_URL = process.env.PAYLOAD_URL || 'http://localhost:3030'
const EMAIL = 'lame@lame.com'
const PASSWORD = 'lame@lame.com'
let token = null

const SLUGS = [
  'cheapest-electric-car-ireland','best-hybrid-cars-in-ireland','how-to-find-service-history-of-a-car',
  'most-popular-car-in-poland','the-truth-about-volvo-performance','how-to-check-bmw-chassis-number-explained-for-beginners',
  'best-peugeot-car','best-citroen-car','citroen-vin-check-free-why-its-important-and-where-to-do-it',
  'top-european-car-brands','what-is-good-fuel-economy-for-a-car','how-many-cars-in-europe',
  'vin-cloning','how-much-over-the-speed-limit-are-you-allowed-in-ireland','what-is-a-gt-car',
  'body-control-module','car-dashboard-symbols-and-meanings','buying-a-car-that-was-in-an-accident',
  'what-is-vin-etching','signs-of-flood-damage-car','best-vauxhall-car',
  'where-to-find-vin-number-on-car','how-to-check-how-many-owners-a-car-has-had',
  'what-is-the-best-used-suv-to-buy-in','what-is-considered-bad-gas-mileage',
  'best-family-suv-2024','best-used-electric-cars','how-to-check-equipment-by-vin-number',
  'why-a-mileage-check-is-crucial-when-buying-a-used-car',
  'why-a-hyundai-vin-check-is-crucial-before-you-buy-a-used-car-in-europe',
  'how-to-check-engine-size-by-vin-number','what-is-the-best-site-to-check-the-vin-number',
  'how-to-jump-start-a-car-a-comprehensive-guide','tips-for-securing-your-vehicle-at-night',
  'electrifying-savings-finding-the-cheapest-electric-car-in-ireland',
  'european-car-check-tools-7-essential-resources-for-every-european-car-owner',
  'how-much-does-it-cost-to-charge-an-electric-car-in-ireland',
  'the-check-engine-light-on-car-what-does-it-mean',
]

// Auto-assign rules for posts with no WP category or "Uncategorized"
const AUTO_ASSIGN = [
  { keywords: ['vin', 'chassis', 'decode', 'vin-check', 'vin number', 'vin etching', 'vin cloning'], category: 'VIN & Vehicle Check' },
  { keywords: ['electric', 'ev', 'charge', 'hybrid'], category: 'Electric Vehicles' },
  { keywords: ['buy', 'purchase', 'suv', 'best', 'used'], category: 'Buying Guide' },
  { keywords: ['mileage', 'fuel', 'gas', 'economy', 'mpg'], category: 'Fuel & Mileage' },
  { keywords: ['safety', 'flood', 'accident', 'damage', 'secure', 'night'], category: 'Car Safety' },
  { keywords: ['brand', 'peugeot', 'citroen', 'vauxhall', 'volvo', 'bmw', 'hyundai', 'european car'], category: 'Car Brands' },
  { keywords: ['engine', 'dashboard', 'module', 'light', 'jump start', 'speed'], category: 'Car Maintenance' },
]

function autoAssign(slug, title) {
  const text = (slug + ' ' + (title || '')).toLowerCase()
  for (const rule of AUTO_ASSIGN) {
    if (rule.keywords.some(k => text.includes(k))) return rule.category
  }
  return 'Tips & Guides'
}

function clean(s) { return (s || '').replace(/\s+/g, ' ').trim() }

async function login() {
  const res = await fetch(`${PAYLOAD_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  })
  token = (await res.json()).token
}

async function main() {
  console.log('\n═══════════════════════════════════════')
  console.log('  FIX BLOG CATEGORIES')
  console.log('═══════════════════════════════════════\n')

  await login()

  // Step 1: Scrape WP categories for all posts
  console.log('  Scraping WP categories...')
  const postCategories = {} // slug -> category label

  for (const slug of SLUGS) {
    try {
      const res = await fetch(`https://vehiclehistory.eu/blog/${slug}`, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        signal: AbortSignal.timeout(10000),
      })
      const html = await res.text()
      const $ = cheerio.load(html)

      let cat = $('meta[property="article:section"]').attr('content')?.trim()
      if (!cat || cat === 'Uncategorized') {
        // Try article:tag
        cat = $('meta[property="article:tag"]').attr('content')?.trim()
      }
      if (!cat || cat === 'Uncategorized') {
        // Auto-assign
        const title = clean($('h1').first().text())
        cat = autoAssign(slug, title)
      }

      // Normalize WP category names
      if (cat === 'tips') cat = 'Tips & Guides'
      if (cat === 'news') cat = 'News'
      if (cat === 'VIN Number') cat = 'VIN & Vehicle Check'

      postCategories[slug] = cat
    } catch {
      postCategories[slug] = autoAssign(slug, '')
    }

    await new Promise(r => setTimeout(r, 200))
  }

  // Show distribution
  const catCounts = {}
  for (const cat of Object.values(postCategories)) {
    catCounts[cat] = (catCounts[cat] || 0) + 1
  }
  console.log('  Category distribution:')
  for (const [cat, count] of Object.entries(catCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`    ${cat}: ${count}`)
  }

  // Step 2: Delete old categories
  console.log('\n  Deleting old categories...')
  const oldCats = await (await fetch(`${PAYLOAD_URL}/api/categories?limit=50`, {
    headers: { Authorization: `JWT ${token}` },
  })).json()
  for (const c of oldCats.docs) {
    await fetch(`${PAYLOAD_URL}/api/categories/${c.id}`, {
      method: 'DELETE',
      headers: { Authorization: `JWT ${token}` },
    })
  }
  console.log(`  Deleted ${oldCats.docs.length} old categories`)

  // Step 3: Create new categories
  console.log('\n  Creating new categories...')
  const categoryMap = {} // label -> id
  for (const label of new Set(Object.values(postCategories))) {
    const value = label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    const res = await fetch(`${PAYLOAD_URL}/api/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}` },
      body: JSON.stringify({ label, value }),
    })
    const result = await res.json()
    categoryMap[label] = result.doc?.id
    console.log(`    ${label} (${value}) -> id: ${result.doc?.id}`)
  }

  // Step 4: Update all posts with categories
  console.log('\n  Updating posts...')
  const posts = await (await fetch(`${PAYLOAD_URL}/api/posts?limit=100&depth=0`, {
    headers: { Authorization: `JWT ${token}` },
  })).json()

  let updated = 0
  for (const post of posts.docs) {
    const catLabel = postCategories[post.slug]
    const catId = catLabel ? categoryMap[catLabel] : null
    if (!catId) continue

    await fetch(`${PAYLOAD_URL}/api/posts/${post.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}` },
      body: JSON.stringify({ categories: [catId] }),
    })
    updated++
  }

  console.log(`  Updated ${updated} posts`)
  console.log('\n═══════════════════════════════════════\n')
}

main().catch(e => { console.error('Fatal:', e.message); process.exit(1) })
