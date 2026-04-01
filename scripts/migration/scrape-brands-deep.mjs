#!/usr/bin/env node
/**
 * Stage 1: Scrape all VIN Decoder brand pages.
 * Extracts structured content for each logical section per page.
 *
 * Outputs scraped-brands.json — an array of brand objects with named sections.
 *
 * Usage:
 *   node scrape-brands-deep.mjs                    # all 16 brands
 *   node scrape-brands-deep.mjs --brand audi       # single brand
 *   node scrape-brands-deep.mjs --dry-run           # list brands only
 */

import * as cheerio from 'cheerio'
import { writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const BASE = 'https://vehiclehistory.eu'

const BRANDS = [
  { name: 'Acura', slug: 'acura' },
  { name: 'Alfa Romeo', slug: 'alfa-romeo' },
  { name: 'Audi', slug: 'audi' },
  { name: 'BMW', slug: 'bmw' },
  { name: 'Citroën', slug: 'citroen' },
  { name: 'Fiat', slug: 'fiat' },
  { name: 'Jaguar', slug: 'jaguar' },
  { name: 'Land Rover', slug: 'land-rover' },
  { name: 'Mercedes-Benz', slug: 'mercedes-benz' },
  { name: 'MINI', slug: 'mini' },
  { name: 'Peugeot', slug: 'peugeot' },
  { name: 'Porsche', slug: 'porsche' },
  { name: 'Renault', slug: 'renault' },
  { name: 'Saab', slug: 'saab' },
  { name: 'Volkswagen', slug: 'volkswagen' },
  { name: 'Volvo', slug: 'volvo' },
]

// ── Helpers ───────────────────────────────────────────────────────

function clean(str) {
  return (str || '').replace(/\s+/g, ' ').trim()
}

async function fetchPage(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
  return res.text()
}

// ── Section extractors ────────────────────────────────────────────

function extractHero($) {
  const h1 = $('h1').first()
  const heading = clean(h1.text())
  // Brand pages use classic Elementor (.elementor-top-section), not containers (.e-con.e-parent)
  const heroParent = h1.closest('.elementor-top-section')
  let description = null
  const features = []

  if (heroParent.length) {
    heroParent.find('p').each((_, p) => {
      const t = clean($(p).text())
      if (t.length > 30 && !t.includes('10% OFF') && !t.includes('phone number') && !description) {
        description = t
      }
    })

    // Extract feature badges (icon-box widgets in hero)
    const seen = new Set()
    heroParent.find('.elementor-icon-box-content').each((_, box) => {
      const $box = $(box)
      const titleEl = $box.find('.elementor-icon-box-title').first()
      const text = clean(titleEl.text())
      if (text && !seen.has(text)) {
        seen.add(text)
        const tag = titleEl.length ? titleEl[0].tagName.toLowerCase() : null
        features.push({ text, tag: /^h[1-6]$/.test(tag) ? tag : 'span' })
      }
    })
  }

  return { type: 'hero', heading, description, features }
}

function extractWhatIsVin($) {
  let targetH2 = null
  $('h2').each((_, el) => {
    const t = clean($(el).text()).toLowerCase()
    if (t.includes('what is') && t.includes('vin')) { targetH2 = $(el); return false }
  })
  if (!targetH2) return null

  const heading = clean(targetH2.text())
  const headingLevel = targetH2[0].tagName.toLowerCase()
  const section = targetH2.closest('.elementor-top-section')

  // Collect paragraphs between this H2 and the next H2
  const paragraphs = []
  let collecting = false
  section.find('h2, p').each((_, el) => {
    const tag = el.tagName.toLowerCase()
    const t = clean($(el).text())
    if (tag === 'h2' && t === heading) { collecting = true; return }
    if (tag === 'h2' && collecting) { collecting = false; return }
    if (collecting && tag === 'p' && t.length > 20) paragraphs.push(t)
  })

  // Image (data-lazy-src for lazy-loaded, or src)
  let imageUrl = null
  let imageAlt = null
  section.find('img').each((_, img) => {
    const alt = ($(img).attr('alt') || '').toLowerCase()
    if (alt.includes('vin') && (alt.includes('location') || alt.includes('decoder')) && !imageUrl) {
      imageUrl = $(img).attr('data-lazy-src') || $(img).attr('data-src') || $(img).attr('src') || null
      imageAlt = $(img).attr('alt') || null
    }
  })

  return { type: 'what-is-vin', heading, headingLevel, paragraphs, imageUrl, imageAlt }
}

// ── Main scraper ──────────────────────────────────────────────────

async function scrapeBrand(brand) {
  const url = `${BASE}/vin-decoder/${brand.slug}`
  const html = await fetchPage(url)
  const $ = cheerio.load(html)

  const sections = {}

  // Meta data
  const meta = {
    title: clean($('title').text()).replace(/\s*🚗$/, '') || null,
    description: $('meta[name="description"]').attr('content')?.trim() || null,
  }

  // 1. Hero (h1 — always first)
  sections.hero = extractHero($)

  // 2. What is a VIN (split-content: text left, image right)
  const whatIsVin = extractWhatIsVin($)
  if (whatIsVin) sections.whatIsVin = whatIsVin

  // Summary
  const sectionCount = Object.keys(sections).length
  return { slug: brand.slug, name: brand.name, url, sectionCount, meta, sections }
}

// ── CLI ───────────────────────────────────────────────────────────

const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const brandFilter = args.includes('--brand') ? args[args.indexOf('--brand') + 1] : null
const outFile = args.includes('--out') ? args[args.indexOf('--out') + 1] : join(__dirname, 'scraped-brands.json')

async function main() {
  console.log('\n═══════════════════════════════════════')
  console.log('  SCRAPE VIN DECODER BRAND PAGES')
  console.log('═══════════════════════════════════════\n')

  const brands = brandFilter
    ? BRANDS.filter(b => b.slug === brandFilter)
    : BRANDS

  if (brands.length === 0) {
    console.error(`Brand "${brandFilter}" not found.`)
    process.exit(1)
  }

  if (dryRun) {
    console.log(`Would scrape ${brands.length} brands:`)
    brands.forEach(b => console.log(`  ${b.name} (${b.slug})`))
    return
  }

  const results = []
  let success = 0
  let failed = 0

  for (const brand of brands) {
    process.stdout.write(`  ${brand.name.padEnd(25)}`)
    try {
      const data = await scrapeBrand(brand)
      results.push(data)
      console.log(`${data.sectionCount} sections`)
      success++
    } catch (err) {
      console.log(`FAILED: ${err.message}`)
      failed++
    }

    // Rate limit: 500ms between requests
    if (brands.length > 1) await new Promise(r => setTimeout(r, 500))
  }

  writeFileSync(outFile, JSON.stringify(results, null, 2))

  console.log(`\n═══════════════════════════════════════`)
  console.log(`  Success: ${success}  Failed: ${failed}`)
  console.log(`  Saved to ${outFile}`)
  console.log(`═══════════════════════════════════════\n`)
}

main().catch(err => {
  console.error('Fatal:', err.message)
  process.exit(1)
})
