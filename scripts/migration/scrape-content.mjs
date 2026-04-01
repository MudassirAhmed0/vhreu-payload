#!/usr/bin/env node
/**
 * Deep content scraper for vehiclehistory.eu pages.
 * Extracts every element from each section: headings, text, links,
 * images, forms, lists, badges — structured as JSON for migration.
 *
 * Usage:
 *   node scripts/scrape-content.mjs /                    # homepage
 *   node scripts/scrape-content.mjs /pricing             # pricing page
 *   node scripts/scrape-content.mjs --all                # all nav pages
 *   node scripts/scrape-content.mjs / --json             # output raw JSON
 *   node scripts/scrape-content.mjs / --out data.json    # save JSON to file
 */

import * as cheerio from 'cheerio'
import { writeFileSync } from 'fs'

// ── config ──────────────────────────────────────────────────────────
const BASE = 'https://vehiclehistory.eu'
const ALL_PAGES = ['/', '/pricing', '/sample-report', '/window-sticker', '/contact-us']
const SKIP_TAGS = new Set(['header', 'footer', 'nav', 'script', 'style', 'link', 'meta', 'noscript'])
const HIDDEN_STYLES = /display\s*:\s*none|visibility\s*:\s*hidden/i
const MODAL_PATTERNS = /modal|overlay|popup|lightbox|exit-intent/i

// ── fetch ───────────────────────────────────────────────────────────

async function fetchPage(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status} — ${res.statusText}`)
  return res.text()
}

// ── visibility helpers ──────────────────────────────────────────────

function isHidden($, el) {
  const $el = $(el)
  if ($el.attr('hidden') !== undefined) return true
  const style = $el.attr('style') || ''
  if (HIDDEN_STYLES.test(style)) return true
  const cls = $el.attr('class') || ''
  if (/\bhidden\b|\binvisible\b|\bd-none\b/.test(cls)) return true
  const id = $el.attr('id') || ''
  if (MODAL_PATTERNS.test(cls) || MODAL_PATTERNS.test(id)) return true
  return false
}

// ── extraction helpers ──────────────────────────────────────────────

function cleanText(str) {
  return (str || '').replace(/\s+/g, ' ').trim()
}

function resolveUrl(href) {
  if (!href) return null
  if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('#')) return href
  if (href.startsWith('/')) return `${BASE}${href}`
  return `${BASE}/${href}`
}

/** Extract all headings from a section in DOM order */
function extractHeadings($, section) {
  const headings = []
  $(section).find('h1, h2, h3, h4, h5, h6').each((_, el) => {
    const $el = $(el)
    if (isHidden($, el)) return
    headings.push({
      level: el.tagName.toLowerCase(),
      text: cleanText($el.text()),
    })
  })
  return headings
}

/** Extract all paragraphs */
function extractParagraphs($, section) {
  const paragraphs = []
  $(section).find('p').each((_, el) => {
    const text = cleanText($(el).text())
    if (text.length > 10) paragraphs.push(text)
  })
  return paragraphs
}

/** Extract all links with text, href, and context */
function extractLinks($, section) {
  const links = []
  const seen = new Set()
  $(section).find('a').each((_, el) => {
    const $el = $(el)
    const href = resolveUrl($el.attr('href'))
    const text = cleanText($el.text()).replace(/<[^>]*>/g, '').trim()
    if (!href || !text) return
    const key = `${text}|${href}`
    if (seen.has(key)) return
    seen.add(key)

    // Determine link style from classes/context
    const cls = $el.attr('class') || ''
    const parentCls = $el.parent().attr('class') || ''
    let style = 'text'
    if (/btn|button|cta/i.test(cls)) style = 'button'
    else if (/pill/i.test(cls)) style = 'pill'

    // Check for rel and target
    const rel = $el.attr('rel') || null
    const newTab = $el.attr('target') === '_blank'

    links.push({ text, href, style, rel, newTab })
  })
  return links
}

/** Extract all images */
function extractImages($, section) {
  const images = []
  const seen = new Set()
  $(section).find('img').each((_, el) => {
    const $el = $(el)
    // Prefer real src over lazy placeholders (data: URIs)
    const rawSrc = $el.attr('src') || ''
    const dataSrc = $el.attr('data-src') || $el.attr('data-lazy-src') || $el.attr('data-original') || ''
    let src = dataSrc || rawSrc
    // Skip inline SVG placeholders
    if (src.startsWith('data:')) src = dataSrc || null
    if (!src || seen.has(src)) return
    seen.add(src)
    if (src.startsWith('/')) src = `${BASE}${src}`

    images.push({
      src,
      alt: $el.attr('alt') || null,
      width: $el.attr('width') || null,
      height: $el.attr('height') || null,
    })
  })
  return images
}

/** Extract form elements */
function extractForms($, section) {
  const forms = []
  $(section).find('form, .site_form, [class*="form"]').each((_, el) => {
    const $form = $(el)
    if ($form.find('input, select, textarea').length === 0) return

    const fields = []
    $form.find('input, select, textarea').each((_, field) => {
      const $f = $(field)
      const type = $f.attr('type') || field.tagName.toLowerCase()
      if (type === 'hidden' || type === 'submit') return
      fields.push({
        type,
        name: $f.attr('name') || null,
        placeholder: $f.attr('placeholder') || null,
        label: null, // will try to match below
      })
    })

    // Try to match labels
    $form.find('label').each((_, label) => {
      const $l = $(label)
      const forAttr = $l.attr('for')
      const text = cleanText($l.text())
      if (forAttr) {
        const match = fields.find(f => f.name === forAttr)
        if (match) match.label = text
      }
    })

    // Get submit button text
    let submitText = null
    const submitBtn = $form.find('button[type="submit"], input[type="submit"], button:not([type])').first()
    if (submitBtn.length) {
      submitText = cleanText(submitBtn.text()) || submitBtn.attr('value') || null
    }

    if (fields.length > 0) {
      forms.push({ fields, submitText })
    }
  })
  return forms
}

/** Extract list items (ul/ol) */
function extractLists($, section) {
  const lists = []
  $(section).find('ul, ol').each((_, el) => {
    const $list = $(el)
    // Skip nav-like lists
    if ($list.closest('nav, header, footer').length) return
    const items = []
    $list.children('li').each((_, li) => {
      const text = cleanText($(li).text())
      if (text) items.push(text)
    })
    if (items.length > 0) {
      lists.push({
        type: el.tagName.toLowerCase(),
        items,
      })
    }
  })
  return lists
}

/** Extract badge-like elements (short text in styled containers) */
function extractBadges($, section) {
  const badges = []
  const seen = new Set()

  // Look for common badge patterns
  const selectors = [
    '[class*="badge"]',
    '[class*="trust"]',
    '[class*="feature"]',
    '[class*="benefit"]',
    '[class*="highlight"]',
    '.check-item',
    '.stat-item',
  ]

  $(section).find(selectors.join(', ')).each((_, el) => {
    const text = cleanText($(el).text())
    if (text && text.length < 100 && !seen.has(text)) {
      seen.add(text)
      const icon = $(el).find('svg, i, [class*="icon"]').length > 0
      badges.push({ text, hasIcon: icon })
    }
  })

  return badges
}

/** Extract stat/number callouts */
function extractStats($, section) {
  const stats = []
  // Look for elements with large numbers or percentages
  $(section).find('[class*="stat"], [class*="number"], [class*="count"], [class*="alert"]').each((_, el) => {
    const text = cleanText($(el).text())
    if (text && text.length < 200) {
      stats.push(text)
    }
  })
  return stats
}

// ── section finder (reused from scrape-sections.mjs) ────────────────

function findSections($) {
  let container = $('main')
  if (!container.length) container = $('body')

  // Elementor unwrap
  const contentChildren = container.children().filter((_, el) => {
    const tag = el.tagName?.toLowerCase()
    if (!tag || SKIP_TAGS.has(tag)) return false
    if (isHidden($, el)) return false
    return true
  })

  if (contentChildren.length === 1) {
    const onlyChild = $(contentChildren[0])
    const cls = onlyChild.attr('class') || ''
    if (/\belementor\b/.test(cls) || /\bpage-builder\b/.test(cls)) {
      container = onlyChild
    }
  }

  // Elementor sections
  let elementorSections = container.find(
    '> .elementor-inner > .elementor-section-wrap > .elementor-section, ' +
    '> .elementor-section-wrap > .elementor-section, ' +
    '> .elementor-section, ' +
    '> [data-element_type="section"], ' +
    '> .e-con'
  )
  elementorSections = elementorSections.filter((_, el) => !isHidden($, el))
  const useElementor = elementorSections.length > 1

  const sectionEls = []

  if (useElementor) {
    elementorSections.each((_, el) => {
      if ($(el).text().trim().length >= 20) sectionEls.push(el)
    })
  } else {
    const collected = new Set()
    const allHeadings = new Set()

    function collectSections(parent) {
      parent.children().each((_, el) => {
        const tag = el.tagName?.toLowerCase()
        if (!tag || SKIP_TAGS.has(tag)) return
        if (isHidden($, el)) return
        if ($(el).text().trim().length < 20) return
        if (tag === 'section') {
          collected.add(el)
          const h = $(el).find('h1,h2,h3').first().text().trim()
          if (h) allHeadings.add(h)
        }
      })
    }

    collectSections(container)

    if (collected.size === 0) {
      container.children('div').each((_, wrapper) => collectSections($(wrapper)))
    } else {
      container.children('div').each((_, wrapper) => {
        const $w = $(wrapper)
        if (isHidden($, wrapper)) return
        $w.children('section').each((_, el) => {
          if (isHidden($, el)) return
          if ($(el).text().trim().length < 20) return
          const h = $(el).find('h1,h2,h3').first().text().trim()
          if (h && allHeadings.has(h)) return
          collected.add(el)
          if (h) allHeadings.add(h)
        })
      })
    }

    // Extra e-con divs
    function collectExtras(parent) {
      parent.children().each((_, el) => {
        const tag = el.tagName?.toLowerCase()
        if (!tag || SKIP_TAGS.has(tag) || tag === 'section') return
        if (collected.has(el) || isHidden($, el)) return
        if ($(el).text().trim().length < 20) return
        const heading = $(el).find('h1,h2,h3').first().text().trim()
        if (heading && allHeadings.has(heading)) return
        const cls = $(el).attr('class') || ''
        if (heading || /\be-con\b/.test(cls)) {
          collected.add(el)
          if (heading) allHeadings.add(heading)
        }
      })
    }

    collectExtras(container)
    container.children('div').each((_, wrapper) => {
      if (!collected.has(wrapper)) collectExtras($(wrapper))
    })

    // DOM order
    const gather = (parent) => {
      parent.children().each((_, el) => {
        if (collected.has(el)) sectionEls.push(el)
      })
    }
    gather(container)
    container.children('div').each((_, wrapper) => {
      if (!collected.has(wrapper)) gather($(wrapper))
    })
  }

  return sectionEls
}

// ── main extraction ─────────────────────────────────────────────────

async function extractPage(path) {
  const url = path.startsWith('http') ? path : `${BASE}${path.startsWith('/') ? '' : '/'}${path}`
  const html = await fetchPage(url)
  const $ = cheerio.load(html)

  // Page-level metadata
  const pageTitle = $('title').text().trim()
  const metaDesc = $('meta[name="description"]').attr('content') || null
  const canonical = $('link[rel="canonical"]').attr('href') || null

  const sectionEls = findSections($)

  const sections = sectionEls.map((el, i) => {
    const $el = $(el)
    return {
      index: i + 1,
      tag: el.tagName?.toLowerCase(),
      id: $el.attr('id') || null,
      classes: ($el.attr('class') || '').trim().slice(0, 120) || null,
      headings: extractHeadings($, el),
      paragraphs: extractParagraphs($, el),
      links: extractLinks($, el),
      images: extractImages($, el),
      forms: extractForms($, el),
      lists: extractLists($, el),
      badges: extractBadges($, el),
      stats: extractStats($, el),
      textLength: $el.text().trim().length,
    }
  })

  return {
    url,
    pageTitle,
    metaDesc,
    canonical,
    scrapedAt: new Date().toISOString(),
    totalSections: sections.length,
    sections,
  }
}

// ── output formatters ───────────────────────────────────────────────

function printSection(s) {
  const divider = '━'.repeat(90)
  const thinDiv = '─'.repeat(90)
  console.log(divider)
  console.log(`  SECTION ${s.index}  <${s.tag}${s.id ? '#' + s.id : ''}>`)
  if (s.classes) console.log(`  Classes: ${s.classes}`)
  console.log(thinDiv)

  // Headings
  if (s.headings.length) {
    console.log('  HEADINGS:')
    s.headings.forEach(h => console.log(`    ${h.level}: ${h.text}`))
    console.log()
  }

  // Paragraphs
  if (s.paragraphs.length) {
    console.log('  TEXT:')
    s.paragraphs.forEach(p => console.log(`    ${p.slice(0, 140)}${p.length > 140 ? '...' : ''}`))
    console.log()
  }

  // Links
  if (s.links.length) {
    console.log('  LINKS:')
    s.links.forEach(l => {
      const flags = [l.style !== 'text' ? `[${l.style}]` : '', l.newTab ? '[newTab]' : '', l.rel ? `[${l.rel}]` : ''].filter(Boolean).join(' ')
      console.log(`    "${l.text}" → ${l.href} ${flags}`)
    })
    console.log()
  }

  // Images
  if (s.images.length) {
    console.log('  IMAGES:')
    s.images.forEach(img => {
      const dims = img.width ? ` (${img.width}×${img.height})` : ''
      console.log(`    ${img.alt || '(no alt)'} → ${img.src.slice(0, 100)}${dims}`)
    })
    console.log()
  }

  // Forms
  if (s.forms.length) {
    console.log('  FORMS:')
    s.forms.forEach(f => {
      f.fields.forEach(field => {
        console.log(`    [${field.type}] ${field.label || field.placeholder || field.name || '(unnamed)'}`)
      })
      if (f.submitText) console.log(`    → Submit: "${f.submitText}"`)
    })
    console.log()
  }

  // Lists
  if (s.lists.length) {
    console.log('  LISTS:')
    s.lists.forEach(list => {
      console.log(`    <${list.type}> (${list.items.length} items):`)
      list.items.slice(0, 8).forEach(item => console.log(`      • ${item.slice(0, 100)}`))
      if (list.items.length > 8) console.log(`      ... +${list.items.length - 8} more`)
    })
    console.log()
  }

  // Badges
  if (s.badges.length) {
    console.log('  BADGES:')
    s.badges.forEach(b => console.log(`    ${b.hasIcon ? '✦ ' : ''}${b.text}`))
    console.log()
  }

  // Stats
  if (s.stats.length) {
    console.log('  STATS:')
    s.stats.forEach(st => console.log(`    ${st}`))
    console.log()
  }

  console.log(`  Text length: ${s.textLength} chars`)
}

function printPage(data) {
  console.log('\n' + '═'.repeat(90))
  console.log(`  PAGE: ${data.url}`)
  console.log(`  Title: ${data.pageTitle}`)
  console.log(`  Meta:  ${data.metaDesc || '(none)'}`)
  console.log(`  Scraped: ${data.scrapedAt}`)
  console.log(`  Sections: ${data.totalSections}`)
  console.log('═'.repeat(90))

  data.sections.forEach(s => printSection(s))
  console.log('━'.repeat(90))
  console.log()
}

// ── CLI ─────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2)
  const jsonFlag = args.includes('--json')
  const outIdx = args.indexOf('--out')
  const outFile = outIdx !== -1 ? args[outIdx + 1] : null
  const isAll = args.includes('--all')

  const paths = isAll
    ? ALL_PAGES
    : args.filter(a => !a.startsWith('--') && (outIdx === -1 || args.indexOf(a) !== outIdx + 1))

  if (paths.length === 0 && !isAll) {
    console.error('Usage: node scripts/scrape-content.mjs <path> [--all] [--json] [--out file.json]')
    process.exit(1)
  }

  const results = []
  for (const path of paths) {
    process.stderr.write(`Scraping ${path}...`)
    const data = await extractPage(path)
    results.push(data)
    process.stderr.write(` ${data.totalSections} sections\n`)
  }

  const output = results.length === 1 ? results[0] : results

  if (outFile) {
    writeFileSync(outFile, JSON.stringify(output, null, 2))
    console.log(`\nSaved to ${outFile}`)
  }

  if (jsonFlag) {
    console.log(JSON.stringify(output, null, 2))
  } else if (!outFile) {
    results.forEach(printPage)
  }
}

main().catch(err => {
  console.error('Error:', err.message)
  process.exit(1)
})
