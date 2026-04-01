#!/usr/bin/env node
/**
 * Stage 2: AI-powered content improvisation for VIN Decoder brand pages.
 *
 * Reads scraped-brands.json and uses Claude CLI to add:
 *   - Taglines for hero + every content section
 *   - Heading **highlights** for gradient text
 *   - Features (icon badges) for hero only
 *
 * NEVER rewrites existing descriptions or text — only adds new content.
 *
 * Usage:
 *   node improvise-brands.mjs                         # all brands
 *   node improvise-brands.mjs --brand audi            # single brand
 *   node improvise-brands.mjs --report                # print diff
 *   node improvise-brands.mjs --dry-run               # preview without AI
 */

import { readFileSync, writeFileSync } from 'fs'
import { execFileSync } from 'child_process'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SCRAPED = JSON.parse(readFileSync(join(__dirname, 'scraped-brands.json'), 'utf8'))

// Load existing improvised data for incremental updates
let EXISTING_IMPROVISED = {}
try {
  const existing = JSON.parse(readFileSync(join(__dirname, 'improvised-brands.json'), 'utf8'))
  for (const b of existing) {
    if (b._improvisedAt) EXISTING_IMPROVISED[b.slug] = b
  }
} catch { /* no existing file — fresh run */ }

// ── Claude CLI wrapper ────────────────────────────────────────────

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

// ── AI prompt ─────────────────────────────────────────────────────

const SYSTEM_CONTEXT = `You are a senior copywriter improvising content for a European VIN decoder service website (vehiclehistory.eu) being migrated to a new CMS.

BRAND CONTEXT:
- European vehicle history / VIN decoder service
- Colors: navy (#1A365C) + gold (#FFCC00) — premium, trustworthy
- Audience: European used car buyers, dealerships, importers
- Tone: authoritative but approachable, not salesy
- These are BRAND-specific VIN decoder pages (e.g. Audi VIN Decoder, BMW VIN Decoder)

YOUR TASKS per section:
1. TAGLINE: Write a short (3-6 word) punchy tagline. Renders as small uppercase label above the heading. Must be relevant to the section content, NOT a repeat of the heading.
2. HEADING HIGHLIGHT: Pick the most impactful 1-3 word phrase in each heading to wrap in **double asterisks** for gold gradient highlight. Only ONE phrase per heading.

CRITICAL RULES:
- NEVER rewrite, edit, or modify existing descriptions or text. Return description: null always.
- NEVER invent features/badges — those are scraped from the live site.
- You are ONLY allowed to ADD taglines and heading **highlights**.
- Never make up facts or statistics.
- Taglines must NOT repeat the heading text.
- **Highlight** the phrase with the most emotional or informational weight.
- Return valid JSON only, no commentary.`

function buildBrandPrompt(brand) {
  const s = brand.sections
  const sections = []

  if (s.hero) sections.push({ key: 'hero', heading: s.hero.heading, isHero: true })
  if (s.whatIsVin) sections.push({ key: 'whatIsVin', heading: s.whatIsVin.heading })

  return `${SYSTEM_CONTEXT}

BRAND: ${brand.name} (VIN Decoder page)
URL: ${brand.url}

SECTIONS:
${JSON.stringify(sections, null, 2)}

Return a JSON object with one key per section. Each value must have:
{
  "tagline": "<3-6 word tagline>",
  "tagLevel": "span",
  "heading": "<heading with **highlight**>"
}

Example response format:
{
  "hero": {
    "tagline": "Decode Any Audi Instantly",
    "tagLevel": "span",
    "heading": "Decode Your Audi VIN with Our **Instant Lookup Tool**"
  }
}

IMPORTANT:
- Include ALL ${sections.length} sections in your response.
- For headings, only wrap ONE phrase in **markers**, not the entire heading.
- Return ONLY the JSON object, no explanation.`
}

// ── Apply AI results ──────────────────────────────────────────────

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

    if (diffs.length > 0) {
      changes.push({ section: key, diffs })
    }
  }

  improved._changes = changes
  improved._improvisedAt = new Date().toISOString()
  return improved
}

// ── Report ────────────────────────────────────────────────────────

function generateReport(results) {
  const lines = ['# Brand Page Improvisation Report', `Generated: ${new Date().toISOString()}`, '']

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

// ── CLI ───────────────────────────────────────────────────────────

const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const reportFlag = args.includes('--report')
const brandFilter = args.includes('--brand') ? args[args.indexOf('--brand') + 1] : null
const outFile = join(__dirname, 'improvised-brands.json')

async function main() {
  console.log('\n═══════════════════════════════════════')
  console.log('  IMPROVISE VIN DECODER BRAND PAGES')
  console.log('═══════════════════════════════════════\n')

  const results = []
  let improvised = 0
  let failed = 0

  for (const brand of SCRAPED) {
    if (brandFilter && brand.slug !== brandFilter) {
      // Use existing improvised data if available, otherwise pass through scraped
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
