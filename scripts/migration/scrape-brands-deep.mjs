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

// Only include h3+p pairs whose title matches VIN anatomy terms
const VIN_SEGMENT_TERMS = [
  'manufacturer', 'wmi', 'vds', 'vis', 'check digit', 'model year',
  'assembly plant', 'production sequence', 'vehicle descriptor',
  'vehicle identifier', 'sequential', 'serial number', 'plant code',
  'country of origin', 'vehicle type', 'vehicle attributes', 'attributes',
  'production year', 'characters ', 'year code', 'production number',
  'engine type', 'transmission', 'vehicle brand', 'plant of manufacture',
  'body type', 'restraint', 'model line',
]

function isVinSegment(title) {
  const t = title.toLowerCase()
  return VIN_SEGMENT_TERMS.some(p => t.includes(p))
}

function extractVinStructure($) {
  let targetH2 = null
  $('h2').each((_, el) => {
    const t = clean($(el).text()).toLowerCase()
    if (t.includes('contain') && (t.includes('vin') || t.includes('decoder') || t.includes('lookup') || t.includes('check'))) {
      targetH2 = $(el); return false
    }
  })
  if (!targetH2) return null

  const heading = clean(targetH2.text())
  const headingLevel = targetH2[0].tagName.toLowerCase()

  const section = targetH2.closest('.elementor-top-section')
  if (!section.length) return null

  // Strategy 1: h3+p pairs (standard layout)
  // Strategy 2: paragraphs with "Label: description" format (Fiat, VW, etc.)
  const segments = []
  section.find('.elementor-widget-text-editor').each((_, widget) => {
    const $w = $(widget)

    // Strategy 1: heading+p pairs
    if ($w.find('h2, h3, h4').length > 0) {
      let currentTitle = null
      let currentTag = null
      $w.find('h2, h3, h4, p').each((_, el) => {
        const tag = el.tagName.toLowerCase()
        const text = clean($(el).text())
        if (!text) return

        if (/^h[2-4]$/.test(tag)) {
          currentTitle = text
          currentTag = tag
        } else if (tag === 'p' && currentTitle && text.length > 15) {
          if (isVinSegment(currentTitle)) {
            segments.push({ title: currentTitle, titleElement: currentTag, description: text })
          }
          currentTitle = null
        }
      })
      return
    }

    // Strategy 2: paragraphs with "Label: description" or "Label(ABBR): description"
    $w.find('p').each((_, el) => {
      const text = clean($(el).text())
      if (!text || text.length < 20) return
      const match = text.match(/^([A-Z][^:]{2,40}):\s*(.+)/)
      if (match && isVinSegment(match[1])) {
        segments.push({ title: match[1].trim(), titleElement: 'p', description: match[2].trim() })
      }
    })

    // Strategy 3: list items (<li>) — match by VIN terms or "character/digit" sentences
    if (segments.length === 0) {
      $w.find('li').each((_, el) => {
        const text = clean($(el).text())
        if (!text || text.length < 5) return
        if (isVinSegment(text)) {
          segments.push({ title: text, titleElement: 'li', description: text })
        } else {
          const digitMatch = text.match(/^(?:\d[\-–]?\d?\.\s*)?[Tt]he\s+(.+?)\s+(?:character|digit)s?\s+(.+)/)
          if (digitMatch) {
            segments.push({ title: text, titleElement: 'li', description: text })
          }
        }
      })
    }
  })

  if (segments.length === 0) return null
  return { type: 'vin-structure', heading, headingLevel, segments }
}

function extractWhereToFindVin($) {
  let targetHeading = null
  $('h2, h3').each((_, el) => {
    const t = clean($(el).text()).toLowerCase()
    if (t.includes('where to find') && t.includes('vin')) { targetHeading = $(el); return false }
  })
  if (!targetHeading) return null

  const heading = clean(targetHeading.text())
  const headingLevel = targetHeading[0].tagName.toLowerCase()
  const section = targetHeading.closest('.elementor-top-section')
  if (!section.length) return null

  // Locations are numbered h3+p pairs in a text-editor widget
  const locations = []
  section.find('.elementor-widget-text-editor').each((_, widget) => {
    const $w = $(widget)
    let currentTitle = null
    let currentTag = null
    $w.find('h2, h3, h4, p').each((_, el) => {
      const tag = el.tagName.toLowerCase()
      const text = clean($(el).text())
      if (!text) return

      if (/^h[2-4]$/.test(tag) && /^\d+\./.test(text)) {
        currentTitle = text.replace(/^\d+\.\s*/, '')
        currentTag = tag
      } else if (tag === 'p' && currentTitle && text.length > 15) {
        locations.push({ title: currentTitle, titleElement: currentTag, description: text })
        currentTitle = null
      }
    })
  })

  // Image — look for "where-to-find" in src, or "location of vin number on car" in alt
  let imageUrl = null
  let imageAlt = null
  section.find('img').each((_, img) => {
    const src = $(img).attr('data-lazy-src') || $(img).attr('data-src') || $(img).attr('src') || ''
    const alt = ($(img).attr('alt') || '').toLowerCase()
    if (!imageUrl && (src.includes('where-to-find') || alt.includes('location of vin number on car'))) {
      imageUrl = src || null
      imageAlt = $(img).attr('alt') || null
    }
  })

  if (locations.length === 0) return null
  return { type: 'where-to-find-vin', heading, headingLevel, locations, imageUrl, imageAlt }
}

function extractSampleReport($) {
  let targetHeading = null
  $('h2, h3, span.elementor-heading-title').each((_, el) => {
    const t = clean($(el).text()).toLowerCase()
    if (t === 'sample report') { targetHeading = $(el); return false }
  })
  if (!targetHeading) return null

  const heading = clean(targetHeading.text())
  const headingLevel = targetHeading[0].tagName.toLowerCase()
  const section = targetHeading.closest('.elementor-top-section')
  if (!section.length) return null

  let vehicleTitle = null
  let specs = []
  let reportLink = null
  let imageUrl = null
  let imageAlt = null

  // Find the inner-section that contains the report image
  section.find('.elementor-inner-section').each((_, inner) => {
    const $inner = $(inner)
    const hasReportImg = $inner.find('img').toArray().some(img => {
      const src = $(img).attr('data-lazy-src') || $(img).attr('data-src') || $(img).attr('src') || ''
      return src.includes('report')
    })
    if (!hasReportImg) return

    // Vehicle title — span heading that's NOT "Sample Report" or "Click"
    $inner.find('.elementor-heading-title').each((_, el) => {
      const t = clean($(el).text())
      const tl = t.toLowerCase()
      if (!vehicleTitle && t.length > 5 && !tl.includes('sample') && !tl.includes('click')) {
        vehicleTitle = t
      }
    })

    // Specs from text-editor — split on known prefixes
    $inner.find('.elementor-widget-text-editor').each((_, widget) => {
      const text = clean($(widget).text())
      if (text.includes('VIN:')) {
        const prefixes = ['VIN:', 'Body Style:', 'Engine:', 'Country of Assembly:']
        specs = []
        for (let i = 0; i < prefixes.length; i++) {
          const start = text.indexOf(prefixes[i])
          if (start === -1) continue
          const end = i < prefixes.length - 1
            ? prefixes.slice(i + 1).reduce((min, p) => { const idx = text.indexOf(p); return idx > -1 && idx < min ? idx : min }, text.length)
            : text.length
          specs.push(text.slice(start, end).trim())
        }
      }
    })

    // Link
    $inner.find('a').each((_, a) => {
      const t = clean($(a).text()).toLowerCase()
      if (t.includes('full report') || t.includes('see full')) {
        reportLink = $(a).attr('href')?.split('?')[0] || null
      }
    })

    // Image
    $inner.find('img').each((_, img) => {
      const src = $(img).attr('data-lazy-src') || $(img).attr('data-src') || $(img).attr('src') || ''
      if (src.includes('report') && !imageUrl) {
        imageUrl = src
        imageAlt = $(img).attr('alt') || null
      }
    })
  })

  return { type: 'sample-report', heading, headingLevel, vehicleTitle, specs, reportLink, imageUrl, imageAlt }
}

function extractHowToDecode($) {
  let targetH2 = null
  $('h2, h3').each((_, el) => {
    const t = clean($(el).text()).toLowerCase()
    if ((t.includes('how to use') || t.includes('how to decode') || t.includes('how to check')) && t.includes('vin')) {
      targetH2 = $(el); return false
    }
  })
  if (!targetH2) return null

  const heading = clean(targetH2.text())
  const headingLevel = targetH2[0].tagName.toLowerCase()
  const section = targetH2.closest('.elementor-top-section')
  if (!section.length) return null

  const steps = []
  let imageUrl = null
  let imageAlt = null

  // Strategy 1: find inner-section with VIN image (standard layout)
  // Strategy 2: fall back to any text-editor with "Step" headings in the section
  const innerSections = section.find('.elementor-inner-section').toArray()

  // Try inner-sections with VIN image first
  let found = false
  for (const inner of innerSections) {
    const $inner = $(inner)
    const hasVinImg = $inner.find('img').toArray().some(img => {
      const src = $(img).attr('data-lazy-src') || $(img).attr('data-src') || $(img).attr('src') || ''
      return src.includes('without-bg') || src.includes('vin-number') || src.includes('17-digit')
    })

    if (hasVinImg) {
      extractStepsFromWidget($inner, $, steps)
      $inner.find('img').each((_, img) => {
        const src = $(img).attr('data-lazy-src') || $(img).attr('data-src') || $(img).attr('src') || ''
        if (!imageUrl && src.length > 10) { imageUrl = src; imageAlt = $(img).attr('alt') || null }
      })
      found = true
      break
    }
  }

  // Fallback: search all text-editors in the section for step patterns
  if (!found) {
    section.find('.elementor-widget-text-editor').each((_, widget) => {
      extractStepsFromWidget($(widget), $, steps)
    })
    // Look for any image in inner-sections near the heading
    for (const inner of innerSections) {
      $(inner).find('img').each((_, img) => {
        const src = $(img).attr('data-lazy-src') || $(img).attr('data-src') || $(img).attr('src') || ''
        if (!imageUrl && (src.includes('without-bg') || src.includes('vin-number') || src.includes('17-digit'))) {
          imageUrl = src; imageAlt = $(img).attr('alt') || null
        }
      })
    }
  }

  if (steps.length === 0) return null
  return { type: 'how-to-decode', heading, headingLevel, steps, imageUrl, imageAlt }
}

function extractStepsFromWidget($container, $, steps) {
  $container.find('.elementor-widget-text-editor, .elementor-widget-container').each((_, widget) => {
    let currentTitle = null
    let currentTag = null
    $(widget).find('h2, h3, h4, p').each((_, el) => {
      const tag = el.tagName.toLowerCase()
      const text = clean($(el).text())
      if (!text) return
      if (/^h[2-4]$/.test(tag) && text.toLowerCase().includes('step')) {
        currentTitle = text
        currentTag = tag
      } else if (tag === 'p' && currentTitle && text.length > 15) {
        // Avoid duplicates
        if (!steps.some(s => s.title === currentTitle)) {
          steps.push({ title: currentTitle, titleElement: currentTag, description: text })
        }
        currentTitle = null
      }
    })
  })
}

const LEARN_TERMS = [
  'specification', 'manufacturing', 'accident', 'mileage', 'odometer',
  'title', 'lien', 'auction', 'service', 'maintenance', 'ownership',
  'theft', 'recall', 'damage', 'salvage', 'insurance', 'inspection',
]

function isLearnItem(title) {
  const t = title.toLowerCase()
  return LEARN_TERMS.some(p => t.includes(p))
}

function extractWhatYoullLearn($) {
  let targetH2 = null
  $('h2').each((_, el) => {
    const t = clean($(el).text()).toLowerCase()
    if (t.includes('what') && t.includes('learn') && t.includes('vin')) {
      targetH2 = $(el); return false
    }
  })
  if (!targetH2) return null

  const heading = clean(targetH2.text())
  const headingLevel = targetH2[0].tagName.toLowerCase()
  const section = targetH2.closest('.elementor-top-section')
  if (!section.length) return null

  // Content is in a single text-editor widget: intro paragraph, h3+p items, closing paragraph
  let introParagraph = null
  let closingParagraph = null
  const items = []

  section.find('.elementor-widget-text-editor').each((_, widget) => {
    const $w = $(widget)
    // Only the widget with h3/h4 sub-items
    if ($w.find('h3, h4').length === 0) return

    let currentTitle = null
    let currentTag = null
    let foundFirstHeading = false

    $w.find('h2, h3, h4, p').each((_, el) => {
      const tag = el.tagName.toLowerCase()
      const text = clean($(el).text())
      if (!text) return

      if (/^h[2-4]$/.test(tag)) {
        if (currentTitle) items.push({ title: currentTitle, titleElement: currentTag, description: '' })
        currentTitle = text.replace(/^[\d]+\.\s*/, '')
        currentTag = tag
        foundFirstHeading = true
      } else if (tag === 'p') {
        if (!foundFirstHeading && text.length > 30) {
          introParagraph = text
        } else if (currentTitle && isLearnItem(currentTitle)) {
          items.push({ title: currentTitle, titleElement: currentTag, description: text })
          currentTitle = null
        } else if (currentTitle) {
          currentTitle = null // skip non-matching items
        } else if (foundFirstHeading && items.length > 0 && text.length > 50) {
          closingParagraph = text
        }
      }
    })
  })

  if (items.length === 0) return null
  return { type: 'what-youll-learn', heading, headingLevel, introParagraph, items, closingParagraph }
}

function extractFaq($) {
  let targetH2 = null
  $('h2').each((_, el) => {
    const t = clean($(el).text()).toLowerCase()
    if (t.includes('faq') && (t.includes('vin') || t.includes('decoder'))) {
      targetH2 = $(el); return false
    }
  })
  if (!targetH2) return null

  const heading = clean(targetH2.text())
  const headingLevel = targetH2[0].tagName.toLowerCase()
  const section = targetH2.closest('.elementor-top-section')
  if (!section.length) return null

  const items = []
  let questionElement = null
  section.find('.elementor-accordion-item').each((_, item) => {
    const $item = $(item)
    const $title = $item.find('.elementor-tab-title').first()
    const question = clean($title.find('a').text() || $title.text())
      .replace(/^Q:\s*/i, '')
    const answer = clean($item.find('.elementor-tab-content').first().text())
      .replace(/^A:\s*/i, '')
    // Capture the actual element tag of the accordion title
    if (!questionElement && $title.length) {
      questionElement = $title[0].tagName.toLowerCase()
    }
    if (question && answer) items.push({ question, answer })
  })

  if (items.length === 0) return null
  return { type: 'faq', heading, headingLevel, questionElement: questionElement || 'h3', items }
}

function extractOtherMakes($) {
  let targetHeading = null
  $('h2, h3').each((_, el) => {
    const t = clean($(el).text()).toLowerCase()
    if (t.includes('other makes') && t.includes('vin')) { targetHeading = $(el); return false }
  })
  if (!targetHeading) return null

  const heading = clean(targetHeading.text())
  const headingLevel = targetHeading[0].tagName.toLowerCase()

  // Brand links are in icon-list widgets within the same section/template
  const parent = targetHeading.closest('.elementor-top-section, .elementor-widget-template')?.parent() || targetHeading.parent()
  const brands = []
  const seen = new Set()

  parent.find('a').each((_, a) => {
    const label = clean($(a).text())
    const href = $(a).attr('href') || ''
    if (label && href.includes('/vin-decoder/') && !seen.has(label)) {
      seen.add(label)
      // Convert absolute to relative
      const relHref = href.replace(/^https?:\/\/[^/]+/, '')
      brands.push({ label, href: relHref })
    }
  })

  if (brands.length === 0) return null
  return { type: 'other-makes', heading, headingLevel, brands }
}

function extractModelsList($) {
  let targetHeading = null
  $('h2, h3').each((_, el) => {
    const t = clean($(el).text()).toLowerCase()
    if (t.includes('model') && (t.includes('list') || t.includes('compatible') || t.includes('work'))) { targetHeading = $(el); return false }
  })
  if (!targetHeading) return null

  const heading = clean(targetHeading.text())
  const headingLevel = targetHeading[0].tagName.toLowerCase()
  const section = targetHeading.closest('.elementor-top-section')
  if (!section.length) return null

  // Models are in a ul>li list inside a text-editor widget
  const models = []
  section.find('.elementor-widget-text-editor ul li').each((_, li) => {
    const text = clean($(li).text())
    if (text) models.push(text)
  })

  if (models.length === 0) return null
  return { type: 'models-list', heading, headingLevel, models }
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

  // 3. VIN Structure (WMI/VDS/VIS breakdown)
  const vinStructure = extractVinStructure($)
  if (vinStructure) sections.vinStructure = vinStructure

  // 4. Where to Find VIN (split-content: locations left, image right)
  const whereToFind = extractWhereToFindVin($)
  if (whereToFind) sections.whereToFind = whereToFind

  // 5. Models List
  const modelsList = extractModelsList($)
  if (modelsList) sections.modelsList = modelsList

  // 6. Sample Report
  const sampleReport = extractSampleReport($)
  if (sampleReport) sections.sampleReport = sampleReport

  // 7. How to Decode (split-content reversed: image left, steps right)
  const howToDecode = extractHowToDecode($)
  if (howToDecode) sections.howToDecode = howToDecode

  // 8. What You'll Learn (card-grid with icons)
  const whatYoullLearn = extractWhatYoullLearn($)
  if (whatYoullLearn) sections.whatYoullLearn = whatYoullLearn

  // 9. FAQ (accordion)
  const faq = extractFaq($)
  if (faq) sections.faq = faq

  // 10. Other Makes (brand link grid)
  const otherMakes = extractOtherMakes($)
  if (otherMakes) sections.otherMakes = otherMakes

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
