#!/usr/bin/env node
/**
 * Scrapes FAQ sections from vehiclehistory.eu pages.
 * Extracts exact Q&A pairs preserving heading levels, answer HTML, and links.
 *
 * Usage:
 *   node scripts/scrape-faqs.mjs --all
 *   node scripts/scrape-faqs.mjs /
 *   node scripts/scrape-faqs.mjs /window-sticker
 *   node scripts/scrape-faqs.mjs --all --out scripts/scraped-faqs.json
 */

import * as cheerio from 'cheerio'
import { writeFileSync } from 'fs'

const BASE = 'https://vehiclehistory.eu'
const ALL_PAGES = ['/', '/pricing', '/sample-report', '/window-sticker', '/contact-us']

async function fetchPage(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      Accept: 'text/html,application/xhtml+xml',
    },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.text()
}

function cleanText(str) {
  return (str || '').replace(/\s+/g, ' ').trim()
}

/** Convert a cheerio element's inner HTML to Lexical nodes */
function htmlToLexicalNodes($, el) {
  const nodes = []

  $(el).contents().each((_, child) => {
    if (child.type === 'text') {
      const text = child.data?.replace(/\s+/g, ' ')
      if (text && text.trim()) {
        nodes.push({ type: 'text', text, format: 0, version: 1, detail: 0, mode: 'normal', style: '' })
      }
      return
    }

    const $child = $(child)
    const tag = child.tagName?.toLowerCase()

    if (tag === 'a') {
      const href = $child.attr('href') || ''
      const text = cleanText($child.text())
      if (text) {
        nodes.push({
          type: 'link',
          version: 1,
          url: href.startsWith('/') ? `${BASE}${href}` : href,
          children: [{ type: 'text', text, format: 0, version: 1, detail: 0, mode: 'normal', style: '' }],
          direction: 'ltr',
          format: '',
          indent: 0,
          rel: $child.attr('rel') || 'nofollow',
          target: $child.attr('target') || null,
        })
      }
      return
    }

    if (tag === 'strong' || tag === 'b') {
      const text = cleanText($child.text())
      if (text) {
        nodes.push({ type: 'text', text, format: 1, version: 1, detail: 0, mode: 'normal', style: '' }) // format 1 = bold
      }
      return
    }

    if (tag === 'em' || tag === 'i') {
      const text = cleanText($child.text())
      if (text) {
        nodes.push({ type: 'text', text, format: 2, version: 1, detail: 0, mode: 'normal', style: '' }) // format 2 = italic
      }
      return
    }

    // Anything else — just get text
    const text = cleanText($child.text())
    if (text) {
      nodes.push({ type: 'text', text, format: 0, version: 1, detail: 0, mode: 'normal', style: '' })
    }
  })

  return nodes
}

/** Convert answer content (may be multiple paragraphs, lists) to Lexical */
function answerToLexical($, elements) {
  const children = []

  elements.forEach(el => {
    const $el = $(el)
    const tag = el.tagName?.toLowerCase()

    if (tag === 'p' || tag === 'div' || tag === 'span') {
      const nodes = htmlToLexicalNodes($, el)
      if (nodes.length > 0) {
        children.push({
          type: 'paragraph', direction: 'ltr', format: '', indent: 0, version: 1, textFormat: 0, textStyle: '',
          children: nodes,
        })
      }
    } else if (tag === 'ul' || tag === 'ol') {
      const listItems = []
      $el.children('li').each((_, li) => {
        const nodes = htmlToLexicalNodes($, li)
        if (nodes.length > 0) {
          listItems.push({
            type: 'listitem', direction: 'ltr', format: '', indent: 0, version: 1, value: 1,
            children: nodes,
          })
        }
      })
      if (listItems.length > 0) {
        children.push({
          type: 'list', listType: tag === 'ol' ? 'number' : 'bullet',
          direction: 'ltr', format: '', indent: 0, version: 1, tag, start: 1,
          children: listItems,
        })
      }
    } else {
      // Fallback — treat as paragraph
      const text = cleanText($el.text())
      if (text) {
        children.push({
          type: 'paragraph', direction: 'ltr', format: '', indent: 0, version: 1, textFormat: 0, textStyle: '',
          children: [{ type: 'text', text, format: 0, version: 1, detail: 0, mode: 'normal', style: '' }],
        })
      }
    }
  })

  // If empty, add placeholder
  if (children.length === 0) {
    children.push({
      type: 'paragraph', direction: 'ltr', format: '', indent: 0, version: 1, textFormat: 0, textStyle: '',
      children: [{ type: 'text', text: '(no answer content found)', format: 0, version: 1, detail: 0, mode: 'normal', style: '' }],
    })
  }

  return { root: { type: 'root', direction: 'ltr', format: '', indent: 0, version: 1, children } }
}

/** Extract FAQ pairs from accordion-style sections */
function extractFAQs($, sectionEl) {
  const faqs = []
  const $section = $(sectionEl)

  // Strategy 1: Elementor accordion — .elementor-accordion-item
  const accordionItems = $section.find('.elementor-accordion-item, .elementor-toggle-item')
  if (accordionItems.length > 0) {
    accordionItems.each((_, item) => {
      const $item = $(item)
      const qEl = $item.find('.elementor-accordion-title, .elementor-toggle-title, [class*="title"]').first()
      const aEl = $item.find('.elementor-accordion-content, .elementor-toggle-content, [class*="content"]').first()

      const qClone = qEl.clone()
      qClone.find('img, svg, [class*="icon"], [class*="arrow"]').remove()
      const question = cleanText(qClone.text())
      const qTag = qEl.prop('tagName')?.toLowerCase() || 'h3'
      const qLevel = /^h[1-6]$/.test(qTag) ? qTag : (qEl.find('h1,h2,h3,h4,h5,h6').first().prop('tagName')?.toLowerCase() || 'h3')

      if (question) {
        // Gather answer elements
        const answerEls = []
        aEl.children().each((_, child) => answerEls.push(child))
        // If no children, use the element itself
        if (answerEls.length === 0 && cleanText(aEl.text())) {
          answerEls.push(aEl[0])
        }

        faqs.push({
          question,
          questionLevel: qLevel,
          answer: answerToLexical($, answerEls),
          answerText: cleanText(aEl.text()).slice(0, 200),
        })
      }
    })
    return faqs
  }

  // Strategy 2: HTML details/summary
  const details = $section.find('details')
  if (details.length > 0) {
    details.each((_, det) => {
      const $det = $(det)
      const summary = $det.find('summary').first()
      const question = cleanText(summary.text())
      const qLevel = summary.find('h1,h2,h3,h4,h5,h6').first().prop('tagName')?.toLowerCase() || 'h3'

      if (question) {
        const answerEls = []
        $det.children().not('summary').each((_, child) => answerEls.push(child))
        faqs.push({
          question,
          questionLevel: qLevel,
          answer: answerToLexical($, answerEls),
          answerText: cleanText($det.text().replace(question, '')).slice(0, 200),
        })
      }
    })
    return faqs
  }

  // Strategy 3: Custom accordion with heading + content pairs
  // Look for h3/h4 elements followed by content
  const headings = $section.find('h2, h3, h4, h5')
  if (headings.length > 1) {
    headings.each((_, heading) => {
      const $h = $(heading)
      const question = cleanText($h.text())
      const qLevel = heading.tagName.toLowerCase()

      // Skip section-level headings (usually the FAQ section title)
      if ($h.closest('[class*="heading"], [class*="title"]').length > 0 &&
          $h.parent().children('h2,h3,h4,h5').length <= 1) return

      // Gather siblings until next heading
      const answerEls = []
      let next = $h.next()
      while (next.length && !next.is('h2, h3, h4, h5')) {
        answerEls.push(next[0])
        next = next.next()
      }

      if (question && answerEls.length > 0) {
        faqs.push({
          question,
          questionLevel: qLevel,
          answer: answerToLexical($, answerEls),
          answerText: answerEls.map(el => cleanText($(el).text())).join(' ').slice(0, 200),
        })
      }
    })
    return faqs
  }

  // Strategy 4: Button-based accordion (common in WP)
  const buttons = $section.find('button, [role="button"]')
  if (buttons.length > 0) {
    buttons.each((_, btn) => {
      const $btn = $(btn)
      // Extract question from <span> if present, otherwise strip img/svg/icon elements
      const spanText = $btn.find('> span').first().text()
      const btnClone = $btn.clone()
      btnClone.find('img, svg, div, [class*="icon"], [class*="arrow"]').remove()
      const question = cleanText(spanText || btnClone.text())
      if (!question || question.length < 10) return

      // Find associated content panel
      const targetId = $btn.attr('aria-controls')
      let contentEl = targetId ? $section.find(`#${targetId}`) : null
      if (!contentEl?.length) {
        // Try next sibling
        contentEl = $btn.parent().next()
      }

      if (contentEl?.length) {
        const answerEls = []
        contentEl.children().each((_, child) => answerEls.push(child))
        if (answerEls.length === 0 && cleanText(contentEl.text())) {
          answerEls.push(contentEl[0])
        }

        faqs.push({
          question,
          questionLevel: 'h3', // buttons don't have heading levels
          answer: answerToLexical($, answerEls),
          answerText: cleanText(contentEl.text()).slice(0, 200),
        })
      }
    })
  }

  return faqs
}

/** Find FAQ sections on the page and extract Q&A pairs */
async function scrapeFAQs(path) {
  const url = path.startsWith('http') ? path : `${BASE}${path.startsWith('/') ? '' : '/'}${path}`
  const html = await fetchPage(url)
  const $ = cheerio.load(html)

  const results = []

  // Find sections containing FAQ/Questions
  $('section, [class*="faq"], [class*="accordion"], [class*="question"], .e-con').each((_, el) => {
    const $el = $(el)
    const text = cleanText($el.text())

    // Check if this section contains FAQ-like content
    const hasQKeyword = /faq|frequently|question/i.test(text.slice(0, 200))
    const hasAccordion = $el.find('.elementor-accordion, .elementor-toggle, details, [class*="accordion"]').length > 0

    if (!hasQKeyword && !hasAccordion) return

    // Skip if nested inside another FAQ section we already found
    const isNested = results.some(r => $.contains(r._el, el))
    if (isNested) return

    const faqs = extractFAQs($, el)
    if (faqs.length === 0) return

    // Get section heading
    const sectionHeading = $el.find('h1, h2, h3').first()
    const headingText = cleanText(sectionHeading.text())
    const headingLevel = sectionHeading.prop('tagName')?.toLowerCase() || 'h2'

    // Don't use an FAQ question as the section heading
    const isQuestionHeading = faqs.some(f => f.question === headingText)

    results.push({
      _el: el,
      sectionHeading: isQuestionHeading ? null : headingText,
      sectionHeadingLevel: isQuestionHeading ? null : headingLevel,
      faqs,
    })
  })

  // Deduplicate — remove FAQ items that appear in multiple matched sections
  const seenQuestions = new Set()
  const deduped = []
  for (const result of results) {
    const uniqueFaqs = result.faqs.filter(f => {
      if (seenQuestions.has(f.question)) return false
      seenQuestions.add(f.question)
      return true
    })
    if (uniqueFaqs.length > 0) {
      deduped.push({ ...result, _el: undefined, faqs: uniqueFaqs })
    }
  }

  return { url, path, faqSections: deduped }
}

// ── CLI ─────────────────────────────────────────────────────────────

const args = process.argv.slice(2)
const isAll = args.includes('--all')
const outIdx = args.indexOf('--out')
const outFile = outIdx !== -1 ? args[outIdx + 1] : null
const paths = isAll
  ? ALL_PAGES
  : args.filter(a => !a.startsWith('--') && (outIdx === -1 || args.indexOf(a) !== outIdx + 1))

if (paths.length === 0 && !isAll) {
  console.error('Usage: node scripts/scrape-faqs.mjs <path> [--all] [--out file.json]')
  process.exit(1)
}

const results = []

for (const path of paths) {
  process.stderr.write(`Scraping FAQs from ${path}...`)
  const data = await scrapeFAQs(path)
  const totalQs = data.faqSections.reduce((s, sec) => s + sec.faqs.length, 0)
  process.stderr.write(` ${totalQs} Q&As in ${data.faqSections.length} sections\n`)
  results.push(data)

  // Pretty print
  if (!outFile) {
    for (const sec of data.faqSections) {
      console.log(`\n  Section: ${sec.sectionHeading || '(no heading)'} [${sec.sectionHeadingLevel}]`)
      for (const faq of sec.faqs) {
        console.log(`    Q [${faq.questionLevel}]: ${faq.question}`)
        console.log(`    A: ${faq.answerText}...`)
        console.log()
      }
    }
  }
}

if (outFile) {
  writeFileSync(outFile, JSON.stringify(results, null, 2))
  console.log(`\nSaved to ${outFile}`)
}
