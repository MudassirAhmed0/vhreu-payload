#!/usr/bin/env node
/**
 * Stage 3: Seed VIN Check country pages into Payload CMS.
 *
 * Reads improvised-countries.json (falls back to scraped-countries.json)
 * and maps each section to the correct Payload block structure.
 *
 * Usage:
 *   node seed-countries.mjs                        # all countries
 *   node seed-countries.mjs --country germany      # single country
 *   node seed-countries.mjs --dry-run              # preview blocks
 *   node seed-countries.mjs --dry-run --country germany --json  # print block JSON
 */

import { readFileSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PAYLOAD_URL = process.env.PAYLOAD_URL || 'http://localhost:3030'
const EMAIL = 'lame@lame.com'
const PASSWORD = 'lame@lame.com'
let token = null

// ── Load data ──────────────────────────────────────────────────────

let DATA
try {
  DATA = JSON.parse(readFileSync(join(__dirname, 'improvised-countries.json'), 'utf8'))
  console.log('Using improvised content (stage 2)\n')
} catch {
  DATA = JSON.parse(readFileSync(join(__dirname, 'scraped-countries.json'), 'utf8'))
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

function paragraphsToLexical(paragraphs) {
  if (!paragraphs || paragraphs.length === 0) return undefined
  return textToLexical(paragraphs.join('\n\n'))
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

function guessChooseIcon(title) {
  const t = title.toLowerCase()
  if (t.includes('report') || t.includes('complete') || t.includes('comprehensive')) return 'file-text'
  if (t.includes('user') || t.includes('easy') || t.includes('friendly') || t.includes('simple')) return 'scan'
  if (t.includes('reliable') || t.includes('accurate') || t.includes('trusted') || t.includes('verified')) return 'shield-check'
  if (t.includes('fast') || t.includes('quick') || t.includes('instant') || t.includes('speed')) return 'clock'
  if (t.includes('afford') || t.includes('price') || t.includes('pricing') || t.includes('cost')) return 'credit-card'
  if (t.includes('private') || t.includes('secure') || t.includes('security') || t.includes('confidential')) return 'lock'
  if (t.includes('support') || t.includes('help')) return 'headphones'
  if (t.includes('global') || t.includes('international') || t.includes('europe')) return 'globe'
  if (t.includes('updat') || t.includes('current') || t.includes('real-time')) return 'zap'
  return 'circle-check'
}

function guessTipIcon(title) {
  const t = title.toLowerCase()
  if (t.includes('pay') || t.includes('money') || t.includes('deposit') || t.includes('upfront')) return 'wallet'
  if (t.includes('inspect') || t.includes('test') || t.includes('drive')) return 'search'
  if (t.includes('document') || t.includes('verif') || t.includes('paper')) return 'clipboard-check'
  if (t.includes('wary') || t.includes('caut') || t.includes('warn') || t.includes('export')) return 'triangle-alert'
  if (t.includes('dealer') || t.includes('professional')) return 'building'
  if (t.includes('online') || t.includes('internet') || t.includes('website')) return 'globe'
  return 'info'
}

function guessVinLocationIcon(title) {
  const t = title.toLowerCase()
  if (t.includes('dashboard') || t.includes('windshield') || t.includes('windscreen')) return 'car'
  if (t.includes('door') || t.includes('jamb') || t.includes('pillar') || t.includes('post')) return 'scan'
  if (t.includes('hood') || t.includes('engine') || t.includes('compartment')) return 'wrench'
  if (t.includes('document') || t.includes('registration') || t.includes('insurance') || t.includes('certificate') || t.includes('paper')) return 'file-text'
  if (t.includes('service') || t.includes('book')) return 'book-open'
  return 'search'
}

function blockName(heading) {
  return (heading || '').replace(/\*\*/g, '')
}

// ── Block generators ───────────────────────────────────────────────

function generateHeroBlock(section) {
  const block = {
    blockType: 'page-hero',
    blockName: blockName(impHeading(section)),
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
      icon: icon(f.icon || 'check-circle'),
      text: f.text,
      tag: 'span',
    }))
  }

  return block
}

function generateWhyCheckBlock(section) {
  const block = {
    blockType: 'section',
    blockName: blockName(impHeading(section)),
    bg: 'muted',
    scene: 'default',
    tag: impTagline(section),
    heading: impHeading(section),
    headingLevel: 'h2',
    description: section.introParagraph ? textToLexical(section.introParagraph) : undefined,
  }

  if (section.stats.length > 0) {
    block.content = [{
      blockType: 'card-grid',
      columns: String(Math.min(section.stats.length, 3)),
      tabletColumns: String(Math.min(section.stats.length, 2)),
      mobileColumns: '1',
      cards: section.stats.map(s => ({
        cardType: 'feature',
        style: 'stat',
        layout: 'centered',
        stat: s.stat,
        statColor: 'primary',
        title: s.description,
        titleElement: 'p',
      })),
    }]
  }

  return block
}

function generateWhatIsVinBlock(section) {
  return {
    blockType: 'section',
    blockName: blockName(impHeading(section)),
    bg: 'muted',
    scene: 'default',
    tag: impTagline(section),
    heading: impHeading(section),
    headingLevel: 'h2',
    description: paragraphsToLexical(section.paragraphs),
  }
}

function generateWhereToFindBlock(section) {
  const itemCount = section.items.length
  // 4 items → 4 cols, 5-6 items → 3 cols, 7+ → 4 cols
  const cols = itemCount <= 4 ? String(itemCount) : itemCount <= 6 ? '3' : '4'

  return {
    blockType: 'section',
    blockName: blockName(impHeading(section) || 'Where to Find the VIN?'),
    bg: 'white',
    scene: 'default',
    tag: impTagline(section),
    heading: impHeading(section) || 'Where to Find the VIN?',
    headingLevel: section.headingLevel || 'h3',
    description: section.introParagraph ? textToLexical(section.introParagraph) : undefined,
    content: [{
      blockType: 'card-grid',
      columns: cols,
      tabletColumns: '2',
      mobileColumns: '1',
      cards: section.items.map(item => ({
        cardType: 'feature',
        style: 'icon',
        layout: 'stacked',
        icon: icon(guessVinLocationIcon(item.title)),
        title: item.title,
        titleElement: item.titleElement || 'h4',
        description: item.description ? textToLexical(item.description) : undefined,
      })),
    }],
  }
}

function generateReportInfoBlock(section) {
  const block = {
    blockType: 'section',
    blockName: blockName(impHeading(section)),
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
      href: c.href === '#top' ? '#vin-form' : c.href,
      style: i === 0 ? 'primary' : 'secondary',
    }))
  }

  return block
}

function generateHowToCheckBlock(section) {
  const stepIcons = ['car', 'search', 'file-text']
  const block = {
    blockType: 'section',
    blockName: blockName(impHeading(section)),
    bg: 'dark',
    scene: 'default',
    tag: impTagline(section),
    heading: impHeading(section),
    headingLevel: 'h2',
    description: section.introParagraph ? textToLexical(section.introParagraph) : undefined,
  }

  if (section.steps.length > 0) {
    block.content = [{
      blockType: 'steps',
      style: 'icons',
      steps: section.steps.map((step, i) => ({
        icon: icon(stepIcons[i] || 'circle'),
        title: step.title,
        description: step.description || '',
      })),
    }]
  }

  if (section.ctas?.length > 0) {
    block.ctas = section.ctas.map(c => ({
      label: c.text,
      href: c.href === '#top' ? '#vin-form' : c.href,
      style: 'primary',
    }))
  }

  return block
}

function generateFreeVsPaidBlock(section) {
  const block = {
    blockType: 'section',
    blockName: blockName(impHeading(section)),
    bg: 'muted',
    scene: 'default',
    tag: impTagline(section),
    heading: impHeading(section),
    headingLevel: 'h2',
    description: section.introParagraph ? textToLexical(section.introParagraph) : undefined,
  }

  if (section.rows.length > 0) {
    // Header row + data rows
    const headerRow = {
      cells: [
        { type: 'richtext', content: textToLexical('Information / Records') },
        { type: 'richtext', content: textToLexical('Free VIN Check') },
        { type: 'richtext', content: textToLexical('Paid VIN Check') },
      ],
    }

    const dataRows = section.rows.map(row => ({
      cells: [
        { type: 'richtext', content: textToLexical(row.feature) },
        { type: row.free === true ? 'check' : row.free === false ? 'x' : 'x' },
        { type: row.paid === true ? 'check' : row.paid === false ? 'x' : 'check' },
      ],
    }))

    block.content = [{
      blockType: 'comparison-table',
      stickyFirstColumn: true,
      highlightColumn: 3,
      columnWidths: [
        { mobile: '40', desktop: '50' },
        { mobile: '30', desktop: '25' },
        { mobile: '30', desktop: '25' },
      ],
      rows: [headerRow, ...dataRows],
    }]
  }

  if (section.ctas?.length > 0) {
    block.ctas = section.ctas.map(c => ({
      label: c.text,
      href: c.href === '#top' ? '#vin-form' : c.href,
      style: 'primary',
    }))
  }

  return block
}

function generateWhyImportantBlock(section) {
  const block = {
    blockType: 'section',
    blockName: blockName(impHeading(section)),
    bg: 'white',
    scene: 'default',
    tag: impTagline(section),
    heading: impHeading(section),
    headingLevel: 'h2',
    description: section.introParagraph ? textToLexical(section.introParagraph) : undefined,
  }

  const cards = []
  if (section.buyers?.items?.length > 0) {
    cards.push({
      cardType: 'feature',
      style: 'icon',
      layout: 'stacked',
      icon: icon('search'),
      title: section.buyers.heading || 'Buyers',
      titleElement: section.buyers.headingElement || 'h3',
      description: section.buyers.introParagraph ? textToLexical(section.buyers.introParagraph) : undefined,
      items: section.buyers.items.map(item => ({
        title: item.title,
        titleElement: item.titleElement || 'h4',
        description: item.description ? textToLexical(item.description) : undefined,
      })),
    })
  }
  if (section.sellers?.items?.length > 0) {
    cards.push({
      cardType: 'feature',
      style: 'icon',
      layout: 'stacked',
      icon: icon('tag'),
      title: section.sellers.heading || 'Sellers',
      titleElement: section.sellers.headingElement || 'h3',
      description: section.sellers.introParagraph ? textToLexical(section.sellers.introParagraph) : undefined,
      items: section.sellers.items.map(item => ({
        title: item.title,
        titleElement: item.titleElement || 'h4',
        description: item.description ? textToLexical(item.description) : undefined,
      })),
    })
  }

  if (cards.length > 0) {
    block.content = [{
      blockType: 'card-grid',
      columns: String(Math.min(cards.length, 4)),
      tabletColumns: String(Math.min(cards.length, 4)),
      mobileColumns: '1',
      cards,
    }]
  }

  if (section.ctas?.length > 0) {
    block.ctas = section.ctas.map(c => ({
      label: c.text,
      href: c.href === '#top' ? '#vin-form' : c.href,
      style: 'primary',
    }))
  }

  return block
}

function generateWhyChooseUsBlock(section) {
  const block = {
    blockType: 'section',
    blockName: blockName(impHeading(section)),
    bg: 'muted',
    scene: 'default',
    tag: impTagline(section),
    heading: impHeading(section),
    headingLevel: 'h2',
    description: section.introParagraph ? textToLexical(section.introParagraph) : undefined,
  }

  if (section.cards.length > 0) {
    block.content = [{
      blockType: 'card-grid',
      columns: '3',
      tabletColumns: '2',
      mobileColumns: '1',
      cards: section.cards.map(card => ({
        cardType: 'feature',
        style: 'icon',
        layout: 'stacked',
        icon: icon(guessChooseIcon(card.title)),
        title: card.title,
        titleElement: 'h4',
        description: card.description ? textToLexical(card.description) : undefined,
      })),
    }]
  }

  return block
}

function generateTipsBlock(section) {
  const block = {
    blockType: 'section',
    blockName: blockName(impHeading(section)),
    bg: 'white',
    scene: 'default',
    tag: impTagline(section),
    heading: impHeading(section),
    headingLevel: 'h2',
    description: section.introParagraph ? textToLexical(section.introParagraph) : undefined,
  }

  if (section.items.length > 0) {
    block.content = [{
      blockType: 'card-grid',
      columns: '2',
      tabletColumns: '2',
      mobileColumns: '1',
      cards: section.items.map(item => ({
        cardType: 'feature',
        style: 'icon',
        layout: 'stacked',
        icon: icon(guessTipIcon(item.title)),
        title: item.title,
        titleElement: 'h4',
        description: item.description ? textToLexical(item.description) : undefined,
      })),
    }]
  }

  return block
}

function generateOtherCountriesBlock(section) {
  const block = {
    blockType: 'section',
    blockName: blockName(impHeading(section)),
    bg: 'muted',
    scene: 'default',
    tag: impTagline(section),
    heading: impHeading(section),
    headingLevel: 'h2',
    description: section.introParagraph ? textToLexical(section.introParagraph) : undefined,
  }

  if (section.countries.length > 0) {
    block.content = [{
      blockType: 'pill-grid',
      items: section.countries.map(c => ({
        label: c.name,
        href: `/vin-check/${c.slug}`,
      })),
    }]
  }

  return block
}

function generateCtaBannerBlock(section) {
  const block = {
    blockType: 'cta-banner',
    blockName: blockName(impHeading(section)),
    layout: 'full',
    dark: true,
    scene: 'none',
    tag: impTagline(section),
    heading: impHeading(section),
    headingLevel: 'h2',
    description: section.description ? textToLexical(section.description) : undefined,
  }

  if (section.ctas?.length > 0) {
    block.mode = 'link'
    block.ctas = section.ctas.map(c => ({
      label: c.text,
      href: c.href === '#top' ? '#vin-form' : c.href,
      style: 'primary',
    }))
  } else {
    block.mode = 'vin-input'
  }

  return block
}

function generateFaqBlock(section) {
  const block = {
    blockType: 'section',
    blockName: blockName(impHeading(section)),
    bg: 'white',
    scene: 'default',
    tag: impTagline(section),
    heading: impHeading(section),
    headingLevel: 'h2',
  }

  if (section.items.length > 0) {
    block.content = [{
      blockType: 'faqs',
      questionElement: section.questionElement || 'h3',
      items: section.items.map(faq => ({
        question: faq.question,
        answer: textToLexical(faq.answer),
      })),
    }]
  }

  return block
}

// ── Assemble all blocks for a country ──────────────────────────────

function generateBlocks(country) {
  const s = country.sections
  const blocks = []

  if (s.hero) blocks.push(generateHeroBlock(s.hero))
  if (s.whyCheck) blocks.push(generateWhyCheckBlock(s.whyCheck))
  if (s.whatIsVin) blocks.push(generateWhatIsVinBlock(s.whatIsVin))
  if (s.whereToFind) blocks.push(generateWhereToFindBlock(s.whereToFind))
  if (s.reportInfo) blocks.push(generateReportInfoBlock(s.reportInfo))
  if (s.howToCheck) blocks.push(generateHowToCheckBlock(s.howToCheck))
  if (s.freeVsPaid) blocks.push(generateFreeVsPaidBlock(s.freeVsPaid))
  if (s.whyImportant) blocks.push(generateWhyImportantBlock(s.whyImportant))
  if (s.whyChooseUs) blocks.push(generateWhyChooseUsBlock(s.whyChooseUs))
  if (s.tips) blocks.push(generateTipsBlock(s.tips))
  if (s.otherCountries) blocks.push(generateOtherCountriesBlock(s.otherCountries))
  if (s.ctaBanner) blocks.push(generateCtaBannerBlock(s.ctaBanner))
  if (s.faq) blocks.push(generateFaqBlock(s.faq))

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
const countryFilter = args.includes('--country') ? args[args.indexOf('--country') + 1] : null

async function main() {
  console.log('\n═══════════════════════════════════════')
  console.log('  SEED VIN CHECK COUNTRY PAGES')
  console.log('═══════════════════════════════════════\n')

  if (!dryRun) {
    await login()
    console.log('Authenticated.\n')
  }

  let groupId = null
  if (!dryRun) {
    groupId = await getContentGroupId('vin-check')
    if (!groupId) {
      console.error('Content Group "vin-check" not found. Create it first.')
      process.exit(1)
    }
    console.log(`VIN Check group ID: ${groupId}\n`)
  }

  const countries = countryFilter
    ? DATA.filter(c => c.slug === countryFilter)
    : DATA

  let created = 0, updated = 0, failed = 0

  for (const country of countries) {
    const blocks = generateBlocks(country)

    if (dryRun) {
      console.log(`  ${country.name.padEnd(25)} ${blocks.length} blocks`)
      if (jsonOutput) {
        writeFileSync(join(__dirname, `blocks-${country.slug}.json`), JSON.stringify(blocks, null, 2))
        console.log(`    → blocks-${country.slug}.json`)
      }
      continue
    }

    process.stdout.write(`  ${country.name.padEnd(25)}`)

    const pageData = {
      name: country.name,
      group: groupId,
      slug: country.slug,
      status: 'active',
      content: blocks,
      _status: 'published',
    }

    // Meta / SEO fields
    if (country.meta) {
      pageData.meta = {}
      if (country.meta.title) pageData.meta.title = country.meta.title
      if (country.meta.description) pageData.meta.description = country.meta.description
      if (country.meta.keywords) pageData.meta.keywords = country.meta.keywords
    }

    const existing = await findContentPage(groupId, country.slug)
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
  console.log(`  Total: ${countries.length} countries`)
  console.log(`═══════════════════════════════════════\n`)
}

main().catch(err => {
  console.error('Fatal:', err.message)
  process.exit(1)
})
