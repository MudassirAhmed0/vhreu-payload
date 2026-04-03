#!/usr/bin/env node
/**
 * Stage 4: Seed Payload CMS with migration-ready block data.
 *
 * Reads payload-blocks.json and creates real pages in Payload via REST API.
 * Handles Lexical richText conversion, strips internal fields, and publishes.
 *
 * Usage:
 *   node scripts/seed-payload.mjs                        # all pages
 *   node scripts/seed-payload.mjs --page /contact-us     # one page
 *   node scripts/seed-payload.mjs --dry-run              # show what would be created
 *
 * Requires Payload running at localhost:3030
 */

import { readFileSync } from 'fs'

// ── config ──────────────────────────────────────────────────────────

const PAYLOAD_URL = process.env.PAYLOAD_URL || 'http://localhost:3030'
const EMAIL = process.env.PAYLOAD_EMAIL || 'lame@lame.com'
const PASSWORD = process.env.PAYLOAD_PASSWORD || 'lame@lame.com'

const PAGES = JSON.parse(readFileSync('payload-blocks.json', 'utf8'))

// ── Lexical helpers ─────────────────────────────────────────────────

/** Wrap plain text in a Lexical richText structure */
function textToLexical(text) {
  if (!text) return undefined
  // Already Lexical
  if (typeof text === 'object' && text.root) return text

  // Split into paragraphs on double newline
  const paragraphs = String(text).split(/\n\n+/).filter(Boolean)

  return {
    root: {
      type: 'root',
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
      children: paragraphs.map(p => ({
        type: 'paragraph',
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
        textFormat: 0,
        textStyle: '',
        children: [{ type: 'text', text: p.trim(), format: 0, version: 1, detail: 0, mode: 'normal', style: '' }],
      })),
    },
  }
}

// ── Block sanitizer ─────────────────────────────────────────────────

/** Strip internal fields and convert descriptions to Lexical */
function sanitizeBlock(block) {
  const clean = { ...block }

  // Remove internal tracking fields
  delete clean._source
  delete clean._note
  delete clean._stats

  // Section block: description → Lexical richText
  if (clean.blockType === 'section') {
    if (clean.description && typeof clean.description === 'string') {
      clean.description = textToLexical(clean.description)
    }
    if (clean.bottomText && typeof clean.bottomText === 'string') {
      clean.bottomText = textToLexical(clean.bottomText)
    }
    // Sanitize inner content blocks
    if (clean.content && Array.isArray(clean.content)) {
      clean.content = clean.content.map(sanitizeInnerBlock)
    }
    // Sanitize section-level CTAs
    if (clean.ctas) {
      clean.ctas = clean.ctas.map(sanitizeCta)
    }
  }

  // CTA banner: description → Lexical richText
  if (clean.blockType === 'cta-banner') {
    if (clean.description && typeof clean.description === 'string') {
      clean.description = textToLexical(clean.description)
    }
  }

  // Page hero: heroImage placeholder → null (needs manual upload)
  if (clean.blockType === 'page-hero') {
    if (typeof clean.heroImage === 'string') {
      clean.heroImage = null // placeholder string, needs real media ID
    }
    // Features — ensure icon structure and sanitize rels
    if (clean.features) {
      clean.features = clean.features.map(f => ({
        ...f,
        icon: f.icon || { source: 'preset', preset: 'circle-check' },
        rel: VALID_RELS.has(f.rel) ? f.rel : undefined,
      }))
    }
    // Sanitize CTA rels
    if (clean.ctas) {
      clean.ctas = clean.ctas.map(sanitizeCta)
    }
    // Sanitize helper link rels
    if (clean.helperLinks) {
      clean.helperLinks = clean.helperLinks.map(l => ({
        ...l,
        rel: VALID_RELS.has(l.rel) ? l.rel : 'none',
      }))
    }
  }

  return clean
}

function sanitizeInnerBlock(inner) {
  const clean = { ...inner }
  delete clean._note
  delete clean._stats

  // Split content: description → Lexical
  if (clean.blockType === 'split-content') {
    if (clean.description && typeof clean.description === 'string') {
      clean.description = textToLexical(clean.description)
    }
    // media placeholder → null
    if (typeof clean.media === 'string') clean.media = null
  }

  // Card grid: card descriptions → Lexical
  if (clean.blockType === 'card-grid') {
    if (clean.cards) {
      clean.cards = clean.cards.map(card => {
        const c = { ...card }
        if (c.description && typeof c.description === 'string') {
          c.description = textToLexical(c.description)
        }
        if (c.calloutDescription && typeof c.calloutDescription === 'string') {
          c.calloutDescription = textToLexical(c.calloutDescription)
        }
        // Ensure icon structure
        if (c.icon && typeof c.icon === 'string') {
          c.icon = { source: 'preset', preset: c.icon }
        }
        // List items — convert content/description to Lexical
        if (c.items && Array.isArray(c.items)) {
          c.items = c.items.map(item => {
            const clean = { ...item }
            // Legacy flat content field
            if (clean.content && typeof clean.content === 'string') {
              clean.content = textToLexical(clean.content)
            }
            // New structured description field
            if (clean.description && typeof clean.description === 'string') {
              clean.description = textToLexical(clean.description)
            }
            return clean
          })
        }
        return c
      })
    }
    // CTA within card grid
    if (clean.ctas) {
      clean.ctas = clean.ctas.map(sanitizeCta)
    }
  }

  // FAQ items: answers → Lexical, ensure at least 1 item
  if (clean.blockType === 'faqs') {
    if (!clean.items || clean.items.length === 0) {
      clean.items = [{ question: '(FAQ question to be added)', answer: textToLexical('(Answer to be added)') }]
    } else {
      clean.items = clean.items.map(item => ({
        ...item,
        answer: typeof item.answer === 'string'
          ? textToLexical(item.answer)
          : item.answer || textToLexical('(content to be added)'),
      }))
    }
  }

  // Rich text block
  if (clean.blockType === 'rich-text') {
    if (typeof clean.content === 'string') {
      clean.content = textToLexical(clean.content)
    }
  }

  // Steps: bottomText → Lexical, ensure min 2 steps
  if (clean.blockType === 'steps') {
    if (clean.bottomText && typeof clean.bottomText === 'string') {
      clean.bottomText = textToLexical(clean.bottomText)
    }
    if (!clean.steps || clean.steps.length < 2) {
      clean.steps = clean.steps || []
      while (clean.steps.length < 2) {
        clean.steps.push({ description: '(step to be added)', icon: { source: 'preset', preset: 'search' } })
      }
    }
    clean.steps = clean.steps.map(s => ({
      ...s,
      icon: s.icon || { source: 'preset', preset: 'search' },
    }))
  }

  // Comparison table: cell content → Lexical, ensure min 2 rows with min 2 cells
  if (clean.blockType === 'comparison-table') {
    if (!clean.rows || clean.rows.length < 2) {
      clean.rows = [
        { cells: [
          { type: 'richtext', content: textToLexical('Feature') },
          { type: 'richtext', content: textToLexical('VHR.eu') },
          { type: 'richtext', content: textToLexical('Competitor') },
        ]},
        { cells: [
          { type: 'richtext', content: textToLexical('(row to be added)') },
          { type: 'check' },
          { type: 'x' },
        ]},
      ]
    } else {
      clean.rows = clean.rows.map(row => ({
        ...row,
        cells: (row.cells || []).map(cell => ({
          ...cell,
          content: typeof cell.content === 'string'
            ? textToLexical(cell.content)
            : cell.content,
        })),
      }))
    }
  }

  return clean
}

const VALID_RELS = new Set(['none', 'nofollow', 'sponsored', 'ugc'])

function sanitizeCta(cta) {
  const rel = VALID_RELS.has(cta.rel) ? cta.rel : 'none'
  return {
    label: cta.label,
    href: cta.href,
    style: cta.style || 'primary',
    rel,
    newTab: cta.newTab || false,
  }
}

// ── Payload API client ──────────────────────────────────────────────

let authToken = null

async function login() {
  const res = await fetch(`${PAYLOAD_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  })
  const data = await res.json()
  if (!data.token) throw new Error(`Login failed: ${JSON.stringify(data)}`)
  authToken = data.token
  return authToken
}

async function findPageBySlug(slug) {
  const res = await fetch(
    `${PAYLOAD_URL}/api/pages?where[slug][equals]=${encodeURIComponent(slug)}&limit=1`,
    { headers: { Authorization: `JWT ${authToken}` } }
  )
  const data = await res.json()
  return data.docs?.[0] || null
}

async function createPage(pageData) {
  const res = await fetch(`${PAYLOAD_URL}/api/pages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${authToken}`,
    },
    body: JSON.stringify(pageData),
    signal: AbortSignal.timeout(60_000),
  })
  const data = await res.json()
  if (data.errors) {
    console.error('  Errors:', JSON.stringify(data.errors, null, 2))
    return null
  }
  return data.doc
}

async function updatePage(id, pageData) {
  const res = await fetch(`${PAYLOAD_URL}/api/pages/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${authToken}`,
    },
    body: JSON.stringify(pageData),
    signal: AbortSignal.timeout(60_000),
  })
  const data = await res.json()
  if (data.errors) {
    console.error('  Errors:', JSON.stringify(data.errors, null, 2))
    return null
  }
  return data.doc
}

// ── Main ────────────────────────────────────────────────────────────

const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const pageFilterIdx = args.indexOf('--page')
const pageFilter = pageFilterIdx !== -1 ? args[pageFilterIdx + 1] : null

async function main() {
  if (!dryRun) {
    console.log(`Connecting to Payload at ${PAYLOAD_URL}...`)
    await login()
    console.log('Authenticated.\n')
  }

  for (const page of PAGES) {
    if (pageFilter && page.page !== pageFilter) continue

    const slug = page.slug
    const title = page.title?.split('|')[0]?.split('-')[0]?.trim() || slug

    // Sanitize all blocks
    const blocks = page.blocks
      .filter(b => !b.content?.[0]?._note?.includes('Deferred')) // skip deferred blocks
      .map(sanitizeBlock)

    console.log(`━━━ ${page.page} (slug: "${slug}") ━━━`)
    console.log(`  Title: ${title}`)
    console.log(`  Blocks: ${blocks.length}`)

    if (dryRun) {
      blocks.forEach((b, i) => {
        const inner = b.content?.[0]?.blockType || ''
        console.log(`    ${i + 1}. ${b.blockType}${inner ? ' → ' + inner : ''}`)
      })
      console.log()
      continue
    }

    // Check if page already exists
    const existing = await findPageBySlug(slug)
    const pageData = {
      title,
      slug,
      content: blocks,
      _status: 'published',
    }

    if (existing) {
      console.log(`  Found existing page (id: ${existing.id}) — updating...`)
      const updated = await updatePage(existing.id, pageData)
      if (updated) {
        console.log(`  Updated! ID: ${updated.id}, Blocks: ${updated.content?.length}`)
      } else {
        console.log(`  FAILED to update.`)
      }
    } else {
      console.log(`  Creating new page...`)
      const created = await createPage(pageData)
      if (created) {
        console.log(`  Created! ID: ${created.id}, Blocks: ${created.content?.length}`)
      } else {
        console.log(`  FAILED to create.`)
      }
    }
    console.log()
  }

  console.log('Done.')
}

main().catch(err => {
  console.error('Fatal:', err.message)
  process.exit(1)
})
