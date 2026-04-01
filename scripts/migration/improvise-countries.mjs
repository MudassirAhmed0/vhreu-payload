#!/usr/bin/env node
/**
 * Stage 2: AI-powered content improvisation for VIN Check country pages.
 *
 * Reads scraped-countries.json and uses Claude CLI to add:
 *   - Taglines for hero + every content section
 *   - Heading **highlights** for gradient text
 *   - Features (icon badges) for hero only
 *
 * NEVER rewrites existing descriptions or text — only adds new content.
 *
 * Usage:
 *   node improvise-countries.mjs                         # all countries
 *   node improvise-countries.mjs --country germany       # single country
 *   node improvise-countries.mjs --report                # print diff
 *   node improvise-countries.mjs --dry-run               # preview without AI
 */

import { readFileSync, writeFileSync } from 'fs'
import { execFileSync } from 'child_process'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SCRAPED = JSON.parse(readFileSync(join(__dirname, 'scraped-countries.json'), 'utf8'))

// Load existing improvised data for incremental updates
let EXISTING_IMPROVISED = {}
try {
  const existing = JSON.parse(readFileSync(join(__dirname, 'improvised-countries.json'), 'utf8'))
  for (const c of existing) {
    if (c._improvisedAt) EXISTING_IMPROVISED[c.slug] = c
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

const SYSTEM_CONTEXT = `You are a senior copywriter improvising content for a European VIN check service website (vehiclehistory.eu) being migrated to a new CMS.

BRAND CONTEXT:
- European vehicle history / VIN check service
- Colors: navy (#1A365C) + gold (#FFCC00) — premium, trustworthy
- Audience: European used car buyers, dealerships, importers
- Tone: authoritative but approachable, not salesy

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

function buildCountryPrompt(country) {
  const s = country.sections
  const sections = []

  if (s.hero) sections.push({ key: 'hero', heading: s.hero.heading, isHero: true })
  if (s.whyCheck) sections.push({ key: 'whyCheck', heading: s.whyCheck.heading })
  if (s.whatIsVin) sections.push({ key: 'whatIsVin', heading: s.whatIsVin.heading })
  if (s.whereToFind) sections.push({ key: 'whereToFind', heading: s.whereToFind.heading })
  if (s.reportInfo) sections.push({ key: 'reportInfo', heading: s.reportInfo.heading })
  if (s.howToCheck) sections.push({ key: 'howToCheck', heading: s.howToCheck.heading })
  if (s.freeVsPaid) sections.push({ key: 'freeVsPaid', heading: s.freeVsPaid.heading })
  if (s.whyImportant) sections.push({ key: 'whyImportant', heading: s.whyImportant.heading })
  if (s.whyChooseUs) sections.push({ key: 'whyChooseUs', heading: s.whyChooseUs.heading })
  if (s.tips) sections.push({ key: 'tips', heading: s.tips.heading })
  if (s.otherCountries) sections.push({ key: 'otherCountries', heading: s.otherCountries.heading })
  if (s.ctaBanner) sections.push({ key: 'ctaBanner', heading: s.ctaBanner.heading })
  if (s.faq) sections.push({ key: 'faq', heading: s.faq.heading })

  return `${SYSTEM_CONTEXT}

COUNTRY: ${country.name} (VIN Check page)
URL: ${country.url}

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
    "tagline": "Your Car's Full Story",
    "tagLevel": "span",
    "heading": "Examine a Vehicle's Past Through a **Germany VIN Check**",
    "features": [
      {"icon": "shield-check", "text": "Verified Data Sources"},
      {"icon": "clock", "text": "Results in 30 Seconds"},
      {"icon": "file-text", "text": "Comprehensive Reports"}
    ],
    "description": null
  },
  "whyCheck": {
    "tagline": "The Numbers Don't Lie",
    "tagLevel": "span",
    "heading": "Why You Should **Decode the VIN** in Germany?",
    "features": null,
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

function applyAIResults(country, aiResults) {
  const improved = JSON.parse(JSON.stringify(country))
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
  const lines = ['# Country Page Improvisation Report', `Generated: ${new Date().toISOString()}`, '']

  for (const country of results) {
    if (!country._changes || country._changes.length === 0) continue
    lines.push(`## ${country.name} (${country.slug})`)
    for (const change of country._changes) {
      lines.push(`  **${change.section}:**`)
      for (const diff of change.diffs) {
        lines.push(`    - ${diff.field}: ${diff.value}`)
      }
    }
    lines.push('')
  }

  lines.push(`---`)
  lines.push(`Total: ${results.length} countries, ${results.reduce((s, c) => s + (c._changes?.length || 0), 0)} sections improvised`)
  return lines.join('\n')
}

// ── CLI ────────────────────────────────────────────────────────────

const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const reportFlag = args.includes('--report')
const reportOutIdx = args.indexOf('--report-out')
const reportFile = reportOutIdx !== -1 ? args[reportOutIdx + 1] : null
const countryFilter = args.includes('--country') ? args[args.indexOf('--country') + 1] : null
const outFile = join(__dirname, 'improvised-countries.json')

async function main() {
  console.log('\n═══════════════════════════════════════')
  console.log('  IMPROVISE VIN CHECK COUNTRY PAGES')
  console.log('═══════════════════════════════════════\n')

  const results = []
  let improvised = 0
  let failed = 0

  for (const country of SCRAPED) {
    if (countryFilter && country.slug !== countryFilter) {
      // Use existing improvised data if available, otherwise pass through scraped
      if (EXISTING_IMPROVISED[country.slug]) {
        results.push(EXISTING_IMPROVISED[country.slug])
      } else {
        country._changes = country._changes || []
        country._improvisedAt = country._improvisedAt || null
        results.push(country)
      }
      continue
    }

    process.stdout.write(`  ${country.name.padEnd(25)}`)

    if (dryRun) {
      console.log(`${Object.keys(country.sections).length} sections (dry run)`)
      results.push(country)
      continue
    }

    const prompt = buildCountryPrompt(country)
    const aiResults = callClaudeJSON(prompt)

    if (!aiResults || typeof aiResults !== 'object') {
      console.log('FAILED — passing through unchanged')
      country._changes = []
      results.push(country)
      failed++
      continue
    }

    const improved = applyAIResults(country, aiResults)
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

  if (reportFlag || reportFile) {
    const report = generateReport(results)
    if (reportFile) {
      writeFileSync(reportFile, report)
      console.log(`Report saved to ${reportFile}`)
    } else {
      console.log(report)
    }
  }
}

main().catch(err => {
  console.error('Fatal:', err.message)
  process.exit(1)
})
