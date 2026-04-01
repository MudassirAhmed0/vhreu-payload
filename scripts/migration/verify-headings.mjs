#!/usr/bin/env node
/**
 * Simple heading diff — live vs localhost.
 * Shows exact headings on each side, what matches, what's missing, what's extra.
 *
 * Usage:
 *   node verify-headings.mjs --country germany     # single country
 *   node verify-headings.mjs                        # all countries
 *   node verify-headings.mjs --report               # save markdown
 */

import * as cheerio from 'cheerio'
import { writeFileSync, readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const LIVE_BASE = 'https://vehiclehistory.eu'
const args = process.argv.slice(2)
const LOCAL_BASE = args.includes('--local') ? args[args.indexOf('--local') + 1] : 'http://localhost:3000'
const countryFilter = args.includes('--country') ? args[args.indexOf('--country') + 1] : null
const reportFlag = args.includes('--report')

let COUNTRIES
try {
  COUNTRIES = JSON.parse(readFileSync(join(__dirname, 'scraped-countries.json'), 'utf8')).map(c => ({ name: c.name, slug: c.slug }))
} catch { COUNTRIES = [] }

function clean(s) { return (s || '').replace(/\s+/g, ' ').trim() }
function norm(s) { return s.toLowerCase().replace(/[\u2018\u2019\u2032']/g, "'").replace(/[\u201C\u201D\u2033"]/g, '"').replace(/[^a-z0-9\s'"]/g, '').replace(/\s+/g, ' ').trim() }

async function fetchPage(url) {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      signal: AbortSignal.timeout(15000),
    })
    return res.ok ? await res.text() : null
  } catch { return null }
}

function getHeadings($) {
  const headings = []
  $('h1, h2, h3, h4').each((_, el) => {
    const $el = $(el)
    // Skip footer/nav
    if ($el.closest('footer, nav, [role="navigation"]').length > 0) return
    const text = clean($el.text())
    if (text.length < 3) return
    // Skip known footer headings
    const lo = text.toLowerCase()
    if (['company', 'quick link', 'quick links', 'sample reports', 'decoder by make', 'legal', 'resources'].includes(lo)) return
    headings.push({ tag: el.tagName.toLowerCase(), text })
  })
  return headings
}

async function diffCountry(country) {
  const [liveHtml, localHtml] = await Promise.all([
    fetchPage(`${LIVE_BASE}/vin-check/${country.slug}`),
    fetchPage(`${LOCAL_BASE}/vin-check/${country.slug}`),
  ])

  if (!liveHtml || !localHtml) {
    return { country, error: !liveHtml ? 'Live unreachable' : 'Local unreachable' }
  }

  const liveH = getHeadings(cheerio.load(liveHtml))
  const localH = getHeadings(cheerio.load(localHtml))

  // Count by tag
  const count = (arr, tag) => arr.filter(h => h.tag === tag).length
  const tags = ['h1', 'h2', 'h3', 'h4']
  const counts = {}
  for (const t of tags) {
    counts[t] = { live: count(liveH, t), local: count(localH, t) }
  }

  // Diff by normalized text (tag-aware)
  const liveSet = new Map()
  for (const h of liveH) {
    const key = `${h.tag}::${norm(h.text)}`
    if (!liveSet.has(key)) liveSet.set(key, h)
  }
  const localSet = new Map()
  for (const h of localH) {
    const key = `${h.tag}::${norm(h.text)}`
    if (!localSet.has(key)) localSet.set(key, h)
  }

  // Missing on localhost (on live, not on local)
  const missing = []
  for (const [key, h] of liveSet) {
    if (!localSet.has(key)) missing.push(h)
  }

  // Extra on localhost (on local, not on live)
  const extra = []
  for (const [key, h] of localSet) {
    if (!liveSet.has(key)) extra.push(h)
  }

  // Tag changes (same text, different tag)
  const tagChanges = []
  for (const misH of missing) {
    const normText = norm(misH.text)
    const match = extra.find(e => norm(e.text) === normText)
    if (match) {
      tagChanges.push({ text: misH.text, liveTag: misH.tag, localTag: match.tag })
    }
  }

  const matched = liveSet.size - missing.length

  return { country, counts, liveTotal: liveH.length, localTotal: localH.length, matched, missing, extra, tagChanges }
}

async function main() {
  console.log('\n═══════════════════════════════════════')
  console.log('  HEADING DIFF: Live vs Localhost')
  console.log('═══════════════════════════════════════\n')

  const countries = countryFilter ? COUNTRIES.filter(c => c.slug === countryFilter) : COUNTRIES
  const results = []
  let totalMissing = 0, totalExtra = 0, totalPerfect = 0

  for (const country of countries) {
    process.stdout.write(`  ${country.name.padEnd(25)}`)
    const r = await diffCountry(country)
    results.push(r)

    if (r.error) {
      console.log(`❌ ${r.error}`)
      continue
    }

    const status = r.missing.length === 0 && r.extra.length === 0 ? '✅' :
                   r.missing.length === 0 ? '⚠️' : '🔴'

    const countStr = ['h1','h2','h3','h4'].map(t =>
      `${t}:${r.counts[t].local}/${r.counts[t].live}${r.counts[t].local === r.counts[t].live ? '' : '!'}`
    ).join(' ')

    console.log(`${status} ${countStr}  missing:${r.missing.length} extra:${r.extra.length}`)

    totalMissing += r.missing.length
    totalExtra += r.extra.length
    if (r.missing.length === 0 && r.extra.length === 0) totalPerfect++

    await new Promise(r => setTimeout(r, 200))
  }

  console.log(`\n═══════════════════════════════════════`)
  console.log(`  Perfect: ${totalPerfect}/${countries.length}`)
  console.log(`  Total missing: ${totalMissing}  Total extra: ${totalExtra}`)
  console.log(`═══════════════════════════════════════\n`)

  // Show details for non-perfect pages
  const imperfect = results.filter(r => !r.error && (r.missing.length > 0 || r.extra.length > 0))
  if (imperfect.length > 0) {
    console.log('── MISSING ON LOCALHOST ─────────────────\n')
    for (const r of imperfect) {
      if (r.missing.length === 0) continue
      console.log(`  ${r.country.name}:`)
      for (const h of r.missing) {
        console.log(`    - <${h.tag}> ${h.text.slice(0, 70)}`)
      }
      if (r.tagChanges.length > 0) {
        for (const tc of r.tagChanges) {
          console.log(`    ↳ "${tc.text.slice(0, 50)}" is <${tc.localTag}> on localhost (was <${tc.liveTag}>)`)
        }
      }
      console.log()
    }

    const hasExtra = imperfect.filter(r => r.extra.length > 0)
    if (hasExtra.length > 0) {
      console.log('── EXTRA ON LOCALHOST ───────────────────\n')
      for (const r of hasExtra) {
        console.log(`  ${r.country.name}:`)
        for (const h of r.extra) {
          console.log(`    + <${h.tag}> ${h.text.slice(0, 70)}`)
        }
        console.log()
      }
    }
  }

  if (reportFlag) {
    const md = buildMarkdown(results, totalPerfect, totalMissing, totalExtra)
    writeFileSync(join(__dirname, 'heading-diff.md'), md)
    console.log('Report saved to heading-diff.md')
  }
}

function buildMarkdown(results, perfect, missing, extra) {
  const lines = [
    '# Heading Diff Report',
    `Live: ${LIVE_BASE} | Local: ${LOCAL_BASE}`,
    `Generated: ${new Date().toISOString()}`,
    '',
    `**Perfect: ${perfect}/${results.length} | Missing: ${missing} | Extra: ${extra}**`,
    '',
    '| Country | H1 | H2 | H3 | H4 | Missing | Extra | Status |',
    '|---------|----|----|----|----|---------|-------|--------|',
  ]

  for (const r of results) {
    if (r.error) { lines.push(`| ${r.country.name} | — | — | — | — | — | — | ❌ ${r.error} |`); continue }
    const c = r.counts
    const s = r.missing.length === 0 && r.extra.length === 0 ? '✅' : r.missing.length === 0 ? '⚠️' : '🔴'
    lines.push(`| ${r.country.name} | ${c.h1.local}/${c.h1.live} | ${c.h2.local}/${c.h2.live} | ${c.h3.local}/${c.h3.live} | ${c.h4.local}/${c.h4.live} | ${r.missing.length} | ${r.extra.length} | ${s} |`)
  }

  const imperfect = results.filter(r => !r.error && r.missing.length > 0)
  if (imperfect.length > 0) {
    lines.push('', '## Missing on Localhost', '')
    for (const r of imperfect) {
      lines.push(`### ${r.country.name}`)
      for (const h of r.missing) lines.push(`- \`<${h.tag}>\` ${h.text}`)
      for (const tc of r.tagChanges) lines.push(`  - ↳ Rendered as \`<${tc.localTag}>\` (was \`<${tc.liveTag}>\`)`)
      lines.push('')
    }
  }

  return lines.join('\n')
}

main().catch(e => { console.error('Fatal:', e.message); process.exit(1) })
