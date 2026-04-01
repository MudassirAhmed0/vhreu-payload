#!/usr/bin/env node
/**
 * Scrapes VIN Check country pages to understand the section structure.
 * Extracts section headings, content types, and key data from each page.
 *
 * Usage:
 *   node scripts/migration/scrape-countries.mjs
 *   node scripts/migration/scrape-countries.mjs --country germany
 *   node scripts/migration/scrape-countries.mjs --limit 10
 */

import * as cheerio from 'cheerio'
import { writeFileSync } from 'fs'

const BASE = 'https://vehiclehistory.eu'

const COUNTRIES = [
  'germany', 'france', 'italy', 'united-kingdom', 'poland',
  'spain', 'austria', 'belgium', 'croatia', 'czech-republic',
]

async function fetchPage(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.text()
}

function cleanText(str) {
  return (str || '').replace(/\s+/g, ' ').trim()
}

async function scrapeCountryPage(slug) {
  const url = `${BASE}/vin-check/${slug}`
  const html = await fetchPage(url)
  const $ = cheerio.load(html)

  const sections = []

  // Find all top-level sections
  $('section, [class*="section"], .e-con.e-parent').each((_, el) => {
    const $el = $(el)

    // Skip hidden, nav, header, footer
    if ($el.closest('header, footer, nav').length) return
    if ($el.attr('hidden') !== undefined) return
    const cls = $el.attr('class') || ''
    if (/modal|overlay|popup|exit-intent|hidden|invisible/.test(cls)) return

    // Must have meaningful content
    const textLen = $el.text().trim().length
    if (textLen < 30) return

    // Get all headings
    const headings = []
    $el.find('h1, h2, h3, h4').each((_, h) => {
      const text = cleanText($(h).text())
      if (text && text.length > 3) {
        headings.push({ level: h.tagName.toLowerCase(), text })
      }
    })

    // Get paragraphs
    const paragraphs = []
    $el.find('p').each((_, p) => {
      const text = cleanText($(p).text())
      if (text && text.length > 15) paragraphs.push(text.slice(0, 150))
    })

    // Get lists
    const lists = []
    $el.find('ul, ol').each((_, list) => {
      const items = []
      $(list).children('li').each((_, li) => {
        const text = cleanText($(li).text())
        if (text) items.push(text.slice(0, 80))
      })
      if (items.length > 0) lists.push(items)
    })

    // Get links
    const links = []
    $el.find('a').each((_, a) => {
      const href = $(a).attr('href') || ''
      const text = cleanText($(a).text())
      if (text && href && !href.startsWith('#') && text.length > 3) {
        links.push({ text: text.slice(0, 50), href: href.slice(0, 80) })
      }
    })

    // Check for forms
    const hasForms = $el.find('input, form, button[type="submit"]').length > 0

    // Check for FAQ/accordion
    const hasFAQ = $el.find('[class*="accordion"], [class*="toggle"], details, [class*="faq"]').length > 0

    // Check for cards/grid
    const hasCards = $el.find('[class*="card"], [class*="grid"]').length > 0

    if (headings.length > 0 || paragraphs.length > 0) {
      sections.push({
        headings,
        paragraphs: paragraphs.slice(0, 5),
        lists: lists.slice(0, 3),
        links: links.slice(0, 5),
        hasForms,
        hasFAQ,
        hasCards,
        textLength: textLen,
      })
    }
  })

  // Deduplicate sections by first heading
  const seen = new Set()
  const deduped = sections.filter(s => {
    const key = s.headings[0]?.text || s.paragraphs[0] || Math.random()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  return { slug, url, totalSections: deduped.length, sections: deduped }
}

// ── Main ──

const args = process.argv.slice(2)
const countryFilter = args.includes('--country') ? args[args.indexOf('--country') + 1] : null
const limit = args.includes('--limit') ? parseInt(args[args.indexOf('--limit') + 1]) : 10

const slugs = countryFilter ? [countryFilter] : COUNTRIES.slice(0, limit)
const results = []

for (const slug of slugs) {
  process.stderr.write(`Scraping /vin-check/${slug}...`)
  try {
    const data = await scrapeCountryPage(slug)
    results.push(data)
    process.stderr.write(` ${data.totalSections} sections\n`)

    // Print summary
    console.log(`\n═══ ${slug.toUpperCase()} (${data.totalSections} sections) ═══`)
    data.sections.forEach((s, i) => {
      const heading = s.headings[0]?.text?.slice(0, 70) || '(no heading)'
      const type = []
      if (s.hasForms) type.push('FORM')
      if (s.hasFAQ) type.push('FAQ')
      if (s.hasCards) type.push('CARDS')
      if (s.lists.length > 0) type.push('LIST')

      console.log(`  ${(i + 1).toString().padStart(2)}. [${s.headings[0]?.level || '?'}] ${heading}`)
      if (type.length) console.log(`      Type: ${type.join(', ')}`)
      if (s.paragraphs[0]) console.log(`      Desc: ${s.paragraphs[0].slice(0, 100)}...`)
      if (s.headings.length > 1) {
        const subheadings = s.headings.slice(1, 5).map(h => `[${h.level}] ${h.text.slice(0, 40)}`).join(' | ')
        console.log(`      Subs: ${subheadings}`)
      }
    })
  } catch (err) {
    process.stderr.write(` ERROR: ${err.message}\n`)
  }
}

writeFileSync('scraped-countries.json', JSON.stringify(results, null, 2))
console.log(`\n\nSaved to scraped-countries.json`)

// Cross-page comparison
console.log('\n═══ SECTION PATTERN ANALYSIS ═══')
const headingPatterns = {}
for (const page of results) {
  for (const section of page.sections) {
    const h = section.headings[0]?.text || ''
    // Normalize — remove country name to find pattern
    const normalized = h
      .replace(/Germany|France|Italy|United Kingdom|Poland|Spain|Austria|Belgium|Croatia|Czech Republic/gi, '{COUNTRY}')
      .trim()
    if (normalized.length > 10) {
      headingPatterns[normalized] = (headingPatterns[normalized] || 0) + 1
    }
  }
}
// Sort by frequency
const sorted = Object.entries(headingPatterns).sort((a, b) => b[1] - a[1])
console.log('\nMost common section patterns across pages:')
sorted.forEach(([pattern, count]) => {
  console.log(`  ${count}/${results.length}x  ${pattern.slice(0, 80)}`)
})
