#!/usr/bin/env node
/**
 * Stage 2: AI-powered content improvisation using Claude Code CLI.
 *
 * Reads scraped-content.json, sends each page's sections to Claude
 * for creative improvements:
 *   - Generates killer taglines for heroes
 *   - Picks the best phrase in each heading for **marker** gradient highlight
 *   - Tightens descriptions for clarity and impact
 *   - Suggests features/bullets where appropriate
 *
 * Uses the `claude` CLI (Claude Code) — no API key needed.
 *
 * Usage:
 *   node scripts/improvise-content.mjs                          # all pages
 *   node scripts/improvise-content.mjs --page /contact-us       # one page
 *   node scripts/improvise-content.mjs --report                 # print diff
 *   node scripts/improvise-content.mjs --report-out report.md   # save diff
 */

import { readFileSync, writeFileSync } from 'fs'
import { execFileSync } from 'child_process'

const SCRAPED = JSON.parse(readFileSync('scraped-content.json', 'utf8'))

// ── Claude CLI wrapper ──────────────────────────────────────────────

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
  // Extract JSON from response (may be wrapped in ```json ... ```)
  const jsonMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, raw]
  const jsonStr = jsonMatch[1].trim()
  try {
    return JSON.parse(jsonStr)
  } catch {
    console.error('Failed to parse Claude JSON response, raw output:')
    console.error(raw.slice(0, 500))
    return null
  }
}

// ── System prompt for improvisation ─────────────────────────────────

const SYSTEM_CONTEXT = `You are a senior copywriter improvising content for a European VIN check service website (vehiclehistory.eu) being migrated to a new CMS.

BRAND CONTEXT:
- European vehicle history / VIN check service
- Colors: navy (#1A365C) + gold (#FFCC00) — premium, trustworthy
- Audience: European used car buyers, dealerships, importers
- Tone: authoritative but approachable, not salesy

YOUR TASKS per section:
1. TAGLINE: Write a short (3-6 word) tagline for EVERY section that doesn't have one — heroes, FAQ sections, content sections, all of them. Must be punchy, not generic, and relevant to the section's content. The tagline renders as a small uppercase label above the heading.
2. HEADING HIGHLIGHT: Pick the most impactful 1-3 word phrase in each heading to wrap in **double asterisks** for gradient highlight. Choose the phrase that carries the most emotional or informational weight. Only one phrase per heading.
3. FEATURES: For hero sections only, suggest 3-4 feature badges (icon name from Lucide + short text). Only if the section doesn't already have clear trust indicators.

CRITICAL RULES:
- NEVER rewrite, edit, or "tighten" existing descriptions or text. Always return description: null.
- You are ONLY allowed to ADD new content (taglines, **highlights**, features) — never change what already exists.
- Never make up facts or statistics
- Taglines should NOT repeat the heading
- **Highlight** the phrase that would look best as a gold gradient on dark background
- Return valid JSON only, no commentary`

// ── Build prompt for a page ─────────────────────────────────────────

function buildPagePrompt(page) {
  const pagePath = new URL(page.url).pathname.replace(/\/$/, '') || '/'

  const sectionsData = page.sections.map((s, i) => ({
    index: i + 1,
    headings: s.headings,
    paragraphs: s.paragraphs.slice(0, 3), // first 3 paragraphs max
    links: s.links.slice(0, 5).map(l => ({ text: l.text, href: l.href })),
    hasImages: s.images.length > 0,
    hasForms: s.forms.length > 0,
    isHero: i === 0,
  }))

  return `${SYSTEM_CONTEXT}

PAGE: ${pagePath} ("${page.pageTitle}")
SECTIONS:
${JSON.stringify(sectionsData, null, 2)}

Return a JSON array with one object per section. Each object must have:
{
  "section": <number>,
  "label": "<short name for this section>",
  "tagline": "<tagline text>" or null (for ANY section — heroes, FAQ, content sections, etc.),
  "tagLevel": "span" or "h2" (only if tagline is set — use "h2" only if tagline is itself a heading from the original page, otherwise always "span"),
  "heading": "<heading with **highlight**>" or null (if no heading to improve),
  "headingOriginal": "<original heading text>",
  "description": null (ALWAYS null — never rewrite existing content),
  "secondaryHeading": "<text>" or null,
  "secondaryHeadingLevel": "h3" or null,
  "bullets": ["text1", "text2"] or null,
  "features": [{"icon": "lucide-name", "text": "label", "href": "url-or-null"}] or null
}

IMPORTANT:
- For the contact-us page hero: "Got any Questions?" is from the original page as h2 — use it as tagline with tagLevel "h2". "We'll be happy to assist you!" is the secondary heading. Include real links for features (livechat, phone tel:, email mailto:) extracted from the links array.
- For headings, only wrap ONE phrase in **markers**, not the entire heading.
- Return ONLY the JSON array, no explanation.`
}

// ── Apply AI results to page data ───────────────────────────────────

function applyAIResults(page, aiResults) {
  const improved = JSON.parse(JSON.stringify(page))
  const changes = []

  for (const result of aiResults) {
    const sIdx = result.section - 1
    if (sIdx >= improved.sections.length) continue
    const section = improved.sections[sIdx]
    section._improvised = section._improvised || {}

    const sectionChanges = {
      section: result.section,
      label: result.label || `Section ${result.section}`,
      diffs: [],
    }

    // Tagline
    if (result.tagline) {
      sectionChanges.diffs.push({
        field: 'tagline',
        original: '(none)',
        improved: result.tagline,
        reason: 'AI-generated tagline',
      })
      section._improvised.tagline = result.tagline
      section._improvised.tagLevel = result.tagLevel || 'span'
    }

    // Secondary heading
    if (result.secondaryHeading) {
      sectionChanges.diffs.push({
        field: 'secondaryHeading',
        original: '(none)',
        improved: result.secondaryHeading,
        reason: 'AI-identified secondary heading from original page',
      })
      section._improvised.secondaryHeading = result.secondaryHeading
      section._improvised.secondaryHeadingLevel = result.secondaryHeadingLevel || 'h3'
    }

    // Heading highlight
    if (result.heading && result.heading.includes('**')) {
      const original = result.headingOriginal || section.headings[0]?.text || ''
      sectionChanges.diffs.push({
        field: `heading`,
        original,
        improved: result.heading,
        reason: 'AI-selected **marker** highlight for gradient text',
      })
      section._improvised.heading = result.heading
      section._improvised.headingOriginal = original
    }

    // Description
    if (result.description) {
      const original = result.descriptionOriginal || section.paragraphs[0] || '(none)'
      sectionChanges.diffs.push({
        field: 'description',
        original,
        improved: result.description,
        reason: 'AI-tightened copy',
      })
      section._improvised.description = result.description
      section._improvised.descriptionOriginal = original
    }

    // Bullets
    if (result.bullets && result.bullets.length > 0) {
      sectionChanges.diffs.push({
        field: 'bullets',
        original: '(none)',
        improved: result.bullets.join(' | '),
        reason: 'AI-suggested trust bullets',
      })
      section._improvised.bullets = result.bullets
    }

    // Features
    if (result.features && result.features.length > 0) {
      sectionChanges.diffs.push({
        field: 'features',
        original: '(none)',
        improved: result.features.map(f => `${f.icon}: ${f.text}${f.href ? ' → ' + f.href : ''}`).join(' | '),
        reason: 'AI-suggested feature highlights',
      })
      section._improvised.features = result.features
    }

    if (sectionChanges.diffs.length > 0) {
      changes.push(sectionChanges)
    }
  }

  improved._changes = changes
  improved._improvisedAt = new Date().toISOString()
  return improved
}

// ── Report generator ────────────────────────────────────────────────

function generateReport(allResults) {
  const lines = []
  lines.push('# Content Migration Report')
  lines.push(`Generated: ${new Date().toISOString()}`)
  lines.push('')
  lines.push('## Pipeline: Scrape → Improvise (AI) → Migrate')
  lines.push('')

  let totalChanges = 0

  for (const result of allResults) {
    const pagePath = new URL(result.url).pathname || '/'
    lines.push(`---`)
    lines.push(`## Page: \`${pagePath}\``)
    lines.push(`- Title: ${result.pageTitle}`)
    lines.push(`- Sections: ${result.totalSections}`)
    lines.push(`- Changes: ${result._changes.length} sections modified`)
    lines.push('')

    if (result._changes.length === 0) {
      lines.push('*No improvisation needed — content used as scraped.*')
      lines.push('')
      continue
    }

    for (const change of result._changes) {
      lines.push(`### Section ${change.section}: ${change.label}`)
      lines.push('')
      lines.push('| Field | Original (Scraped) | Improvised (AI) | Reason |')
      lines.push('|-------|-------------------|-----------------|--------|')

      for (const diff of change.diffs) {
        const orig = diff.original.length > 60 ? diff.original.slice(0, 57) + '...' : diff.original
        const impr = diff.improved.length > 60 ? diff.improved.slice(0, 57) + '...' : diff.improved
        lines.push(`| ${diff.field} | ${orig} | ${impr} | ${diff.reason} |`)
        totalChanges++
      }
      lines.push('')
    }
  }

  lines.push('---')
  lines.push(`## Summary`)
  lines.push(`- Pages processed: ${allResults.length}`)
  lines.push(`- Total sections: ${allResults.reduce((s, r) => s + r.totalSections, 0)}`)
  lines.push(`- Fields improvised: ${totalChanges}`)
  lines.push('')

  return lines.join('\n')
}

// ── CLI ─────────────────────────────────────────────────────────────

const args = process.argv.slice(2)
const outIdx = args.indexOf('--out')
const outFile = outIdx !== -1 ? args[outIdx + 1] : 'improvised-content.json'
const reportFlag = args.includes('--report')
const reportOutIdx = args.indexOf('--report-out')
const reportFile = reportOutIdx !== -1 ? args[reportOutIdx + 1] : null
const pageFilterIdx = args.indexOf('--page')
const pageFilter = pageFilterIdx !== -1 ? args[pageFilterIdx + 1] : null

const results = []

for (const page of SCRAPED) {
  const pagePath = new URL(page.url).pathname.replace(/\/$/, '') || '/'

  if (pageFilter && pagePath !== pageFilter) {
    // Pass through unfiltered pages unchanged
    page._changes = page._changes || []
    page._improvisedAt = page._improvisedAt || new Date().toISOString()
    results.push(page)
    continue
  }

  process.stderr.write(`\nImprovising ${pagePath} (${page.totalSections} sections)...`)

  const prompt = buildPagePrompt(page)
  const aiResults = callClaudeJSON(prompt)

  if (!aiResults || !Array.isArray(aiResults)) {
    console.error(` FAILED — passing through unchanged`)
    page._changes = []
    page._improvisedAt = new Date().toISOString()
    results.push(page)
    continue
  }

  const improved = applyAIResults(page, aiResults)
  const changeCount = improved._changes.reduce((s, c) => s + c.diffs.length, 0)
  process.stderr.write(` ${changeCount} fields improvised\n`)
  results.push(improved)
}

// Save
writeFileSync(outFile, JSON.stringify(results, null, 2))
console.log(`\nSaved improvised content to ${outFile}`)

// Report
if (reportFlag || reportFile) {
  const report = generateReport(results)
  if (reportFile) {
    writeFileSync(reportFile, report)
    console.log(`Saved migration report to ${reportFile}`)
  } else {
    console.log('\n' + report)
  }
}
