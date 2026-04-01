#!/usr/bin/env node
/**
 * Scrapes legal pages (privacy-policy, terms-of-service) from vehiclehistory.eu
 * and converts full HTML content to Lexical richText JSON.
 *
 * Usage:
 *   node scripts/migration/scrape-legal.mjs
 */

import * as cheerio from 'cheerio'
import { writeFileSync } from 'fs'

const BASE = 'https://vehiclehistory.eu'
const PAGES = [
  { path: '/privacy-policy', slug: 'privacy-policy' },
  { path: '/terms-of-service', slug: 'terms-of-service' },
]

async function fetchPage(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' },
  })
  return res.text()
}

function cleanText(str) {
  return (str || '').replace(/\s+/g, ' ').trim()
}

/** Convert inline HTML children to Lexical text nodes */
function inlineToLexical($, el) {
  const nodes = []
  $(el).contents().each((_, child) => {
    if (child.type === 'text') {
      const text = child.data?.replace(/\s+/g, ' ')
      if (text && text.trim()) {
        nodes.push({ type: 'text', text, format: 0, version: 1, detail: 0, mode: 'normal', style: '' })
      }
      return
    }
    const $c = $(child)
    const tag = child.tagName?.toLowerCase()

    if (tag === 'a') {
      const href = $c.attr('href') || ''
      const text = cleanText($c.text())
      if (text) {
        const fullHref = href.startsWith('/') ? `${BASE}${href}` : href
        nodes.push({
          type: 'link', version: 1, url: fullHref,
          direction: 'ltr', format: '', indent: 0,
          rel: $c.attr('rel') || null,
          target: $c.attr('target') || null,
          children: [{ type: 'text', text, format: 0, version: 1, detail: 0, mode: 'normal', style: '' }],
        })
      }
      return
    }
    if (tag === 'strong' || tag === 'b') {
      const text = cleanText($c.text())
      if (text) nodes.push({ type: 'text', text, format: 1, version: 1, detail: 0, mode: 'normal', style: '' })
      return
    }
    if (tag === 'em' || tag === 'i') {
      const text = cleanText($c.text())
      if (text) nodes.push({ type: 'text', text, format: 2, version: 1, detail: 0, mode: 'normal', style: '' })
      return
    }
    if (tag === 'br') {
      return // skip line breaks within paragraphs
    }
    // Nested spans or other inline elements
    const nested = inlineToLexical($, child)
    nodes.push(...nested)
  })
  return nodes
}

/** Convert a block-level HTML element to Lexical node(s) */
function blockToLexical($, el) {
  const tag = el.tagName?.toLowerCase()
  const $el = $(el)

  // Headings
  if (/^h[1-6]$/.test(tag)) {
    const nodes = inlineToLexical($, el)
    if (nodes.length === 0) return []
    return [{
      type: 'heading', tag, direction: 'ltr', format: '', indent: 0, version: 1,
      children: nodes,
    }]
  }

  // Paragraphs / divs with text
  if (tag === 'p' || tag === 'div') {
    const nodes = inlineToLexical($, el)
    if (nodes.length === 0) {
      // Check for nested block elements
      const nested = []
      $el.children().each((_, child) => {
        nested.push(...blockToLexical($, child))
      })
      return nested
    }
    return [{
      type: 'paragraph', direction: 'ltr', format: '', indent: 0, version: 1, textFormat: 0, textStyle: '',
      children: nodes,
    }]
  }

  // Lists
  if (tag === 'ul' || tag === 'ol') {
    const items = []
    $el.children('li').each((_, li) => {
      const nodes = inlineToLexical($, li)
      if (nodes.length > 0) {
        items.push({
          type: 'listitem', direction: 'ltr', format: '', indent: 0, version: 1, value: 1,
          children: nodes,
        })
      }
    })
    if (items.length === 0) return []
    return [{
      type: 'list', listType: tag === 'ol' ? 'number' : 'bullet',
      direction: 'ltr', format: '', indent: 0, version: 1, tag, start: 1,
      children: items,
    }]
  }

  // Table — convert to simple paragraphs (Lexical doesn't have native table)
  if (tag === 'table') {
    const rows = []
    $el.find('tr').each((_, tr) => {
      const cells = []
      $(tr).find('td, th').each((_, cell) => {
        cells.push(cleanText($(cell).text()))
      })
      if (cells.length > 0) {
        rows.push({
          type: 'paragraph', direction: 'ltr', format: '', indent: 0, version: 1, textFormat: 0, textStyle: '',
          children: [{ type: 'text', text: cells.join(' | '), format: 0, version: 1, detail: 0, mode: 'normal', style: '' }],
        })
      }
    })
    return rows
  }

  // Blockquote
  if (tag === 'blockquote') {
    const nodes = inlineToLexical($, el)
    if (nodes.length === 0) return []
    return [{
      type: 'paragraph', direction: 'ltr', format: '', indent: 0, version: 1, textFormat: 0, textStyle: '',
      children: [{ type: 'text', text: '> ', format: 0, version: 1, detail: 0, mode: 'normal', style: '' }, ...nodes],
    }]
  }

  // Fallback — treat as paragraph
  const text = cleanText($el.text())
  if (text) {
    return [{
      type: 'paragraph', direction: 'ltr', format: '', indent: 0, version: 1, textFormat: 0, textStyle: '',
      children: [{ type: 'text', text, format: 0, version: 1, detail: 0, mode: 'normal', style: '' }],
    }]
  }

  return []
}

/** Extract main content area and convert to Lexical */
async function scrapeLegal(pagePath) {
  const url = `${BASE}${pagePath}`
  console.log(`Scraping ${url}...`)
  const html = await fetchPage(url)
  const $ = cheerio.load(html)

  // Find the main content container — try Elementor content area
  let container = $('.elementor-widget-theme-post-content .elementor-widget-container').first()
  if (!container.length) container = $('article .entry-content').first()
  if (!container.length) container = $('main .elementor').first()
  if (!container.length) container = $('main').first()

  const lexicalChildren = []

  // Process all direct block-level children
  container.children().each((_, el) => {
    const nodes = blockToLexical($, el)
    lexicalChildren.push(...nodes)
  })

  // If we got very few nodes, try deeper — Elementor nests content in sections/columns
  if (lexicalChildren.length < 5) {
    lexicalChildren.length = 0 // clear
    container.find('p, h1, h2, h3, h4, h5, h6, ul, ol, table, blockquote').each((_, el) => {
      // Skip elements inside nav/header/footer
      if ($(el).closest('header, footer, nav').length) return
      const nodes = blockToLexical($, el)
      lexicalChildren.push(...nodes)
    })
  }

  console.log(`  Extracted ${lexicalChildren.length} Lexical nodes`)

  return {
    root: {
      type: 'root', direction: 'ltr', format: '', indent: 0, version: 1,
      children: lexicalChildren,
    },
  }
}

// ── Main ──

const results = {}
for (const page of PAGES) {
  results[page.slug] = await scrapeLegal(page.path)
}

writeFileSync('scraped-legal.json', JSON.stringify(results, null, 2))
console.log('\nSaved to scraped-legal.json')
