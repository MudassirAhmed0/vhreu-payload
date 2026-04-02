#!/usr/bin/env node
/**
 * Stage 2: AI-powered content improvisation for Window Sticker brand pages.
 *
 * Reads scraped-window-stickers.json and uses Claude CLI to add:
 *   - Taglines for hero + every content section
 *   - Heading **highlights** for gradient text
 *   - Features (icon badges) for hero only
 *
 * NEVER rewrites existing descriptions or text — only adds new content.
 *
 * Usage:
 *   node improvise-window-stickers.mjs                      # all brands
 *   node improvise-window-stickers.mjs --brand ford         # single brand
 *   node improvise-window-stickers.mjs --report             # print diff
 *   node improvise-window-stickers.mjs --dry-run            # preview without AI
 */

import { readFileSync, writeFileSync } from 'fs'
import { execFileSync } from 'child_process'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SCRAPED = JSON.parse(readFileSync(join(__dirname, 'scraped-window-stickers.json'), 'utf8'))

// Load existing improvised data for incremental updates
let EXISTING_IMPROVISED = {}
try {
  const existing = JSON.parse(readFileSync(join(__dirname, 'improvised-window-stickers.json'), 'utf8'))
  for (const b of existing) {
    if (b._improvisedAt) EXISTING_IMPROVISED[b.slug] = b
  }
} catch { /* no existing file — fresh run */ }

// ── Claude CLI wrapper ─────────────────────────────────────────────

function callClaude(prompt) {
  try {
    const result = execFileSync('claude', ['-p', '--output-format', 'text', prompt], {
      encoding: 'utf8',
      maxBuffer: 1024 * 1024,
      timeout: 120_000,
    })
    return result.trim()
  } catch (err) {
    console.error('Claude CLI error:', err.message)
    return null
  }
}

function callClaudeJSON(prompt) {
  const raw = callClaude(prompt)
  if (!raw) return null
  const jsonMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, raw]
  const jsonStr = jsonMatch[1].trim()
  try {
    return JSON.parse(jsonStr)
  } catch {
    console.error('Failed to parse JSON, raw output:')
    console.error(raw.slice(0, 500))
    return null
  }
}

// ── AI prompt ──────────────────────────────────────────────────────

const SYSTEM_CONTEXT = `You are a senior copywriter improvising content for a European vehicle history service website (vehiclehistory.eu) being migrated to a new CMS.

BRAND CONTEXT:
- European vehicle history / Window Sticker lookup service
- Colors: navy (#1A365C) + gold (#FFCC00) — premium, trustworthy
- Audience: European used car buyers, dealerships, importers, enthusiasts
- Tone: authoritative but approachable, not salesy
- Window stickers = Monroney labels / original factory build sheets

YOUR TASKS per section:
1. TAGLINE: Write a short (3-6 word) punchy tagline. Renders as small uppercase label above the heading. Must be relevant to the section content, NOT a repeat of the heading.
2. HEADING HIGHLIGHT: Pick the most impactful 1-3 word phrase in each heading to wrap in **double asterisks** for gold gradient highlight. Only ONE phrase per heading.
3. FEATURES (hero only): Suggest 3-4 feature badges with Lucide icon name + short text.

CRITICAL RULES:
- NEVER rewrite, edit, or modify existing descriptions or text. Return description: null always.
- You are ONLY allowed to ADD new content (taglines, **highlights**, features).
- Never make up facts or statistics.
- Taglines must NOT repeat the heading text.
- **Highlight** the phrase with the most emotional or informational weight.
- Return valid JSON only, no commentary.`

function buildBrandPrompt(brand) {
  const s = brand.sections
  const sections = []

  if (s.hero) sections.push({ key: 'hero', heading: s.hero.heading, isHero: true })
  if (s.whatIs) sections.push({ key: 'whatIs', heading: s.whatIs.heading })
  if (s.whatsOn) sections.push({ key: 'whatsOn', heading: s.whatsOn.heading })
  if (s.whyNeed) sections.push({ key: 'whyNeed', heading: s.whyNeed.heading })
  if (s.howToGet) sections.push({ key: 'howToGet', heading: s.howToGet.heading })
  if (s.whereVin) sections.push({ key: 'whereVin', heading: s.whereVin.heading })
  if (s.whyUse) sections.push({ key: 'whyUse', heading: s.whyUse.heading })
  if (s.ctaBanner) sections.push({ key: 'ctaBanner', heading: s.ctaBanner.heading })
  if (s.allManufacturers) sections.push({ key: 'allManufacturers', heading: s.allManufacturers.heading })
  if (s.faq) sections.push({ key: 'faq', heading: s.faq.heading })

  return `${SYSTEM_CONTEXT}

BRAND: ${brand.name} (Window Sticker page)
URL: ${brand.url}

SECTIONS:
${JSON.stringify(sections, null, 2)}

Return a JSON object with one key per section. Each value must have:
{
  "tagline": "<3-6 word tagline>",
  "tagLevel": "span",
  "heading": "<heading with **highlight**>",
  "features": [{"icon": "lucide-name", "text": "short label"}] (ONLY for hero, null for other sections),
  "description": null
}

Example response format:
{
  "hero": {
    "tagline": "Original Factory Build Details",
    "tagLevel": "span",
    "heading": "Find Your Ford's **Original Factory Window Sticker**",
    "features": [
      {"icon": "file-text", "text": "Factory Specs"},
      {"icon": "tag", "text": "Original MSRP"},
      {"icon": "list", "text": "Full Equipment List"},
      {"icon": "zap", "text": "Instant Results"}
    ],
    "description": null
  }
}

IMPORTANT:
- Include ALL ${sections.length} sections in your response.
- For headings, only wrap ONE phrase in **markers**, not the entire heading.
- Features array ONLY for hero section. All others must have features: null.
- Return ONLY the JSON object, no explanation.`
}

// ── Apply AI results ───────────────────────────────────────────────

function applyAIResults(brand, aiResults) {
  const improved = JSON.parse(JSON.stringify(brand))
  const changes = []

  for (const [key, result] of Object.entries(aiResults)) {
    if (!improved.sections[key]) continue
    const section = improved.sections[key]
    section._improvised = {}
    const diffs = []

    if (result.tagline) {
      section._improvised.tagline = result.tagline
      section._improvised.tagLevel = result.tagLevel || 'span'
      diffs.push({ field: 'tagline', value: result.tagline })
    }

    if (result.heading && result.heading.includes('**')) {
      section._improvised.heading = result.heading
      diffs.push({ field: 'heading', value: result.heading })
    }

    if (result.features && result.features.length > 0 && key === 'hero') {
      section._improvised.features = result.features
      diffs.push({ field: 'features', value: `${result.features.length} badges` })
    }

    if (diffs.length > 0) {
      changes.push({ section: key, diffs })
    }
  }

  improved._changes = changes
  improved._improvisedAt = new Date().toISOString()
  return improved
}

// ── Report ─────────────────────────────────────────────────────────

function generateReport(results) {
  const lines = ['# Window Sticker Improvisation Report', `Generated: ${new Date().toISOString()}`, '']

  for (const brand of results) {
    if (!brand._changes || brand._changes.length === 0) continue
    lines.push(`## ${brand.name} (${brand.slug})`)
    for (const change of brand._changes) {
      lines.push(`  **${change.section}:**`)
      for (const diff of change.diffs) {
        lines.push(`    - ${diff.field}: ${diff.value}`)
      }
    }
    lines.push('')
  }

  lines.push(`---`)
  lines.push(`Total: ${results.length} brands, ${results.reduce((s, b) => s + (b._changes?.length || 0), 0)} sections improvised`)
  return lines.join('\n')
}

// ── CLI ────────────────────────────────────────────────────────────

const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const reportFlag = args.includes('--report')
const brandFilter = args.includes('--brand') ? args[args.indexOf('--brand') + 1] : null
const outFile = join(__dirname, 'improvised-window-stickers.json')

async function main() {
  console.log('\n═══════════════════════════════════════')
  console.log('  IMPROVISE WINDOW STICKER BRAND PAGES')
  console.log('═══════════════════════════════════════\n')

  const results = []
  let improvised = 0
  let failed = 0

  for (const brand of SCRAPED) {
    if (brandFilter && brand.slug !== brandFilter) {
      if (EXISTING_IMPROVISED[brand.slug]) {
        results.push(EXISTING_IMPROVISED[brand.slug])
      } else {
        brand._changes = brand._changes || []
        brand._improvisedAt = brand._improvisedAt || null
        results.push(brand)
      }
      continue
    }

    process.stdout.write(`  ${brand.name.padEnd(25)}`)

    if (dryRun) {
      console.log(`${Object.keys(brand.sections).length} sections (dry run)`)
      results.push(brand)
      continue
    }

    const prompt = buildBrandPrompt(brand)
    const aiResults = callClaudeJSON(prompt)

    if (!aiResults || typeof aiResults !== 'object') {
      console.log('FAILED — passing through unchanged')
      brand._changes = []
      results.push(brand)
      failed++
      continue
    }

    const improved = applyAIResults(brand, aiResults)
    const changeCount = improved._changes.reduce((s, c) => s + c.diffs.length, 0)
    console.log(`${changeCount} fields improvised`)
    results.push(improved)
    improvised++
  }

  writeFileSync(outFile, JSON.stringify(results, null, 2))
  console.log(`\n═══════════════════════════════════════`)
  console.log(`  Improvised: ${improvised}  Failed: ${failed}`)
  console.log(`  Saved to ${outFile}`)
  console.log(`═══════════════════════════════════════\n`)

  if (reportFlag) {
    const report = generateReport(results)
    console.log(report)
  }
}

main().catch(err => {
  console.error('Fatal:', err.message)
  process.exit(1)
})
