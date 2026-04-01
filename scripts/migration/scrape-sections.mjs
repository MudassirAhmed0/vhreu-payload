#!/usr/bin/env node
/**
 * Scrape top-level visible sections from a vehiclehistory.eu page.
 *
 * Usage:
 *   node scripts/scrape-sections.mjs https://vehiclehistory.eu/
 *   node scripts/scrape-sections.mjs https://vehiclehistory.eu/vin-check
 *   node scripts/scrape-sections.mjs /pricing   (shorthand — prepends https://vehiclehistory.eu)
 */

import * as cheerio from 'cheerio'

// ── config ──────────────────────────────────────────────────────────
const BASE = 'https://vehiclehistory.eu'
const SKIP_TAGS = new Set(['header', 'footer', 'nav', 'script', 'style', 'link', 'meta', 'noscript'])
const HIDDEN_STYLES = /display\s*:\s*none|visibility\s*:\s*hidden/i
const MODAL_PATTERNS = /modal|overlay|popup|lightbox|exit-intent/i

// ── helpers ─────────────────────────────────────────────────────────

function resolveUrl(input) {
  if (!input) {
    console.error('Usage: node scripts/scrape-sections.mjs <url-or-path>')
    process.exit(1)
  }
  if (input.startsWith('http')) return input
  return `${BASE}${input.startsWith('/') ? '' : '/'}${input}`
}

function isHidden($el) {
  // hidden attribute
  if ($el.attr('hidden') !== undefined) return true
  // inline style
  const style = $el.attr('style') || ''
  if (HIDDEN_STYLES.test(style)) return true
  // common hidden classes
  const cls = $el.attr('class') || ''
  if (/\bhidden\b|\binvisible\b|\bd-none\b/.test(cls)) return true
  // modal / overlay / popup elements (not visible page content)
  const id = $el.attr('id') || ''
  if (MODAL_PATTERNS.test(cls) || MODAL_PATTERNS.test(id)) return true
  return false
}

function getHeading($, el) {
  // find the first heading inside this section
  const h = $(el).find('h1, h2, h3').first()
  return h.length ? h.text().trim().replace(/\s+/g, ' ') : null
}

function getFirstParagraph($, el) {
  const p = $(el).find('p').first()
  return p.length ? p.text().trim().replace(/\s+/g, ' ').slice(0, 120) : null
}

function getSectionId($, el) {
  return $(el).attr('id') || null
}

function getClasses($, el) {
  const raw = $(el).attr('class') || ''
  return raw.trim().replace(/\s+/g, ' ').slice(0, 100) || null
}

function getTextLength($, el) {
  return $(el).text().trim().length
}

// ── main ────────────────────────────────────────────────────────────

async function scrape(url) {
  console.log(`\nFetching: ${url}\n`)

  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    },
  })

  if (!res.ok) {
    console.error(`HTTP ${res.status} — ${res.statusText}`)
    process.exit(1)
  }

  const html = await res.text()
  const $ = cheerio.load(html)

  // Strategy: find the <main> element, or fall back to <body>.
  // Then iterate its direct children to find top-level sections.
  // For Elementor pages, unwrap the single wrapper div to reach real sections.
  let container = $('main')
  if (!container.length) container = $('body')

  // Elementor: if the container has a single content child that is an
  // Elementor wrapper, step inside it to find the real sections.
  const contentChildren = container.children().filter((_, el) => {
    const tag = el.tagName?.toLowerCase()
    if (!tag || SKIP_TAGS.has(tag)) return false
    if (isHidden($(el))) return false
    return true
  })

  if (contentChildren.length === 1) {
    const onlyChild = $(contentChildren[0])
    const cls = onlyChild.attr('class') || ''
    // Elementor or other page-builder single wrapper
    if (/\belementor\b/.test(cls) || /\bpage-builder\b/.test(cls)) {
      console.log('Detected Elementor/page-builder wrapper — stepping inside.\n')
      container = onlyChild
    }
  }

  // For Elementor, sections are nested inside .elementor-section or
  // [data-element_type="section"]. Detect and use those if present.
  let elementorSections = container.find(
    '> .elementor-inner > .elementor-section-wrap > .elementor-section, ' +
    '> .elementor-section-wrap > .elementor-section, ' +
    '> .elementor-section, ' +
    '> [data-element_type="section"], ' +
    '> .e-con'
  )
  // Filter hidden
  elementorSections = elementorSections.filter((_, el) => !isHidden($(el)))

  const useElementor = elementorSections.length > 1

  const sections = []

  // ── Elementor path ──
  if (useElementor) {
    console.log(`Detected ${elementorSections.length} Elementor sections.\n`)
    elementorSections.each((_, el) => {
      if (getTextLength($, el) < 20) return
      sections.push({
        tag: el.tagName?.toLowerCase(),
        id: getSectionId($, el),
        classes: getClasses($, el),
        heading: getHeading($, el),
        paragraph: getFirstParagraph($, el),
        textLen: getTextLength($, el),
      })
    })
  } else {
    // ── Standard path ──
    // Some pages nest <section> tags inside a wrapper div while having
    // additional Elementor e-con containers as siblings.  Flatten one
    // level: collect <section> children from the container AND from any
    // single-child wrapper divs, plus any e-con siblings that hold
    // unique content (like an FAQ block).

    const sectionEls = new Set()
    const allHeadings = new Set()

    function collectSections(parent) {
      parent.children().each((_, el) => {
        const $el = $(el)
        const tag = el.tagName?.toLowerCase()
        if (!tag || SKIP_TAGS.has(tag)) return
        if (isHidden($el)) return
        if (getTextLength($, el) < 20) return

        if (tag === 'section') {
          sectionEls.add(el)
          const h = getHeading($, el)
          if (h) allHeadings.add(h)
        }
      })
    }

    // Collect from direct children
    collectSections(container)

    // If no <section> tags found at this level, check one level deeper
    // (wrapper div that holds all the real sections)
    if (sectionEls.size === 0) {
      container.children('div').each((_, wrapper) => {
        collectSections($(wrapper))
      })
    } else {
      // Also check sibling wrapper divs for nested sections we missed
      container.children('div').each((_, wrapper) => {
        const $w = $(wrapper)
        if (isHidden($w)) return
        // Only dive into divs that don't already overlap with found sections
        $w.children('section').each((_, el) => {
          if (isHidden($(el))) return
          if (getTextLength($, el) < 20) return
          const h = getHeading($, el)
          if (h && allHeadings.has(h)) return // duplicate
          sectionEls.add(el)
          if (h) allHeadings.add(h)
        })
      })
    }

    // Pick up non-section elements (e-con divs, article tags, etc.)
    // that hold unique content at the same level
    function collectExtras(parent) {
      parent.children().each((_, el) => {
        const $el = $(el)
        const tag = el.tagName?.toLowerCase()
        if (!tag || SKIP_TAGS.has(tag)) return
        if (tag === 'section') return // already handled
        if (sectionEls.has(el)) return
        if (isHidden($el)) return
        if (getTextLength($, el) < 20) return

        const heading = getHeading($, el)
        if (heading && allHeadings.has(heading)) return // duplicate

        // Only include if it has its own heading (real content block)
        const cls = $el.attr('class') || ''
        const isElementorCon = /\be-con\b/.test(cls)
        if (heading || isElementorCon) {
          sectionEls.add(el)
          if (heading) allHeadings.add(heading)
        }
      })
    }

    collectExtras(container)
    // Also check inside wrapper divs
    container.children('div').each((_, wrapper) => {
      if (!sectionEls.has(wrapper)) collectExtras($(wrapper))
    })

    // Preserve DOM order — gather all elements in document order
    const ordered = []
    const gather = (parent) => {
      parent.children().each((_, el) => {
        if (sectionEls.has(el)) ordered.push(el)
      })
    }
    gather(container)
    container.children('div').each((_, wrapper) => {
      if (!sectionEls.has(wrapper)) gather($(wrapper))
    })

    for (const el of ordered) {
      sections.push({
        tag: el.tagName?.toLowerCase(),
        id: getSectionId($, el),
        classes: getClasses($, el),
        heading: getHeading($, el),
        paragraph: getFirstParagraph($, el),
        textLen: getTextLength($, el),
      })
    }
  }

  // ── output ──────────────────────────────────────────────────────

  if (!sections.length) {
    // Fallback: try all <section> tags anywhere in the page
    console.log('No direct children found — falling back to all <section> tags...\n')

    $('section').each((_, el) => {
      const $el = $(el)
      if (isHidden($el)) return
      if (getTextLength($, el) < 20) return

      sections.push({
        tag: 'section',
        id: getSectionId($, el),
        classes: getClasses($, el),
        heading: getHeading($, el),
        paragraph: getFirstParagraph($, el),
        textLen: getTextLength($, el),
      })
    })
  }

  console.log(`Found ${sections.length} top-level sections:\n`)
  console.log('─'.repeat(90))

  sections.forEach((s, i) => {
    const num = String(i + 1).padStart(2)
    const label = s.heading || s.paragraph || '(no text found)'
    const idStr = s.id ? `#${s.id}` : ''
    const tagStr = `<${s.tag}${idStr}>`

    console.log(`${num}. ${tagStr}`)
    console.log(`    Heading:  ${s.heading || '—'}`)
    console.log(`    Preview:  ${s.paragraph || '—'}`)
    console.log(`    Classes:  ${s.classes || '—'}`)
    console.log(`    Text:     ${s.textLen} chars`)
    console.log('─'.repeat(90))
  })

  console.log(`\nTotal: ${sections.length} sections\n`)
}

// ── run ─────────────────────────────────────────────────────────────

const url = resolveUrl(process.argv[2])
scrape(url).catch((err) => {
  console.error('Error:', err.message)
  process.exit(1)
})
