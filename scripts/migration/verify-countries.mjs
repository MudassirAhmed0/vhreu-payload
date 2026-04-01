#!/usr/bin/env node
/**
 * Verify migrated country pages — compares live WordPress vs localhost.
 *
 * Checks:
 *   1. Page title (<title> tag)
 *   2. Meta description
 *   3. Heading structure (h1–h6 tags + text)
 *   4. Content sections present
 *
 * Usage:
 *   node verify-countries.mjs                          # all seeded countries
 *   node verify-countries.mjs --country germany        # single country
 *   node verify-countries.mjs --report                 # save report to file
 *   node verify-countries.mjs --local http://localhost:3000  # custom local URL
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

// Load scraped countries to know which ones to verify
let COUNTRIES
try {
  const data = JSON.parse(readFileSync(join(__dirname, 'improvised-countries.json'), 'utf8'))
  COUNTRIES = data.map(c => ({ name: c.name, slug: c.slug }))
} catch {
  const data = JSON.parse(readFileSync(join(__dirname, 'scraped-countries.json'), 'utf8'))
  COUNTRIES = data.map(c => ({ name: c.name, slug: c.slug }))
}

// ── Helpers ────────────────────────────────────────────────────────

function clean(str) {
  return (str || '').replace(/\s+/g, ' ').trim()
}

async function fetchPage(url) {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' },
      signal: AbortSignal.timeout(15000),
    })
    if (!res.ok) return null
    return await res.text()
  } catch {
    return null
  }
}

function extractPageData($) {
  const title = clean($('title').text())
  const metaDesc = $('meta[name="description"]').attr('content')?.trim() || null
  const metaKeywords = $('meta[name="keywords"]').attr('content')?.trim() || null
  const canonical = $('link[rel="canonical"]').attr('href') || null
  const robots = $('meta[name="robots"]').attr('content') || null

  // Extract all headings with their level and text (skip footer/nav/header chrome)
  const headings = []
  $('h1, h2, h3, h4, h5, h6').each((_, el) => {
    const $el = $(el)
    const tag = el.tagName.toLowerCase()
    const text = clean($el.text())
    // Skip empty headings
    if (text.length < 2) return
    // Skip footer, nav, header chrome headings
    if ($el.closest('footer, nav, [role="navigation"], [role="banner"]').length > 0) return
    // Skip common footer heading patterns
    const lower = text.toLowerCase()
    if (['company', 'quick link', 'quick links', 'sample reports', 'decoder by make', 'legal', 'resources'].includes(lower)) return
    headings.push({ tag, text })
  })

  return { title, metaDesc, metaKeywords, canonical, robots, headings }
}

// ── Comparison ─────────────────────────────────────────────────────

function comparePages(live, local, slug) {
  const issues = []
  const warnings = []
  const passes = []
  const normalize = (s) => s.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim()

  // Title
  if (!local.title) {
    issues.push({ type: 'MISSING', field: 'title', detail: `No <title> tag on localhost` })
  } else if (live.title && local.title !== live.title) {
    const liveTrimmed = live.title.replace(/\s*[-–|].*$/, '').trim()
    const localTrimmed = local.title.replace(/\s*[-–|].*$/, '').trim()
    if (liveTrimmed !== localTrimmed) {
      issues.push({ type: 'MISMATCH', field: 'title', live: live.title, local: local.title })
    } else {
      passes.push(`Title core matches: "${liveTrimmed}"`)
    }
  } else {
    passes.push(`Title: "${local.title}"`)
  }

  // Meta description
  if (live.metaDesc && !local.metaDesc) {
    issues.push({ type: 'MISSING', field: 'meta description', detail: 'Live has meta description, localhost does not' })
  } else if (live.metaDesc && local.metaDesc && live.metaDesc !== local.metaDesc) {
    warnings.push({ type: 'DIFF', field: 'meta description', live: live.metaDesc.slice(0, 80) + '...', local: local.metaDesc.slice(0, 80) + '...' })
  } else if (local.metaDesc) {
    passes.push(`Meta description present (${local.metaDesc.length} chars)`)
  }

  // Heading structure
  const liveH1s = live.headings.filter(h => h.tag === 'h1')
  const localH1s = local.headings.filter(h => h.tag === 'h1')

  if (liveH1s.length > 0 && localH1s.length === 0) {
    issues.push({ type: 'MISSING', field: 'h1', detail: `No H1 on localhost (live has: "${liveH1s[0].text}")` })
  } else if (liveH1s.length > 0 && localH1s.length > 0 && normalize(liveH1s[0].text) !== normalize(localH1s[0].text)) {
    issues.push({ type: 'MISMATCH', field: 'h1', live: liveH1s[0].text, local: localH1s[0].text })
  } else if (localH1s.length > 0) {
    passes.push(`H1 matches: "${localH1s[0].text.slice(0, 60)}"`)
  }

  // Compare H2 headings — check for missing, extra, and tag changes
  const liveH2s = live.headings.filter(h => h.tag === 'h2')
  const localH2s = local.headings.filter(h => h.tag === 'h2')

  const liveH2Set = new Map(liveH2s.map(h => [normalize(h.text), h.text]))
  const localH2Set = new Map(localH2s.map(h => [normalize(h.text), h.text]))

  // H2s on live but missing from localhost
  for (const [norm, text] of liveH2Set) {
    if (!localH2Set.has(norm)) {
      // Check if it exists as a different heading level on localhost
      const asOtherTag = local.headings.find(h => normalize(h.text) === norm && h.tag !== 'h2')
      if (asOtherTag) {
        warnings.push({ type: 'TAG_CHANGE', field: `"${text}"`, live: 'h2', local: asOtherTag.tag })
      } else {
        issues.push({ type: 'MISSING_H2', field: text, detail: `H2 on live site not found on localhost` })
      }
    }
  }

  // H2s on localhost that don't exist on live (new/extra)
  for (const [norm, text] of localH2Set) {
    if (!liveH2Set.has(norm)) {
      // Check if it was a different tag on live
      const asOtherTag = live.headings.find(h => normalize(h.text) === norm)
      if (asOtherTag) {
        warnings.push({ type: 'TAG_CHANGE', field: `"${text}"`, live: asOtherTag.tag, local: 'h2' })
      } else {
        warnings.push({ type: 'EXTRA_H2', field: text, detail: 'H2 on localhost not present on live site' })
      }
    }
  }

  // Compare H3 headings
  const liveH3s = live.headings.filter(h => h.tag === 'h3')
  const localH3s = local.headings.filter(h => h.tag === 'h3')
  const liveH3Set = new Map(liveH3s.map(h => [normalize(h.text), h.text]))
  const localH3Set = new Map(localH3s.map(h => [normalize(h.text), h.text]))

  const missingH3s = []
  for (const [norm, text] of liveH3Set) {
    if (!localH3Set.has(norm)) {
      const asOtherTag = local.headings.find(h => normalize(h.text) === norm)
      if (asOtherTag) {
        warnings.push({ type: 'TAG_CHANGE', field: `"${text.slice(0, 50)}"`, live: 'h3', local: asOtherTag.tag })
      } else {
        missingH3s.push(text)
      }
    }
  }
  if (missingH3s.length > 0) {
    issues.push({ type: 'MISSING_H3', field: `${missingH3s.length} H3(s)`, detail: missingH3s.map(t => `"${t.slice(0, 50)}"`).join(', ') })
  }

  // Heading count summary
  const liveCounts = {}
  const localCounts = {}
  for (const h of live.headings) liveCounts[h.tag] = (liveCounts[h.tag] || 0) + 1
  for (const h of local.headings) localCounts[h.tag] = (localCounts[h.tag] || 0) + 1

  const countSummary = ['h1', 'h2', 'h3', 'h4'].map(tag => {
    const l = liveCounts[tag] || 0
    const lo = localCounts[tag] || 0
    const status = l === lo ? '✅' : Math.abs(l - lo) <= 2 ? '⚠️' : '🔴'
    return `${tag}: ${lo}/${l} ${status}`
  }).join('  ')

  return { issues, warnings, passes, countSummary, liveCounts, localCounts }
}

// ── Main ───────────────────────────────────────────────────────────

async function main() {
  console.log('\n═══════════════════════════════════════')
  console.log('  VERIFY MIGRATED COUNTRY PAGES')
  console.log(`  Live: ${LIVE_BASE}`)
  console.log(`  Local: ${LOCAL_BASE}`)
  console.log('═══════════════════════════════════════\n')

  const countries = countryFilter
    ? COUNTRIES.filter(c => c.slug === countryFilter)
    : COUNTRIES

  const report = []
  let totalIssues = 0
  let totalWarnings = 0
  let totalPass = 0

  for (const country of countries) {
    const livePath = `/vin-check/${country.slug}`
    const localPath = `/vin-check/${country.slug}`

    process.stdout.write(`  ${country.name.padEnd(25)}`)

    const [liveHtml, localHtml] = await Promise.all([
      fetchPage(`${LIVE_BASE}${livePath}`),
      fetchPage(`${LOCAL_BASE}${localPath}`),
    ])

    if (!liveHtml) {
      console.log('⚠️  Live page not reachable')
      continue
    }
    if (!localHtml) {
      console.log('🔴 Local page not reachable')
      report.push({ country: country.name, slug: country.slug, error: 'Local page not reachable' })
      totalIssues++
      continue
    }

    const liveData = extractPageData(cheerio.load(liveHtml))
    const localData = extractPageData(cheerio.load(localHtml))
    const result = comparePages(liveData, localData, country.slug)

    const emoji = result.issues.length > 0 ? '🔴' : result.warnings.length > 0 ? '⚠️' : '✅'
    console.log(`${emoji}  ${result.countSummary}  issues: ${result.issues.length}  warnings: ${result.warnings.length}`)

    totalIssues += result.issues.length
    totalWarnings += result.warnings.length
    totalPass += result.passes.length

    report.push({
      country: country.name,
      slug: country.slug,
      ...result,
      liveTitle: liveData.title,
      localTitle: localData.title,
      liveHeadingCount: liveData.headings.length,
      localHeadingCount: localData.headings.length,
    })

    // Rate limit
    await new Promise(r => setTimeout(r, 200))
  }

  console.log(`\n═══════════════════════════════════════`)
  console.log(`  Issues: ${totalIssues}  Warnings: ${totalWarnings}  Passes: ${totalPass}`)
  console.log(`  Pages verified: ${report.length}`)
  console.log(`═══════════════════════════════════════\n`)

  // Detailed report for pages with issues
  const pagesWithIssues = report.filter(r => r.issues?.length > 0 || r.warnings?.length > 0)
  if (pagesWithIssues.length > 0) {
    console.log('── DETAILS ──────────────────────────────\n')
    for (const r of pagesWithIssues) {
      console.log(`  📄 ${r.country} (/vin-check/${r.slug})`)
      if (r.issues) {
        for (const issue of r.issues) {
          if (issue.live && issue.local) {
            console.log(`     🔴 ${issue.type} [${issue.field}]`)
            console.log(`        Live:  ${issue.live}`)
            console.log(`        Local: ${issue.local}`)
          } else {
            console.log(`     🔴 ${issue.type}: ${issue.field} — ${issue.detail || ''}`)
          }
        }
      }
      if (r.warnings) {
        for (const warn of r.warnings) {
          if (warn.live && warn.local && warn.type === 'TAG_CHANGE') {
            console.log(`     ⚠️  ${warn.field}: ${warn.live} → ${warn.local}`)
          } else if (warn.live && warn.local) {
            console.log(`     ⚠️  ${warn.type} [${warn.field}]`)
            console.log(`        Live:  ${warn.live}`)
            console.log(`        Local: ${warn.local}`)
          } else {
            console.log(`     ⚠️  ${warn.type}: ${warn.field}`)
          }
        }
      }
      console.log()
    }
  }

  // Save report
  if (reportFlag) {
    const reportFile = join(__dirname, 'verification-report.json')
    writeFileSync(reportFile, JSON.stringify(report, null, 2))
    console.log(`Report saved to ${reportFile}`)

    // Also save markdown summary
    const md = generateMarkdownReport(report, totalIssues, totalWarnings)
    const mdFile = join(__dirname, 'verification-report.md')
    writeFileSync(mdFile, md)
    console.log(`Markdown report saved to ${mdFile}`)
  }
}

function generateMarkdownReport(report, totalIssues, totalWarnings) {
  const lines = [
    '# Country Page Verification Report',
    `Generated: ${new Date().toISOString()}`,
    `Live: ${LIVE_BASE} | Local: ${LOCAL_BASE}`,
    '',
    `**Issues: ${totalIssues} | Warnings: ${totalWarnings} | Pages: ${report.length}**`,
    '',
    '## Summary',
    '',
    '| Country | H1 | H2 | H3 | H4 | Issues | Warnings | Status |',
    '|---------|----|----|----|----|--------|----------|--------|',
  ]

  for (const r of report) {
    if (r.error) {
      lines.push(`| ${r.country} | — | — | — | — | 1 | 0 | 🔴 ${r.error} |`)
      continue
    }
    const lc = r.liveCounts || {}
    const loc = r.localCounts || {}
    const status = (r.issues?.length || 0) > 0 ? '🔴' : (r.warnings?.length || 0) > 0 ? '⚠️' : '✅'
    lines.push(`| ${r.country} | ${loc.h1 || 0}/${lc.h1 || 0} | ${loc.h2 || 0}/${lc.h2 || 0} | ${loc.h3 || 0}/${lc.h3 || 0} | ${loc.h4 || 0}/${lc.h4 || 0} | ${r.issues?.length || 0} | ${r.warnings?.length || 0} | ${status} |`)
  }

  lines.push('')
  lines.push('## Issues & Warnings')
  lines.push('')

  for (const r of report) {
    if (!r.issues?.length && !r.warnings?.length) continue
    lines.push(`### ${r.country} (\`/vin-check/${r.slug}\`)`)
    lines.push('')
    if (r.issues) {
      for (const issue of r.issues) {
        if (issue.live && issue.local) {
          lines.push(`- 🔴 **${issue.type}** [${issue.field}]: Live: \`${issue.live}\` → Local: \`${issue.local}\``)
        } else {
          lines.push(`- 🔴 **${issue.type}**: ${issue.field} — ${issue.detail || ''}`)
        }
      }
    }
    if (r.warnings) {
      for (const warn of r.warnings) {
        if (warn.type === 'TAG_CHANGE') {
          lines.push(`- ⚠️ **TAG_CHANGE**: ${warn.field}: \`${warn.live}\` → \`${warn.local}\``)
        } else {
          lines.push(`- ⚠️ **${warn.type}**: ${warn.field}`)
        }
      }
    }
    lines.push('')
  }

  return lines.join('\n')
}

main().catch(err => {
  console.error('Fatal:', err.message)
  process.exit(1)
})
