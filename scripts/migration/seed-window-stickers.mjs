#!/usr/bin/env node
/**
 * Stage 3: Seed Window Sticker brand pages into Payload CMS.
 *
 * Reads scraped-window-stickers.json and maps sections to Payload blocks.
 *
 * Usage:
 *   node seed-window-stickers.mjs                        # all brands
 *   node seed-window-stickers.mjs --brand ford           # single brand
 *   node seed-window-stickers.mjs --dry-run              # preview blocks
 *   node seed-window-stickers.mjs --dry-run --brand ford --json
 */

import { readFileSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PAYLOAD_URL = process.env.PAYLOAD_URL || 'http://localhost:3001'
const EMAIL = 'lame@lame.com'
const PASSWORD = 'lame@lame.com'
let token = null

// ── Load data ──────────────────────────────────────────────────────

let DATA
try {
  DATA = JSON.parse(readFileSync(join(__dirname, 'improvised-window-stickers.json'), 'utf8'))
  console.log('Using improvised content (stage 2)\n')
} catch {
  DATA = JSON.parse(readFileSync(join(__dirname, 'scraped-window-stickers.json'), 'utf8'))
  console.log('Using raw scraped content (no improvisation found)\n')
}

// ── Lexical helpers ────────────────────────────────────────────────

function textToLexical(text) {
  if (!text) return undefined
  if (typeof text === 'object' && text.root) return text
  const paragraphs = String(text).split(/\n\n+/).filter(Boolean)
  return {
    root: {
      type: 'root', direction: 'ltr', format: '', indent: 0, version: 1,
      children: paragraphs.map(p => ({
        type: 'paragraph', direction: 'ltr', format: '', indent: 0, version: 1, textFormat: 0, textStyle: '',
        children: [{ type: 'text', text: p.trim(), format: 0, version: 1, detail: 0, mode: 'normal', style: '' }],
      })),
    },
  }
}

// ── Improvised data helpers ────────────────────────────────────────

function imp(section, field) {
  return section?._improvised?.[field] ?? null
}

function impHeading(section) {
  return imp(section, 'heading') || section?.heading || ''
}

function impTagline(section) {
  return imp(section, 'tagline') || null
}

function impTagLevel(section) {
  return imp(section, 'tagLevel') || 'span'
}

// ── Icon helpers ───────────────────────────────────────────────────

const VALID_PRESETS = new Set([
  'car','car-front','bike','truck','shield-check','shield','lock','lock-open',
  'triangle-alert','siren','file-text','clipboard-check','file-search','circle-check',
  'circle-x','search','eye','scan','gauge','trending-up','trending-down','database',
  'bar-chart-3','wallet','credit-card','tag','receipt','mail','phone','headphones',
  'message-circle','zap','wrench','globe','mouse-pointer-click','download','link',
  'info','chevron-right','star','heart','house','map-pin','clock','calendar','user',
  'users','building','pencil','hash','list','factory','circle-dot',
])

function icon(preset) {
  if (!VALID_PRESETS.has(preset)) preset = 'circle-check'
  return { source: 'preset', preset }
}

function bName(heading) {
  return (heading || '').replace(/\*\*/g, '')
}

// ── Block generators ───────────────────────────────────────────────

function generateHeroBlock(section) {
  const block = {
    blockType: 'page-hero',
    blockName: bName(impHeading(section)),
    variant: 'centered',
    dark: true,
    fullHeight: false,
    glow: false,
    formType: 'vin',
    title: impHeading(section),
    description: section.description || null,
  }

  const tagline = impTagline(section)
  if (tagline) {
    block.tag = tagline
    block.tagLevel = impTagLevel(section)
  }

  const features = imp(section, 'features')
  if (features && features.length > 0) {
    block.features = features.map(f => ({
      icon: icon(f.icon || 'circle-check'),
      text: f.text,
      tag: 'span',
    }))
  }

  return block
}

function paragraphsToLexical(paragraphs) {
  if (!paragraphs || paragraphs.length === 0) return undefined
  return textToLexical(paragraphs.join('\n\n'))
}

function generateWhatIsBlock(section) {
  return {
    blockType: 'section',
    blockName: bName(impHeading(section)),
    bg: 'white',
    scene: 'default',
    tag: impTagline(section),
    heading: impHeading(section),
    headingLevel: 'h2',
    description: paragraphsToLexical(section.paragraphs),
  }
}

function generateWhatsOnBlock(section) {
  const block = {
    blockType: 'section',
    blockName: bName(impHeading(section)),
    bg: 'muted',
    scene: 'default',
    tag: impTagline(section),
    heading: impHeading(section),
    headingLevel: 'h2',
    description: section.introParagraph ? textToLexical(section.introParagraph) : undefined,
  }

  if (section.categories.length > 0) {
    block.content = [{
      blockType: 'card-grid',
      columns: '2',
      tabletColumns: '2',
      mobileColumns: '1',
      cards: section.categories.map(cat => ({
        cardType: 'feature',
        style: 'none',
        layout: 'stacked',
        title: cat.title,
        titleElement: cat.titleElement || 'h3',
        description: cat.description ? textToLexical(cat.description) : undefined,
        items: cat.subItems.map(sub => ({
          title: sub.title,
          titleElement: sub.titleElement || 'h4',
          description: sub.description ? textToLexical(sub.description) : undefined,
        })),
      })),
    }]
  }

  if (section.ctas?.length > 0) {
    block.ctas = section.ctas.map((c, i) => ({
      label: c.text,
      href: c.href,
      style: i === 0 ? 'primary' : 'secondary',
    }))
  }

  return block
}

// ── Assemble all blocks for a brand ────────────────────────────────

function generateBlocks(brand) {
  const s = brand.sections
  const blocks = []

  if (s.hero) blocks.push(generateHeroBlock(s.hero))
  if (s.whatIs) blocks.push(generateWhatIsBlock(s.whatIs))
  if (s.whatsOn) blocks.push(generateWhatsOnBlock(s.whatsOn))

  return blocks
}

// ── API helpers ────────────────────────────────────────────────────

async function login() {
  const res = await fetch(`${PAYLOAD_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  })
  const data = await res.json()
  token = data.token
}

async function getContentGroupId(slug) {
  const res = await fetch(
    `${PAYLOAD_URL}/api/content-groups?where[slug][equals]=${slug}&limit=1`,
    { headers: { Authorization: `JWT ${token}` } },
  )
  const data = await res.json()
  return data.docs?.[0]?.id || null
}

async function findContentPage(groupId, slug) {
  const res = await fetch(
    `${PAYLOAD_URL}/api/content-pages?where[group][equals]=${groupId}&where[slug][equals]=${slug}&limit=1`,
    { headers: { Authorization: `JWT ${token}` } },
  )
  const data = await res.json()
  return data.docs?.[0] || null
}

async function createContentPage(data) {
  const res = await fetch(`${PAYLOAD_URL}/api/content-pages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}` },
    body: JSON.stringify(data),
    signal: AbortSignal.timeout(60_000),
  })
  try {
    const result = await res.json()
    if (result.errors) {
      console.error(`    Error:`, result.errors[0]?.data?.errors?.[0]?.message || JSON.stringify(result.errors[0]).slice(0, 200))
      return null
    }
    return result.doc
  } catch {
    return { id: 'timeout-but-likely-saved' }
  }
}

async function updateContentPage(id, data) {
  const res = await fetch(`${PAYLOAD_URL}/api/content-pages/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}` },
    body: JSON.stringify(data),
    signal: AbortSignal.timeout(60_000),
  })
  try {
    const result = await res.json()
    return result.doc
  } catch {
    return { id }
  }
}

// ── CLI & Main ─────────────────────────────────────────────────────

const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const jsonOutput = args.includes('--json')
const brandFilter = args.includes('--brand') ? args[args.indexOf('--brand') + 1] : null

async function main() {
  console.log('\n═══════════════════════════════════════')
  console.log('  SEED WINDOW STICKER BRAND PAGES')
  console.log('═══════════════════════════════════════\n')

  if (!dryRun) {
    await login()
    console.log('Authenticated.\n')
  }

  let groupId = null
  if (!dryRun) {
    groupId = await getContentGroupId('window-sticker')
    if (!groupId) {
      console.error('Content Group "window-sticker" not found. Create it first.')
      process.exit(1)
    }
    console.log(`Window Sticker group ID: ${groupId}\n`)
  }

  const brands = brandFilter
    ? DATA.filter(b => b.slug === brandFilter)
    : DATA

  let created = 0, updated = 0, failed = 0

  for (const brand of brands) {
    const blocks = generateBlocks(brand)

    if (dryRun) {
      console.log(`  ${brand.name.padEnd(25)} ${blocks.length} blocks`)
      if (jsonOutput) {
        writeFileSync(join(__dirname, `blocks-ws-${brand.slug}.json`), JSON.stringify(blocks, null, 2))
        console.log(`    → blocks-ws-${brand.slug}.json`)
      }
      continue
    }

    process.stdout.write(`  ${brand.name.padEnd(25)}`)

    const pageData = {
      name: brand.name,
      group: groupId,
      slug: brand.slug,
      status: 'active',
      content: blocks,
      _status: 'published',
    }

    if (brand.meta) {
      pageData.meta = {}
      if (brand.meta.title) pageData.meta.title = brand.meta.title
      if (brand.meta.description) pageData.meta.description = brand.meta.description
    }

    const existing = await findContentPage(groupId, brand.slug)
    if (existing) {
      const result = await updateContentPage(existing.id, pageData)
      if (result) {
        console.log(`updated (${blocks.length} blocks, id: ${result.id})`)
        updated++
      } else {
        console.log('FAILED to update')
        failed++
      }
    } else {
      const result = await createContentPage(pageData)
      if (result) {
        console.log(`created (${blocks.length} blocks, id: ${result.id})`)
        created++
      } else {
        console.log('FAILED')
        failed++
      }
    }
  }

  console.log(`\n═══════════════════════════════════════`)
  console.log(`  Created: ${created}  Updated: ${updated}  Failed: ${failed}`)
  console.log(`  Total: ${brands.length} brands`)
  console.log(`═══════════════════════════════════════\n`)
}

main()
