#!/usr/bin/env node
/**
 * Stage 1: Scrape Window Sticker brand pages.
 * Extracts structured content per section.
 *
 * Outputs scraped-window-stickers.json
 *
 * Usage:
 *   node scrape-window-sticker-deep.mjs                  # all 10 brands
 *   node scrape-window-sticker-deep.mjs --brand ford     # single brand
 *   node scrape-window-sticker-deep.mjs --dry-run        # list brands only
 */

import * as cheerio from 'cheerio'
import { writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const BASE = 'https://vehiclehistory.eu'

const BRANDS = [
  { name: 'Ford', slug: 'ford' },
  { name: 'Toyota', slug: 'toyota' },
  { name: 'Subaru', slug: 'subaru' },
  { name: 'Dodge', slug: 'dodge' },
  { name: 'Porsche', slug: 'porsche' },
  { name: 'BMW', slug: 'bmw' },
  { name: 'Hyundai', slug: 'hyundai' },
  { name: 'Chrysler', slug: 'chrysler' },
  { name: 'Chevrolet', slug: 'chevrolet' },
  { name: 'Jeep', slug: 'jeep' },
]

// ── Helpers ────────────────────────────────────────────────────────

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

// ── Section extractors ─────────────────────────────────────────────

function extractHero($) {
  const h1 = $('h1').first()
  const heading = clean(h1.text())
  const heroParent = h1.closest('.e-con.e-parent')
  let description = null
  if (heroParent.length) {
    heroParent.find('p').each((_, p) => {
      const t = clean($(p).text())
      if (t.length > 30 && !t.includes('10% OFF') && !t.includes('phone number') && !description) {
        description = t
      }
    })
  }
  return { type: 'hero', heading, description }
}

/**
 * Find a section's .e-con.e-parent by matching h2 heading text.
 * Uses a Set to track already-matched parents to avoid duplicates.
 */
function findSection($, keywords, matched) {
  let found = null
  $('h2').each((_, el) => {
    const $el = $(el)
    const text = clean($el.text()).toLowerCase().replace(/[\u2018\u2019\u2032]/g, "'").replace(/[\u201C\u201D\u2033]/g, '"')
    const parent = $el.closest('.e-con.e-parent')
    if (!parent.length || matched.has(parent[0])) return
    if (keywords.some(k => text.includes(k))) {
      found = parent
      matched.add(parent[0])
      return false
    }
  })
  return found
}

/** Extract CTA buttons from a section */
function extractCtas($, section) {
  const ctas = []
  section.find('a.elementor-button, .elementor-button-wrapper a, a[role="button"]').each((_, a) => {
    const text = clean($(a).text())
    const href = $(a).attr('href') || '#'
    if (text.length > 3 && !ctas.some(c => c.text === text)) {
      ctas.push({ text, href })
    }
  })
  return ctas
}

function extractWhatsOn($, section) {
  // Find the correct H2 — may not be the first one if sharing parent
  let heading = null
  section.find('h2').each((_, el) => {
    const t = clean($(el).text())
    const lower = t.toLowerCase().replace(/[\u2018\u2019\u2032]/g, "'")
    if (lower.includes("what's on") || lower.includes('what is on') || lower.includes("what you'll find") || lower.includes('what you will find')) {
      heading = t
    }
  })
  if (!heading) return null

  let introParagraph = null
  const categories = []

  let foundH2 = false
  let currentCategory = null

  section.find('h2, h3, h4, p').each((_, el) => {
    const tag = el.tagName.toLowerCase()
    const text = clean($(el).text())
    if (tag === 'h2') {
      if (text === heading) { foundH2 = true; return }
      if (foundH2) return false // stop at next H2
      return
    }
    if (!foundH2) return

    if (tag === 'p' && text.length > 30 && !introParagraph && !currentCategory) {
      introParagraph = text
      return
    }
    if (tag === 'h3') {
      currentCategory = { title: text, titleElement: tag, description: null, subItems: [] }
      categories.push(currentCategory)
      return
    }
    if (tag === 'h4' && currentCategory) {
      currentCategory.subItems.push({ title: text, titleElement: tag, description: null })
      return
    }
    if (tag === 'p' && text.length > 15 && currentCategory) {
      if (currentCategory.subItems.length > 0) {
        const last = currentCategory.subItems[currentCategory.subItems.length - 1]
        if (!last.description) last.description = text
      } else if (!currentCategory.description) {
        currentCategory.description = text
      }
    }
  })

  const ctas = extractCtas($, section)
  return { type: 'whats-on', heading, introParagraph, categories, ctas }
}

function extractWhatIs($, section) {
  const heading = clean(section.find('h2').first().text())
  const paragraphs = []
  // Only grab paragraphs between this H2 and the next H2 (section boundary)
  let foundH2 = false
  section.find('h2, p').each((_, el) => {
    const tag = el.tagName.toLowerCase()
    if (tag === 'h2') {
      if (foundH2) return false // stop at next H2
      foundH2 = true
      return
    }
    if (tag === 'p' && foundH2) {
      const t = clean($(el).text())
      if (t.length > 30) paragraphs.push(t)
    }
  })
  const ctas = extractCtas($, section)
  return { type: 'what-is', heading, paragraphs, ctas }
}

function extractWhyNeed($, section) {
  const heading = clean(section.find('h2').first().text())
  let introParagraph = null
  const audiences = []

  let foundH2 = false
  let currentAudience = null

  section.find('h2, h3, h4, p').each((_, el) => {
    const tag = el.tagName.toLowerCase()
    const text = clean($(el).text())
    if (tag === 'h2') {
      if (!foundH2) { foundH2 = true; return }
      return false // stop at next H2
    }
    if (!foundH2) return

    if (tag === 'p' && text.length > 30 && !introParagraph && !currentAudience) {
      introParagraph = text
      return
    }
    if (tag === 'h3') {
      currentAudience = { title: text, description: null, benefits: [] }
      audiences.push(currentAudience)
      return
    }
    if (tag === 'h4' && currentAudience) {
      currentAudience.benefits.push({ title: text, description: null })
      return
    }
    if (tag === 'p' && text.length > 15 && currentAudience) {
      if (currentAudience.benefits.length > 0) {
        const last = currentAudience.benefits[currentAudience.benefits.length - 1]
        if (!last.description) last.description = text
      } else if (!currentAudience.description) {
        currentAudience.description = text
      }
    }
  })

  const ctas = extractCtas($, section)
  return { type: 'why-need', heading, introParagraph, audiences, ctas }
}

function extractHowToGet($, section) {
  const heading = clean(section.find('h2').first().text())
  let introParagraph = null
  const steps = []

  let foundH2 = false
  let currentStep = null

  section.find('h2, h3, p').each((_, el) => {
    const tag = el.tagName.toLowerCase()
    const text = clean($(el).text())
    if (tag === 'h2') {
      if (!foundH2) { foundH2 = true; return }
      return false
    }
    if (!foundH2) return

    if (tag === 'p' && text.length > 30 && !introParagraph && !currentStep) {
      introParagraph = text
      return
    }
    if (tag === 'h3') {
      currentStep = { title: text, description: null }
      steps.push(currentStep)
      return
    }
    if (tag === 'p' && text.length > 15 && currentStep && !currentStep.description) {
      currentStep.description = text
    }
  })

  const ctas = extractCtas($, section)
  return { type: 'how-to-get', heading, introParagraph, steps, ctas }
}

function extractWhyUse($, section) {
  const heading = clean(section.find('h2').first().text())
  let introParagraph = null
  const features = []

  let foundH2 = false
  let currentFeature = null

  section.find('h2, h3, h4, p').each((_, el) => {
    const tag = el.tagName.toLowerCase()
    const text = clean($(el).text())
    if (tag === 'h2') {
      if (!foundH2) { foundH2 = true; return }
      return false
    }
    if (!foundH2) return

    if (tag === 'p' && text.length > 30 && !introParagraph && !currentFeature) {
      introParagraph = text
      return
    }
    if (tag === 'h3' || tag === 'h4') {
      currentFeature = { title: text, titleElement: tag, description: null }
      features.push(currentFeature)
      return
    }
    if (tag === 'p' && text.length > 15 && currentFeature && !currentFeature.description) {
      currentFeature.description = text
    }
  })

  const ctas = extractCtas($, section)
  return { type: 'why-use', heading, introParagraph, features, ctas }
}

function extractWhereVin($, section) {
  const h2 = section.find('h2').first().text()
  const heading = clean(h2) || clean(section.find('h3').first().text())
  let introParagraph = null
  const locations = []

  // Find image (prefer data-src for lazy-loaded, skip SVG placeholders)
  let image = null
  section.find('img').each((_, img) => {
    const dataSrc = $(img).attr('data-lazy-src') || $(img).attr('data-src') || ''
    const src = $(img).attr('src') || ''
    const realSrc = dataSrc || src
    const alt = $(img).attr('alt') || ''
    if (realSrc && !image && !realSrc.includes('data:image') && !realSrc.includes('placeholder') && /\.(jpg|jpeg|png|webp)/i.test(realSrc)) {
      image = { src: realSrc.startsWith('http') ? realSrc : `https://vehiclehistory.eu${realSrc}`, alt }
    }
  })

  let foundHeading = false
  let currentLoc = null

  section.find('h2, h3, h4, p').each((_, el) => {
    const tag = el.tagName.toLowerCase()
    const text = clean($(el).text())
    // Trigger on the section heading (h2 or h3)
    if ((tag === 'h2' || tag === 'h3') && text === heading) {
      foundHeading = true
      return
    }
    if (tag === 'h2' && foundHeading) return false // stop at next H2
    if (!foundHeading) return

    if (tag === 'p' && text.length > 30 && !introParagraph && !currentLoc) {
      introParagraph = text
      return
    }
    if (tag === 'h3' || tag === 'h4') {
      currentLoc = { title: text, titleElement: 'h4', description: null }
      locations.push(currentLoc)
      return
    }
    if (tag === 'p' && text.length > 15 && currentLoc && !currentLoc.description) {
      currentLoc.description = text
    }
  })

  const ctas = extractCtas($, section)
  return { type: 'where-vin', heading, introParagraph, image, locations, ctas }
}

function extractCtaBanner($, section) {
  const heading = clean(section.find('h2').first().text())
  const paragraphs = []
  let foundH2 = false
  section.find('h2, p').each((_, el) => {
    const tag = el.tagName.toLowerCase()
    if (tag === 'h2') { if (foundH2) return false; foundH2 = true; return }
    if (tag === 'p' && foundH2) {
      const t = clean($(el).text())
      if (t.length > 15) paragraphs.push(t)
    }
  })
  const ctas = extractCtas($, section)
  return { type: 'cta-banner', heading, description: paragraphs[0] || null, ctas }
}

function extractAllManufacturers($, section) {
  const heading = clean(section.find('h2').first().text())
  const brands = []
  section.find('a').each((_, a) => {
    const text = clean($(a).text())
    const href = $(a).attr('href') || '#'
    if (text.length > 1 && text.length < 40 && !brands.some(b => b.name === text)) {
      brands.push({ name: text, href })
    }
  })
  return { type: 'all-manufacturers', heading, brands }
}

function extractFAQ($, section) {
  const heading = clean(section.find('h2').first().text())
  const items = []
  let foundH2 = false
  let currentQ = null

  section.find('h2, h3, h4, p, .elementor-tab-title, .elementor-tab-content').each((_, el) => {
    const tag = el.tagName.toLowerCase()
    const text = clean($(el).text())
    if (tag === 'h2') { if (foundH2) return false; foundH2 = true; return }
    if (!foundH2) return

    if (tag === 'h3' || tag === 'h4' || $(el).hasClass('elementor-tab-title')) {
      if (text.length > 10) {
        currentQ = { question: text, answer: null }
        items.push(currentQ)
      }
      return
    }
    if ((tag === 'p' || $(el).hasClass('elementor-tab-content')) && text.length > 15 && currentQ && !currentQ.answer) {
      currentQ.answer = text
    }
  })

  return { type: 'faq', heading, items }
}

// ── Main scraper ───────────────────────────────────────────────────

async function scrapeBrand(brand) {
  const url = `${BASE}/window-sticker/${brand.slug}`
  const html = await fetchPage(url)
  const $ = cheerio.load(html)

  const sections = {}

  // Meta data
  const meta = {
    title: clean($('title').text()) || null,
    description: $('meta[name="description"]').attr('content')?.trim() || null,
  }

  const matched = new Set()

  // 1. Hero
  sections.hero = extractHero($)

  // 2+3. What is + What's on (may share same DOM parent)
  const whatIsSec = findSection($, ['what is a', 'what is the'], matched)
  if (whatIsSec) {
    sections.whatIs = extractWhatIs($, whatIsSec)
    // Check if "What's on" lives in the same parent
    let hasWhatsOn = false
    whatIsSec.find('h2').each((_, el) => {
      const t = clean($(el).text()).toLowerCase().replace(/[\u2018\u2019\u2032]/g, "'")
      if (t.includes("what's on") || t.includes('what is on') || t.includes("what you'll find") || t.includes('what you will find')) {
        hasWhatsOn = true
      }
    })
    if (hasWhatsOn) {
      sections.whatsOn = extractWhatsOn($, whatIsSec)
    }
  }
  if (!sections.whatsOn) {
    const whatsOnSec = findSection($, ["what's on", 'what is on', "what you'll find", 'what you will find'], matched)
    if (whatsOnSec) sections.whatsOn = extractWhatsOn($, whatsOnSec)
  }

  // 4. Why Do You Need
  const whyNeedSec = findSection($, ['why do you need', 'why you need'], matched)
  if (whyNeedSec) sections.whyNeed = extractWhyNeed($, whyNeedSec)

  // 5. How to Get in 3 Steps
  const howToGetSec = findSection($, ['how to get', '3 steps', 'three steps'], matched)
  if (howToGetSec) sections.howToGet = extractHowToGet($, howToGetSec)

  // 6. Where to Find the VIN (may be H2 or H3)
  let whereVinSec = findSection($, ['where to find the vin', 'where to find your vin', 'vin location'], matched)
  let whereVinHeadingLevel = 'h2'
  if (!whereVinSec) {
    $('h3').each((_, el) => {
      const t = clean($(el).text()).toLowerCase()
      if (t.includes('where to find the vin') || t.includes('where to find your vin')) {
        const parent = $(el).closest('.e-con.e-parent')
        if (parent.length && !matched.has(parent[0])) {
          whereVinSec = parent
          whereVinHeadingLevel = 'h3'
          matched.add(parent[0])
          return false
        }
      }
    })
  }
  if (whereVinSec) {
    const data = extractWhereVin($, whereVinSec)
    data.headingLevel = whereVinHeadingLevel
    sections.whereVin = data
  }

  // 7. Why Use Our Tool
  const whyUseSec = findSection($, ['why should you use', 'why use our', 'why choose'], matched)
  if (whyUseSec) sections.whyUse = extractWhyUse($, whyUseSec)

  // 8. CTA Banner (may share parent with whyUse)
  if (sections.whyUse) {
    // Check if CTA banner lives in same parent as whyUse
    const whyUseSec2 = findSection($, ['why should you use', 'why use our', 'why choose'], new Set())
    if (whyUseSec2) {
      let ctaH2 = null
      whyUseSec2.find('h2').each((_, el) => {
        const t = clean($(el).text()).toLowerCase()
        if (t.includes('get your') || t.includes('ready to') || t.includes('start your')) {
          ctaH2 = clean($(el).text())
        }
      })
      if (ctaH2) {
        // Extract CTA from shared parent
        const paragraphs = []
        let foundCta = false
        whyUseSec2.find('h2, p').each((_, el) => {
          const tag = el.tagName.toLowerCase()
          const text = clean($(el).text())
          if (tag === 'h2' && text === ctaH2) { foundCta = true; return }
          if (foundCta && tag === 'p' && text.length > 15) paragraphs.push(text)
        })
        const ctas = extractCtas($, whyUseSec2)
        sections.ctaBanner = { type: 'cta-banner', heading: ctaH2, description: paragraphs[0] || null, ctas }
      }
    }
  }
  if (!sections.ctaBanner) {
    const ctaSec = findSection($, ['get your', 'ready to', 'start your'], matched)
    if (ctaSec) sections.ctaBanner = extractCtaBanner($, ctaSec)
  }

  // 9. All Manufacturers (heading is H3, not H2)
  let allMfgSec = null
  $('h3').each((_, el) => {
    const t = clean($(el).text()).toLowerCase()
    if (t.includes('all manufacturers') || t.includes('check any window sticker')) {
      const parent = $(el).closest('.e-con.e-parent')
      if (parent.length && !matched.has(parent[0])) {
        allMfgSec = parent
        matched.add(parent[0])
        return false
      }
    }
  })
  if (allMfgSec) {
    const heading = clean(allMfgSec.find('h3').first().text())
    let description = null
    allMfgSec.find('p').each((_, p) => {
      const t = clean($(p).text())
      if (t.length > 30 && !description) description = t
    })
    const brands = []
    allMfgSec.find('a').each((_, a) => {
      const text = clean($(a).text())
      const href = $(a).attr('href') || '#'
      if (text.length > 1 && text.length < 40 && !brands.some(b => b.name === text)) {
        brands.push({ name: text, href })
      }
    })
    sections.allManufacturers = { type: 'all-manufacturers', heading, headingLevel: 'h3', description, brands }
  }

  // 10. FAQ (heading in one e-parent, accordion in next sibling)
  const faqSec = findSection($, ['question', 'faq', 'frequently asked'], matched)
  if (faqSec) {
    const heading = clean(faqSec.find('h2').first().text())
    const items = []
    // Check next sibling for accordion
    const faqBody = faqSec.next('.e-con.e-parent')
    const container = faqBody.length ? faqBody : faqSec
    if (faqBody.length) matched.add(faqBody[0])
    container.find('.elementor-accordion-title, .elementor-toggle-title').each((_, el) => {
      const q = clean($(el).text())
      if (q.length > 10) items.push({ question: q, answer: null })
    })
    container.find('.elementor-tab-content, .elementor-toggle-item-content').each((i, el) => {
      const a = clean($(el).text())
      if (items[i] && a.length > 10) items[i].answer = a
    })
    if (items.length > 0) sections.faq = { type: 'faq', heading, items }
  }

  const sectionCount = Object.keys(sections).length
  return { slug: brand.slug, name: brand.name, url, sectionCount, meta, sections }
}

// ── CLI ────────────────────────────────────────────────────────────

const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const brandFilter = args.includes('--brand') ? args[args.indexOf('--brand') + 1] : null
const outFile = args.includes('--out') ? args[args.indexOf('--out') + 1] : join(__dirname, 'scraped-window-stickers.json')

async function main() {
  console.log('\n═══════════════════════════════════════')
  console.log('  SCRAPE WINDOW STICKER BRAND PAGES')
  console.log('═══════════════════════════════════════\n')

  const brands = brandFilter
    ? BRANDS.filter(b => b.slug === brandFilter)
    : BRANDS

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
  }

  writeFileSync(outFile, JSON.stringify(results, null, 2))
  console.log(`\n═══════════════════════════════════════`)
  console.log(`  Success: ${success}  Failed: ${failed}`)
  console.log(`  Output: ${outFile}`)
  console.log(`═══════════════════════════════════════\n`)
}

main()
