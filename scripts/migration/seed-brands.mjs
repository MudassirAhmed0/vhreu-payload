#!/usr/bin/env node
/**
 * Stage 3: Seed VIN Decoder brand pages into Payload CMS.
 *
 * Reads improvised-brands.json (falls back to scraped-brands.json)
 * and maps each section to the correct Payload block structure.
 *
 * Usage:
 *   node seed-brands.mjs                        # all brands
 *   node seed-brands.mjs --brand audi           # single brand
 *   node seed-brands.mjs --dry-run              # preview blocks
 *   node seed-brands.mjs --dry-run --brand audi --json
 */

import { readFileSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PAYLOAD_URL = process.env.PAYLOAD_URL || 'http://localhost:3001'
const EMAIL = 'lame@lame.com'
const PASSWORD = 'lame@lame.com'
let token = null

// ── Load data ─────────────────────────────────────────────────────

let DATA
try {
  DATA = JSON.parse(readFileSync(join(__dirname, 'improvised-brands.json'), 'utf8'))
  console.log('Using improvised content (stage 2)\n')
} catch {
  DATA = JSON.parse(readFileSync(join(__dirname, 'scraped-brands.json'), 'utf8'))
  console.log('Using raw scraped content (no improvisation found)\n')
}

// ── Lexical helpers ───────────────────────────────────────────────

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

function paragraphsToLexical(paragraphs) {
  if (!paragraphs || paragraphs.length === 0) return undefined
  return textToLexical(paragraphs.join('\n\n'))
}

// ── Improvised data helpers ───────────────────────────────────────

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

// ── Icon helpers ──────────────────────────────────────────────────

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

// ── Feature icon guessing ─────────────────────────────────────────

function guessFeatureIcon(text) {
  const t = text.toLowerCase()
  if (t.includes('auction')) return 'car'
  if (t.includes('title') && t.includes('condition')) return 'clipboard-check'
  if (t.includes('sales history') || t.includes('sale')) return 'trending-up'
  if (t.includes('title') && t.includes('record')) return 'file-text'
  if (t.includes('accident')) return 'triangle-alert'
  if (t.includes('mileage') || t.includes('odometer')) return 'gauge'
  if (t.includes('recall')) return 'siren'
  if (t.includes('theft') || t.includes('stolen')) return 'lock'
  if (t.includes('spec') || t.includes('detail')) return 'list'
  if (t.includes('owner') || t.includes('registration')) return 'user'
  if (t.includes('damage') || t.includes('salvage')) return 'circle-x'
  if (t.includes('inspection')) return 'search'
  if (t.includes('warranty')) return 'shield-check'
  if (t.includes('insurance')) return 'shield'
  if (t.includes('emission')) return 'factory'
  return 'circle-check'
}

// ── Block generators ──────────────────────────────────────────────

function generateHeroBlock(section) {
  const block = {
    blockType: 'page-hero',
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

  // Features come from scraper, not improviser
  if (section.features && section.features.length > 0) {
    block.features = section.features.map(f => ({
      icon: icon(guessFeatureIcon(f.text)),
      text: f.text,
      tag: f.tag || 'span',
    }))
  }

  return block
}

async function generateWhatIsVinBlock(section) {
  // Upload image if available
  let mediaId = null
  if (section.imageUrl && token) {
    mediaId = await uploadMedia(section.imageUrl, section.imageAlt || 'VIN location diagram')
  }

  // Split-content rule: section wrapper is empty, all content in the inner block
  const splitContent = {
    blockType: 'split-content',
    tag: impTagline(section),
    heading: impHeading(section),
    headingLevel: section.headingLevel || 'h2',
    description: paragraphsToLexical(section.paragraphs),
    mediaType: 'image',
    reverse: false,
  }
  if (mediaId) splitContent.media = mediaId

  return {
    blockType: 'section',
    bg: 'white',
    scene: 'default',
    content: [splitContent],
  }
}

// ── Standard VIN digit ranges by segment label ──────────────────────

const DIGIT_MAP = {
  'wmi': '1-3',
  'vds': '4-8',
  'check digit': '9',
  'model year': '10',
  'assembly plant': '11',
  'production sequence': '12-17',
  'vis': '10-17',
  'sequential number': '12-17',
  'serial number': '12-17',
  'plant code': '11',
  'year code': '10',
}

function guessDigits(title) {
  const t = title.toLowerCase()

  // "Characters 1-3", "Characters 10", "Characters 13-17"
  const charMatch = t.match(/characters?\s+(\d+)(?:\s*[-–]\s*(\d+))?/)
  if (charMatch) return charMatch[2] ? `${charMatch[1]}-${charMatch[2]}` : charMatch[1]

  // "The first character...", "The ninth character...", "12-17. The twelfth..."
  const ordinalMatch = t.match(/^(?:(\d+)(?:\s*[-–]\s*(\d+))?\.\s*)?the\s+(first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth|eleventh|twelfth)/)
  if (ordinalMatch) {
    if (ordinalMatch[1]) return ordinalMatch[2] ? `${ordinalMatch[1]}-${ordinalMatch[2]}` : ordinalMatch[1]
    const ordinals = { first: '1', second: '2', third: '3', fourth: '4', fifth: '5', sixth: '6', seventh: '7', eighth: '8', ninth: '9', tenth: '10', eleventh: '11', twelfth: '12' }
    return ordinals[ordinalMatch[3]] || null
  }

  for (const [key, digits] of Object.entries(DIGIT_MAP)) {
    if (t.includes(key)) return digits
  }
  return null
}

/** Parse "World Manufacturer Identifier (WMI)" → { label: "WMI", fullName: "World Manufacturer Identifier" } */
function parseSegmentTitle(title) {
  // Format: "Full Name (ABBREV)" — e.g. "World Manufacturer Identifier (WMI)"
  const parenMatch = title.match(/^(.+?)\s*\(([A-Z]{2,5})\)\s*$/)
  if (parenMatch) return { label: parenMatch[2].trim(), fullName: parenMatch[1].trim() }

  // Format: "ABBREV (Full Name)" — e.g. "WMI (World Manufacturer Identifier)"
  const reverseMatch = title.match(/^([A-Z]{2,5})\s*[\(–\-—:]\s*(.+?)\)?\s*$/)
  if (reverseMatch) return { label: reverseMatch[1].trim(), fullName: reverseMatch[2].trim() }

  // Plain labels without abbreviation
  const knownLabels = ['Check Digit', 'Model Year', 'Assembly Plant', 'Production Sequence']
  for (const kl of knownLabels) {
    if (title.toLowerCase().includes(kl.toLowerCase())) {
      return { label: kl, fullName: kl }
    }
  }

  return { label: title, fullName: title }
}

// Sample VIN WMI prefixes per brand (first 3 chars)
const BRAND_WMI = {
  acura: 'JH4', 'alfa-romeo': 'ZAR', audi: 'WAU', bmw: 'WBA',
  citroen: 'VF7', fiat: 'ZFA', jaguar: 'SAJ', 'land-rover': 'SAL',
  'mercedes-benz': 'WDB', mini: 'WMW', peugeot: 'VF3', porsche: 'WP0',
  renault: 'VF1', saab: 'YS3', volkswagen: 'WVW', volvo: 'YV1',
}

function sampleVinForBrand(slug) {
  const wmi = BRAND_WMI[slug] || 'WBA'
  // Build a realistic 17-char VIN
  return `${wmi}ZZZ8V5KA012345`.slice(0, 17)
}

function generateVinStructureBlock(section, brandSlug) {
  let segments = (section.segments || []).map(seg => {
    const parsed = parseSegmentTitle(seg.title)
    return {
      label: parsed.label,
      fullName: parsed.fullName,
      digits: guessDigits(seg.title) || '1-3',
      description: textToLexical(seg.description),
    }
  })

  // Mark VIS as group header when sub-components cover the same range — keeps the h3 but skips visual highlight
  const hasSubComponents = segments.some(s => s.digits === '10') && segments.some(s => s.digits === '12-17')
  if (hasSubComponents) {
    segments = segments.map(s => s.digits === '10-17' ? { ...s, digits: 'group' } : s)
  }

  const vinAnatomy = {
    blockType: 'vin-anatomy',
    sampleVin: sampleVinForBrand(brandSlug),
    titleElement: /^h[3-4]$/.test(section.segments?.[0]?.titleElement) ? section.segments[0].titleElement : 'span',
    segments,
  }

  return {
    blockType: 'section',
    bg: 'muted',
    scene: 'default',
    tag: impTagline(section),
    heading: impHeading(section),
    headingLevel: section.headingLevel || 'h2',
    content: [vinAnatomy],
  }
}

function guessLocationIcon(title) {
  const t = title.toLowerCase()
  if (t.includes('dashboard')) return 'car-front'
  if (t.includes('door')) return 'scan'
  if (t.includes('hood') || t.includes('engine')) return 'wrench'
  if (t.includes('frame') || t.includes('chassis')) return 'car'
  if (t.includes('document') || t.includes('title') || t.includes('registration')) return 'file-text'
  return 'map-pin'
}

async function generateWhereToFindBlock(section) {
  // Upload image if available
  let mediaId = null
  if (section.imageUrl && token) {
    mediaId = await uploadMedia(section.imageUrl, section.imageAlt || 'Where to find VIN on car')
  }

  const seen = new Set()
  const locs = (section.locations || []).filter(loc => {
    if (seen.has(loc.title)) return false
    seen.add(loc.title)
    return true
  })
  const cards = locs.map((loc, i) => ({
    icon: icon(guessLocationIcon(loc.title)),
    title: loc.title,
    titleElement: loc.titleElement || 'h3',
    colSpan: (locs.length % 2 === 1 && i === locs.length - 1) ? '2' : '1',
    cardDescription: textToLexical(loc.description),
  }))

  const splitContent = {
    blockType: 'split-content',
    tag: impTagline(section),
    heading: impHeading(section),
    headingLevel: section.headingLevel === 'h3' ? 'h3' : 'h2',
    contentType: 'cards',
    cardColumns: '2',
    cards,
    mediaType: 'image',
    reverse: false,
  }
  if (mediaId) splitContent.media = mediaId

  return {
    blockType: 'section',
    bg: 'white',
    scene: 'default',
    content: [splitContent],
  }
}

async function generateHowToDecodeBlock(section) {
  let mediaId = null
  if (section.imageUrl && token) {
    mediaId = await uploadMedia(section.imageUrl, section.imageAlt || 'VIN Number 17 Digits')
  }

  const cards = (section.steps || []).map(s => ({
    title: s.title,
    titleElement: s.titleElement || 'h3',
    colSpan: '1',
    cardDescription: textToLexical(s.description),
  }))

  const splitContent = {
    blockType: 'split-content',
    tag: impTagline(section),
    heading: impHeading(section),
    headingLevel: section.headingLevel || 'h2',
    contentType: 'cards',
    cardColumns: '2',
    cards,
    mediaType: 'image',
    reverse: true,
  }
  if (mediaId) splitContent.media = mediaId

  return {
    blockType: 'section',
    bg: 'white',
    scene: 'default',
    content: [splitContent],
  }
}

function guessLearnIcon(title) {
  const t = title.toLowerCase()
  if (t.includes('spec')) return 'list'
  if (t.includes('manufactur')) return 'factory'
  if (t.includes('accident')) return 'triangle-alert'
  if (t.includes('mileage') || t.includes('odometer')) return 'gauge'
  if (t.includes('title') || t.includes('lien')) return 'file-text'
  if (t.includes('auction')) return 'car'
  if (t.includes('service') || t.includes('maintenance')) return 'wrench'
  if (t.includes('theft') || t.includes('stolen')) return 'lock'
  if (t.includes('recall')) return 'siren'
  if (t.includes('owner')) return 'user'
  return 'circle-check'
}

function generateWhatYoullLearnBlock(section) {
  const cards = (section.items || []).map(item => ({
    cardType: 'feature',
    colSpan: '1',
    style: 'icon',
    layout: 'stacked',
    icon: icon(guessLearnIcon(item.title)),
    title: item.title.replace(/:\s*$/, ''),
    titleElement: item.titleElement || 'h3',
    description: textToLexical(item.description),
  }))

  const cardGrid = {
    blockType: 'card-grid',
    columns: '3',
    tabletColumns: '2',
    mobileColumns: '1',
    cards,
  }

  const block = {
    blockType: 'section',
    bg: 'white',
    scene: 'default',
    tag: impTagline(section),
    heading: impHeading(section),
    headingLevel: section.headingLevel || 'h2',
    content: [cardGrid],
  }

  if (section.introParagraph) {
    block.description = textToLexical(section.introParagraph)
  }
  if (section.closingParagraph) {
    block.bottomText = textToLexical(section.closingParagraph)
  }

  return block
}

function generateFaqBlock(section) {
  const items = (section.items || []).map(item => ({
    question: item.question,
    answer: textToLexical(item.answer),
  }))

  const faqs = {
    blockType: 'faqs',
    questionElement: /^h[3-5]$/.test(section.questionElement) ? section.questionElement : 'span',
    items,
  }

  return {
    blockType: 'section',
    bg: 'muted',
    scene: 'default',
    narrow: true,
    tag: impTagline(section),
    heading: impHeading(section),
    headingLevel: section.headingLevel || 'h2',
    content: [faqs],
  }
}

function generateOtherMakesBlock(section) {
  const items = (section.brands || []).map(b => ({
    label: b.label,
    href: b.href,
  }))

  const linkCardGrid = {
    blockType: 'link-card-grid',
    columns: '5',
    tabletColumns: '3',
    mobileColumns: '2',
    size: 'small',
    items,
  }

  return {
    blockType: 'section',
    bg: 'white',
    scene: 'default',
    tag: impTagline(section),
    heading: impHeading(section),
    headingLevel: section.headingLevel || 'h3',
    content: [linkCardGrid],
  }
}

function generateModelsListBlock(section) {
  const items = (section.models || []).map(model => ({
    label: model,
  }))

  const linkCardGrid = {
    blockType: 'link-card-grid',
    columns: '5',
    tabletColumns: '3',
    mobileColumns: '2',
    size: 'small',
    items,
  }

  return {
    blockType: 'section',
    bg: 'muted',
    scene: 'default',
    tag: impTagline(section),
    heading: impHeading(section),
    headingLevel: section.headingLevel === 'h3' ? 'h3' : 'h2',
    content: [linkCardGrid],
  }
}

async function generateSampleReportBlock(section) {
  let mediaId = null
  if (section.imageUrl && token) {
    mediaId = await uploadMedia(section.imageUrl, section.imageAlt || 'Vehicle History Report sample')
  }

  const descText = section.specs?.join('\n\n') || ''

  const splitContent = {
    blockType: 'split-content',
    heading: section.vehicleTitle || 'Sample Report',
    headingLevel: section.headingLevel || 'span',
    description: textToLexical(descText),
    contentType: 'richtext',
    mediaType: 'image',
    reverse: false,
    ctas: section.reportLink ? [{ label: 'Click to See Full Report', href: section.reportLink, style: 'primary' }] : [],
  }
  if (mediaId) splitContent.media = mediaId

  return {
    blockType: 'section',
    bg: 'muted',
    scene: 'default',
    tag: impTagline(section),
    heading: impHeading(section),
    headingLevel: section.headingLevel || 'span',
    content: [splitContent],
  }
}

// ── Assemble all blocks for a brand ───────────────────────────────

async function generateBlocks(brand) {
  const s = brand.sections
  const blocks = []

  if (s.hero) blocks.push(generateHeroBlock(s.hero))
  if (s.whatIsVin) blocks.push(await generateWhatIsVinBlock(s.whatIsVin))
  if (s.vinStructure) blocks.push(generateVinStructureBlock(s.vinStructure, brand.slug))
  if (s.whereToFind) blocks.push(await generateWhereToFindBlock(s.whereToFind))
  if (s.modelsList) blocks.push(generateModelsListBlock(s.modelsList))
  if (s.sampleReport) blocks.push(await generateSampleReportBlock(s.sampleReport))
  if (s.howToDecode) blocks.push(await generateHowToDecodeBlock(s.howToDecode))
  if (s.whatYoullLearn) blocks.push(generateWhatYoullLearnBlock(s.whatYoullLearn))
  if (s.faq) blocks.push(generateFaqBlock(s.faq))
  if (s.otherMakes) blocks.push(generateOtherMakesBlock(s.otherMakes))

  return blocks
}

// ── API helpers ───────────────────────────────────────────────────

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
  // Search by group first, fall back to global slug search (handles cross-group moves)
  let res = await fetch(
    `${PAYLOAD_URL}/api/content-pages?where[group][equals]=${groupId}&where[slug][equals]=${slug}&limit=1`,
    { headers: { Authorization: `JWT ${token}` } },
  )
  let data = await res.json()
  if (data.docs?.[0]) return data.docs[0]

  res = await fetch(
    `${PAYLOAD_URL}/api/content-pages?where[slug][equals]=${slug}&limit=1`,
    { headers: { Authorization: `JWT ${token}` } },
  )
  data = await res.json()
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
      console.error(`    Error:`, JSON.stringify(result.errors, null, 2).slice(0, 500))
      return null
    }
    return result.doc
  } catch {
    return { id: 'timeout-but-likely-saved' }
  }
}

async function uploadMedia(url, alt) {
  // Download file
  const res = await fetch(url)
  if (!res.ok) { console.error(`    Download failed: ${res.status} ${url}`); return null }
  const buffer = Buffer.from(await res.arrayBuffer())
  const filename = url.split('/').pop()

  // Check if already uploaded (by filename or alt text)
  const check = await fetch(
    `${PAYLOAD_URL}/api/media?where[alt][equals]=${encodeURIComponent(alt || filename)}&limit=1`,
    { headers: { Authorization: `JWT ${token}` } },
  )
  const existing = await check.json()
  if (existing.docs?.[0]?.id) return existing.docs[0].id

  // Upload via multipart form — Payload 3.x reads fields from _payload JSON
  const ext = filename.split('.').pop()?.toLowerCase() || 'bin'
  const mimeTypes = { svg: 'image/svg+xml', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp' }
  const mime = mimeTypes[ext] || 'application/octet-stream'

  const form = new FormData()
  form.append('_payload', JSON.stringify({ alt: alt || filename }))
  form.append('file', new File([buffer], filename, { type: mime }))

  const upload = await fetch(`${PAYLOAD_URL}/api/media`, {
    method: 'POST',
    headers: { Authorization: `JWT ${token}` },
    body: form,
  })
  const result = await upload.json()
  if (result.errors) {
    console.error(`    Upload error:`, JSON.stringify(result.errors[0]?.message || result.errors).slice(0, 200))
    return null
  }
  return result.doc?.id || null
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

// ── CLI & Main ────────────────────────────────────────────────────

const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const jsonOutput = args.includes('--json')
const brandFilter = args.includes('--brand') ? args[args.indexOf('--brand') + 1] : null

async function main() {
  console.log('\n═══════════════════════════════════════')
  console.log('  SEED VIN DECODER BRAND PAGES')
  console.log('═══════════════════════════════════════\n')

  if (!dryRun) {
    await login()
    console.log('Authenticated.\n')
  }

  let groupId = null
  if (!dryRun) {
    groupId = await getContentGroupId('vin-decoder')
    if (!groupId) {
      console.error('Content Group "vin-decoder" not found. Create it first.')
      process.exit(1)
    }
    console.log(`VIN Decoder group ID: ${groupId}\n`)
  }

  const brands = brandFilter
    ? DATA.filter(b => b.slug === brandFilter)
    : DATA

  if (brands.length === 0) {
    console.error(`Brand "${brandFilter}" not found in data.`)
    process.exit(1)
  }

  let created = 0, updated = 0, failed = 0

  for (const brand of brands) {
    const blocks = await generateBlocks(brand)

    if (dryRun) {
      console.log(`  ${brand.name.padEnd(25)} ${blocks.length} blocks`)
      if (jsonOutput) {
        writeFileSync(join(__dirname, `blocks-${brand.slug}.json`), JSON.stringify(blocks, null, 2))
        console.log(`    → blocks-${brand.slug}.json`)
      }
      continue
    }

    process.stdout.write(`  ${brand.name.padEnd(25)}`)

    const existing = await findContentPage(groupId, brand.slug)
    const payload = {
      name: brand.name,
      slug: brand.slug,
      group: groupId,
      content: blocks,
      meta: brand.meta,
      _status: 'published',
    }

    if (existing) {
      await updateContentPage(existing.id, payload)
      console.log(`UPDATED (${blocks.length} blocks)`)
      updated++
    } else {
      const doc = await createContentPage(payload)
      if (doc) {
        console.log(`CREATED (${blocks.length} blocks)`)
        created++
      } else {
        console.log(`FAILED`)
        failed++
      }
    }
  }

  console.log(`\n  Done: ${created} created, ${updated} updated, ${failed} failed\n`)
}

main().catch(err => { console.error(err); process.exit(1) })
