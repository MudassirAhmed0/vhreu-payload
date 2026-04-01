#!/usr/bin/env node
/**
 * Stage 1: Scrape all VIN Check country pages.
 * Extracts structured content for all 13 logical sections per page.
 *
 * Outputs scraped-countries.json — an array of country objects with named sections.
 *
 * Usage:
 *   node scrape-country-deep.mjs                    # all 42 countries
 *   node scrape-country-deep.mjs --country germany   # single country
 *   node scrape-country-deep.mjs --dry-run            # list countries only
 */

import * as cheerio from 'cheerio'
import { writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const BASE = 'https://vehiclehistory.eu'

const COUNTRIES = [
  { name: 'Albania', slug: 'albania' },
  { name: 'Andorra', slug: 'andorra' },
  { name: 'Austria', slug: 'austria' },
  { name: 'Belarus', slug: 'belarus' },
  { name: 'Belgium', slug: 'belgium' },
  { name: 'Bosnia and Herzegovina', slug: 'bosnia-hertzegovina' },
  { name: 'Bulgaria', slug: 'bulgaria' },
  { name: 'Croatia', slug: 'croatia' },
  { name: 'Czech Republic', slug: 'czech-republic' },
  { name: 'Denmark', slug: 'denmark' },
  { name: 'Estonia', slug: 'estonia' },
  { name: 'Finland', slug: 'finland' },
  { name: 'France', slug: 'france' },
  { name: 'Germany', slug: 'germany' },
  { name: 'Greece', slug: 'greece' },
  { name: 'Holy See', slug: 'holy-see' },
  { name: 'Hungary', slug: 'hungary' },
  { name: 'Iceland', slug: 'iceland' },
  { name: 'Ireland', slug: 'ireland' },
  { name: 'Italy', slug: 'italy' },
  { name: 'Latvia', slug: 'latvia' },
  { name: 'Liechtenstein', slug: 'liechtenstein' },
  { name: 'Lithuania', slug: 'lithuania' },
  { name: 'Luxembourg', slug: 'luxembourg' },
  { name: 'Malta', slug: 'malta' },
  { name: 'Moldova', slug: 'moldova' },
  { name: 'Monaco', slug: 'monaco' },
  { name: 'Montenegro', slug: 'montenegro' },
  { name: 'North Macedonia', slug: 'north-macedonia' },
  { name: 'Norway', slug: 'norway' },
  { name: 'Poland', slug: 'poland' },
  { name: 'Romania', slug: 'romania' },
  { name: 'Russia', slug: 'russia' },
  { name: 'San Marino', slug: 'san-marino' },
  { name: 'Serbia', slug: 'serbia' },
  { name: 'Slovakia', slug: 'slovakia' },
  { name: 'Slovenia', slug: 'slovenia' },
  { name: 'Spain', slug: 'spain' },
  { name: 'Sweden', slug: 'sweden' },
  { name: 'Switzerland', slug: 'switzerland' },
  { name: 'Ukraine', slug: 'ukraine' },
  { name: 'United Kingdom', slug: 'united-kingdom' },
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

/**
 * Find a section's .e-con.e-parent by matching h2 heading text.
 * Uses a Set to track already-matched parents to avoid duplicates.
 */
function findSection($, keywords, matched) {
  let found = null
  $('h2').each((_, el) => {
    const $el = $(el)
    // Normalize smart quotes/apostrophes to straight for matching
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

/** Detect check (true) or X (false) from a table cell's HTML */
function detectCheckOrX($td) {
  const html = ($td.html() || '').toLowerCase()
  // CSS class-based (WordPress VIN table uses check-icon / cross-icon with stroke colors)
  if (html.includes('check-icon')) return true
  if (html.includes('cross-icon')) return false
  // SVG element-based fallback (polyline = checkmark, line = X)
  if (html.includes('<polyline')) return true
  if (html.includes('<line')) return false
  // Font Awesome
  if (/fa-check/i.test(html)) return true
  if (/fa-times|fa-xmark/i.test(html)) return false
  // Unicode
  if (html.includes('✓') || html.includes('✔')) return true
  if (html.includes('✗') || html.includes('✘') || html.includes('×')) return false
  // Inline fill/stroke colors
  if (/(?:fill|stroke)\s*[:=]\s*["']?#(?:4caf50|2ecc71|00aa00|22c55e|1d9c6b|28a745)/i.test(html)) return true
  if (/(?:fill|stroke)\s*[:=]\s*["']?#(?:f44336|e74c3c|cc0000|ef4444|d94040|dc3545)/i.test(html)) return false
  return null
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

function extractWhyCheck($, section) {
  const heading = clean(section.find('h2').first().text())
  const stats = []
  const seenDescs = new Set()

  // Find intro paragraph (some pages have one before stats)
  let introParagraph = null

  // Extract stat cards from leaf e-con.e-child elements
  section.find('.e-con.e-child').each((_, card) => {
    const $card = $(card)
    if ($card.find('.e-con.e-child').length > 0) return // skip wrappers
    const allPs = []
    $card.find('p').each((_, p) => {
      const t = clean($(p).text())
      if (t.length > 2) allPs.push(t)
    })
    if (allPs.length >= 2) {
      const num = allPs[0]
      const desc = allPs[allPs.length - 1]
      if (num.length < 20 && /\d/.test(num) && desc.length > 20 && !seenDescs.has(desc)) {
        seenDescs.add(desc)
        stats.push({ stat: num, description: desc })
      }
    }
  })

  // Check for intro paragraph (not inside stat cards)
  section.find('p').each((_, p) => {
    const $p = $(p)
    const t = clean($p.text())
    if (t.length > 30 && !seenDescs.has(t) && !introParagraph) {
      // Make sure this p is not inside a stat card
      const inChild = $p.closest('.e-con.e-child')
      if (!inChild.length || inChild.find('.e-con.e-child').length > 0) {
        introParagraph = t
      }
    }
  })

  return { type: 'why-check', heading, introParagraph, stats }
}

function extractWhatIsVinAndWhereToFind($, section) {
  const heading = clean(section.find('h2').first().text())
  const paragraphs = []
  const whereToFind = {
    type: 'where-to-find',
    heading: null,
    introParagraph: null,
    imageUrl: null,
    items: [],
  }
  let inWhere = false

  section.find('h2, h3, h4, p').each((_, el) => {
    const tag = el.tagName.toLowerCase()
    const text = clean($(el).text())
    if (tag === 'h2') return
    if (tag === 'h3' && text.toLowerCase().includes('where')) {
      inWhere = true
      whereToFind.heading = text
      whereToFind.headingLevel = tag
      return
    }
    if (inWhere) {
      if (tag === 'h4') {
        whereToFind.items.push({ title: text, description: null })
      } else if (tag === 'p' && text.length > 15) {
        if (whereToFind.items.length > 0) {
          const last = whereToFind.items[whereToFind.items.length - 1]
          if (!last.description) last.description = text
        } else if (!whereToFind.introParagraph) {
          whereToFind.introParagraph = text
        }
      }
    } else {
      if (tag === 'p' && text.length > 30) {
        paragraphs.push(text)
      }
    }
  })

  // Find image in the Where to Find area
  section.find('img').each((_, img) => {
    const src = $(img).attr('src') || $(img).attr('data-src') || ''
    if (src.includes('vin') || src.includes('where')) {
      whereToFind.imageUrl = src
    }
  })

  const whatIsVin = { type: 'what-is-vin', heading, paragraphs }
  return { whatIsVin, whereToFind }
}

function extractReportInfo($, section) {
  const heading = clean(section.find('h2').first().text())
  let introParagraph = null
  const categories = []

  // Walk h2 → first p (intro) → h3s with h4 sub-items
  let foundH2 = false
  let currentCategory = null

  section.find('h2, h3, h4, p').each((_, el) => {
    const tag = el.tagName.toLowerCase()
    const text = clean($(el).text())
    if (tag === 'h2') { foundH2 = true; return }
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
        // Paragraph after an h4 — assign to last sub-item
        const last = currentCategory.subItems[currentCategory.subItems.length - 1]
        if (!last.description) last.description = text
      } else if (!currentCategory.description) {
        // Paragraph between h3 and first h4 — category intro
        currentCategory.description = text
      }
    }
  })

  const ctas = extractCtas($, section)
  return { type: 'report-info', heading, introParagraph, categories, ctas }
}

function extractHowToCheck($, section) {
  const heading = clean(section.find('h2').first().text())
  let introParagraph = null
  const steps = []

  let foundH2 = false
  section.find('h2, h3, p').each((_, el) => {
    const tag = el.tagName.toLowerCase()
    const text = clean($(el).text())
    if (tag === 'h2') { foundH2 = true; return }
    if (!foundH2) return

    if (tag === 'p' && text.length > 20) {
      if (steps.length === 0 && !introParagraph) {
        introParagraph = text
      } else if (steps.length > 0) {
        const last = steps[steps.length - 1]
        if (!last.description) last.description = text
      }
    }
    if (tag === 'h3') {
      steps.push({ title: text, description: null })
    }
  })

  const ctas = extractCtas($, section)
  return { type: 'how-to-check', heading, introParagraph, steps, ctas }
}

function extractFreeVsPaid($, section) {
  const heading = clean(section.find('h2').first().text())
  const paragraphs = []

  // Collect intro paragraphs (not inside table)
  section.find('p').each((_, p) => {
    const $p = $(p)
    if ($p.closest('table').length > 0) return
    const t = clean($p.text())
    if (t.length > 30) paragraphs.push(t)
  })

  // Extract table rows
  const rows = []
  section.find('table tr').each((i, tr) => {
    const cells = []
    $(tr).find('th, td').each((_, cell) => {
      const $cell = $(cell)
      cells.push({
        text: clean($cell.text()),
        isCheck: detectCheckOrX($cell),
      })
    })

    if (i === 0) return // skip header row

    if (cells.length >= 3) {
      rows.push({
        feature: cells[0].text,
        free: cells[1].isCheck,
        paid: cells[2].isCheck,
      })
    }
  })

  const ctas = extractCtas($, section)
  return {
    type: 'free-vs-paid',
    heading,
    introParagraph: paragraphs[0] || null,
    extraParagraphs: paragraphs.slice(1),
    rows,
    ctas,
  }
}

function extractWhyImportant($, section) {
  const heading = clean(section.find('h2').first().text())
  let introParagraph = null
  const buyers = { heading: null, headingElement: null, introParagraph: null, items: [] }
  const sellers = { heading: null, headingElement: null, introParagraph: null, items: [] }
  let currentGroup = null

  section.find('h2, h3, h4, p').each((_, el) => {
    const tag = el.tagName.toLowerCase()
    const text = clean($(el).text())
    if (tag === 'h2') return

    if (tag === 'h3' || tag === 'h4') {
      const lower = text.toLowerCase()
      // H4 sub-items: always add to current group first (before checking group patterns)
      if (currentGroup && tag === 'h4') {
        currentGroup.items.push({ title: text, titleElement: tag, description: null })
        return
      }
      // Match first group: buyers, sales history, etc.
      if (!buyers.heading && (lower.includes('buyer') || lower.includes('sales history') || lower.includes('for car buyer'))) {
        buyers.heading = text
        buyers.headingElement = tag
        currentGroup = buyers
        return
      }
      // Match second group: sellers, dealers, etc.
      if (!sellers.heading && (lower.includes('seller') || lower.includes('dealer'))) {
        sellers.heading = text
        sellers.headingElement = tag
        currentGroup = sellers
        return
      }
      return
    }

    if (tag === 'p' && text.length > 20) {
      if (!currentGroup && !introParagraph) {
        introParagraph = text
      } else if (currentGroup) {
        if (currentGroup.items.length > 0) {
          const last = currentGroup.items[currentGroup.items.length - 1]
          if (!last.description) last.description = text
        } else if (!currentGroup.introParagraph) {
          currentGroup.introParagraph = text
        }
      }
    }

  })

  const ctas = extractCtas($, section)
  return { type: 'why-important', heading, introParagraph, buyers, sellers, ctas }
}

function extractWhyChooseUs($, section) {
  const heading = clean(section.find('h2').first().text())
  let introParagraph = null
  const cards = []

  // Try Elementor icon-box widgets first
  section.find('.elementor-icon-box-content').each((_, box) => {
    const $box = $(box)
    const title = clean($box.find('.elementor-icon-box-title, h3, h4').first().text())
    const desc = clean($box.find('.elementor-icon-box-description, p').first().text())
    if (title) cards.push({ title, description: desc || null })
  })

  // Fallback: h4 + p patterns in child containers
  if (cards.length === 0) {
    section.find('.e-con.e-child').each((_, child) => {
      const $child = $(child)
      if ($child.find('.e-con.e-child').length > 0) return
      const title = clean($child.find('h3, h4').first().text())
      const desc = clean($child.find('p').first().text())
      if (title && title.length > 3) cards.push({ title, description: desc || null })
    })
  }

  // Intro paragraph (not inside an icon box or card)
  section.find('p').each((_, p) => {
    const $p = $(p)
    if ($p.closest('.elementor-icon-box-content').length > 0) return
    if ($p.closest('.e-con.e-child').length > 0) {
      const parent = $p.closest('.e-con.e-child')
      if (parent.find('.e-con.e-child').length === 0) return // leaf card
    }
    const t = clean($p.text())
    if (t.length > 30 && !introParagraph) introParagraph = t
  })

  return { type: 'why-choose-us', heading, introParagraph, cards }
}

function extractTips($, section) {
  const heading = clean(section.find('h2').first().text())
  let introParagraph = null
  const items = []

  // Try Elementor icon-box widgets
  section.find('.elementor-icon-box-content').each((_, box) => {
    const $box = $(box)
    const title = clean($box.find('.elementor-icon-box-title, h3, h4').first().text())
    const desc = clean($box.find('.elementor-icon-box-description, p').first().text())
    if (title) items.push({ title, description: desc || null })
  })

  // Fallback: h4 + p patterns
  if (items.length === 0) {
    let currentItem = null
    section.find('h2, h3, h4, p').each((_, el) => {
      const tag = el.tagName.toLowerCase()
      const text = clean($(el).text())
      if (tag === 'h2') return
      if (tag === 'h3' || tag === 'h4') {
        if (text.length > 3) {
          currentItem = { title: text, description: null }
          items.push(currentItem)
        }
      } else if (tag === 'p' && text.length > 20) {
        if (currentItem && !currentItem.description) {
          currentItem.description = text
        } else if (!currentItem && !introParagraph) {
          introParagraph = text
        }
      }
    })
  }

  // Intro paragraph (not inside icon boxes)
  if (!introParagraph) {
    section.find('p').each((_, p) => {
      const $p = $(p)
      if ($p.closest('.elementor-icon-box-content').length > 0) return
      const t = clean($p.text())
      if (t.length > 30 && !introParagraph) introParagraph = t
    })
  }

  return { type: 'tips', heading, introParagraph, items }
}

function extractOtherCountries($, section) {
  const heading = clean(section.find('h2').first().text())
  let introParagraph = null
  const countries = []

  section.find('p').each((_, p) => {
    const t = clean($(p).text())
    if (t.length > 30 && !introParagraph) introParagraph = t
  })

  section.find('a').each((_, a) => {
    const href = $(a).attr('href') || ''
    const text = clean($(a).text())
    if (href.includes('/vin-check/') && text.length > 2) {
      const slug = href.split('/vin-check/')[1]?.replace(/\/$/, '')
      if (slug && !countries.some(c => c.slug === slug)) {
        countries.push({ name: text, slug, href })
      }
    }
  })

  return { type: 'other-countries', heading, introParagraph, countries }
}

function extractCtaBanner($, section) {
  const heading = clean(section.find('h2').first().text())
  let description = null
  section.find('p').each((_, p) => {
    const t = clean($(p).text())
    if (t.length > 15 && !description) description = t
  })
  const ctas = extractCtas($, section)
  return { type: 'cta-banner', heading, description, ctas }
}

function extractFaq($, section) {
  const heading = clean(section.find('h2').first().text())
  const items = []
  let questionElement = null

  // Elementor accordion widget
  section.find('.elementor-accordion-item, .elementor-toggle-item').each((_, item) => {
    const $item = $(item)
    const question = clean($item.find('.elementor-tab-title a, .elementor-toggle-title, .elementor-accordion-title').text())
    const answer = clean($item.find('.elementor-tab-content, .elementor-toggle-content').text())
    // Detect heading element wrapping the question
    if (!questionElement) {
      const titleEl = $item.find('.elementor-tab-title, .elementor-toggle-title').first()
      const tagName = titleEl.length ? titleEl[0].tagName.toLowerCase() : null
      if (tagName && /^h[1-6]$/.test(tagName)) questionElement = tagName
    }
    if (question && answer) items.push({ question, answer })
  })

  // Fallback: h3/h4 + p pattern
  if (items.length === 0) {
    let currentQ = null
    section.find('h3, h4, p').each((_, el) => {
      const tag = el.tagName.toLowerCase()
      const text = clean($(el).text())
      if ((tag === 'h3' || tag === 'h4') && text.length > 10) {
        currentQ = text
        if (!questionElement) questionElement = tag
      } else if (tag === 'p' && currentQ && text.length > 20) {
        items.push({ question: currentQ, answer: text })
        currentQ = null
      }
    })
  }

  return { type: 'faq', heading, questionElement: questionElement || 'h3', items }
}

// ── Main scraper ───────────────────────────────────────────────────

async function scrapeCountry(country) {
  const url = `${BASE}/vin-check/${country.slug}`
  const html = await fetchPage(url)
  const $ = cheerio.load(html)

  const matched = new Set()
  const sections = {}

  // Meta data
  const meta = {
    title: clean($('title').text()) || null,
    description: $('meta[name="description"]').attr('content')?.trim() || null,
    keywords: $('meta[name="keywords"]').attr('content')?.trim() || null,
  }

  // 1. Hero (h1 — always first)
  sections.hero = extractHero($)

  // 2. Why Check — specific VIN/decode keywords
  const whySec = findSection($, [
    'decode', 'need to check', 'why checking', 'do you need', 'run a vin', 'is a must',
    'why should you check', 'why you should check the vin', 'risk stats',
    'why get a vin', 'why run a vin',
    'should check vin in',
  ], matched)
  if (whySec) sections.whyCheck = extractWhyCheck($, whySec)

  // 3+4. What is a VIN + Where to Find (one DOM parent, two logical sections)
  const vinSec = findSection($, [
    'what is a vin', 'what is a vehicle identification',
    'what does a vin number mean', 'what does a vin stand', 'vin number meaning',
  ], matched)
  if (vinSec) {
    const { whatIsVin, whereToFind } = extractWhatIsVinAndWhereToFind($, vinSec)
    sections.whatIsVin = whatIsVin
    if (whereToFind.items.length > 0) sections.whereToFind = whereToFind
  }

  // 5. Report Info
  const reportSec = findSection($, [
    'what information', "what you'll find", 'what to expect',
    'what does our', 'report reveal', "what's contained",
    'expect from', 'expect with', "what's contained",
    'information to find',
  ], matched)
  if (reportSec) sections.reportInfo = extractReportInfo($, reportSec)

  // 6. How to Check
  const howSec = findSection($, [
    'how to check', 'how to decode', 'how to run',
    'how to lookup', 'how to get a vin', 'how to conduct',
    'how to get a vehicle history', 'how to get a ',
  ], matched)
  if (howSec) sections.howToCheck = extractHowToCheck($, howSec)

  // 7. Free vs Paid
  const freeVsPaidSec = findSection($, [
    'free vs', 'free vin decoder vs', 'vs. paid', 'vs paid',
    'free and paid', 'comparing our free', 'free.*compared',
  ], matched)
  if (freeVsPaidSec) sections.freeVsPaid = extractFreeVsPaid($, freeVsPaidSec)

  // 8. Why Important (search before Why Choose to avoid collisions)
  const importantSec = findSection($, [
    'important', 'importance', 'crucial',
    'benefits of', 'benefit of', 'matters',
    'nonnegotiable', 'non-negotiable', 'essential',
    'buyers and sellers', 'reasons why you should check',
    'why you should check', 'why you need to check', 'before buying',
  ], matched)
  if (importantSec) sections.whyImportant = extractWhyImportant($, importantSec)

  // 9. Why Choose Us
  const chooseSec = findSection($, [
    'choose our', 'should check a vin', 'should check vin',
    'stand out', 'makes our', 'best-in-class', 'best in class',
    'got-to', 'go-to', 'prefer our', 'why you should choose',
    'why our',
  ], matched)
  if (chooseSec) sections.whyChooseUs = extractWhyChooseUs($, chooseSec)

  // 10. Tips
  const tipsSec = findSection($, [
    'tips', 'scams', 'tricks', 'be alert', 'watch out',
    'odometer rollback',
  ], matched)
  if (tipsSec) sections.tips = extractTips($, tipsSec)

  // 11. Other Countries
  const otherSec = findSection($, [
    'other countries', 'other eu countries', 'other european',
    'other nations', 'in your country', 'vin checks in',
  ], matched)
  if (otherSec) sections.otherCountries = extractOtherCountries($, otherSec)

  // 12. CTA Banner — broad match, catches various CTA headings
  const ctaSec = findSection($, [
    'buying a used car', 'get a vin check before',
    'run a vin check now', 'check now',
  ], matched)
  if (ctaSec) sections.ctaBanner = extractCtaBanner($, ctaSec)

  // 13. FAQ
  const faqSec = findSection($, [
    'faq', 'commonly asked', 'frequently asked',
  ], matched)
  if (faqSec) sections.faq = extractFaq($, faqSec)

  // Summary
  const sectionCount = Object.keys(sections).length
  return { slug: country.slug, name: country.name, url, sectionCount, meta, sections }
}

// ── CLI ────────────────────────────────────────────────────────────

const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const countryFilter = args.includes('--country') ? args[args.indexOf('--country') + 1] : null
const outFile = args.includes('--out') ? args[args.indexOf('--out') + 1] : join(__dirname, 'scraped-countries.json')

async function main() {
  console.log('\n═══════════════════════════════════════')
  console.log('  SCRAPE VIN CHECK COUNTRY PAGES')
  console.log('═══════════════════════════════════════\n')

  const countries = countryFilter
    ? COUNTRIES.filter(c => c.slug === countryFilter)
    : COUNTRIES

  if (dryRun) {
    console.log(`Would scrape ${countries.length} countries:`)
    countries.forEach(c => console.log(`  ${c.name} (${c.slug})`))
    return
  }

  const results = []
  let success = 0
  let failed = 0

  for (const country of countries) {
    process.stdout.write(`  ${country.name.padEnd(25)}`)
    try {
      const data = await scrapeCountry(country)
      results.push(data)
      console.log(`${data.sectionCount}/13 sections`)
      success++
    } catch (err) {
      console.log(`FAILED: ${err.message}`)
      failed++
    }

    // Rate limit: 500ms between requests
    if (countries.length > 1) await new Promise(r => setTimeout(r, 500))
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
