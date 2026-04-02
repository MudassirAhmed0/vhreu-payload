#!/usr/bin/env node
/**
 * Heading diff for VIN Decoder brand pages — live vs localhost.
 *
 * Usage:
 *   node verify-brand-headings.mjs --brand audi        # single brand
 *   node verify-brand-headings.mjs                      # all scraped brands
 *   node verify-brand-headings.mjs --report             # save markdown
 */

import * as cheerio from 'cheerio'
import { writeFileSync, readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const LIVE_BASE = 'https://vehiclehistory.eu'
const args = process.argv.slice(2)
const LOCAL_BASE = args.includes('--local') ? args[args.indexOf('--local') + 1] : 'http://localhost:3000'
const brandFilter = args.includes('--brand') ? args[args.indexOf('--brand') + 1] : null
const reportFlag = args.includes('--report')

let BRANDS
try {
  BRANDS = JSON.parse(readFileSync(join(__dirname, 'scraped-brands.json'), 'utf8')).map(b => ({ name: b.name, slug: b.slug }))
} catch { BRANDS = [] }

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
    if ($el.closest('footer, nav, [role="navigation"]').length > 0) return
    const text = clean($el.text())
    if (text.length < 3) return
    const lo = text.toLowerCase()
    if (['company', 'quick link', 'quick links', 'sample reports', 'decoder by make', 'legal', 'resources'].includes(lo)) return
    headings.push({ tag: el.tagName.toLowerCase(), text })
  })
  return headings
}

async function diffBrand(brand) {
  const [liveHtml, localHtml] = await Promise.all([
    fetchPage(`${LIVE_BASE}/vin-decoder/${brand.slug}`),
    fetchPage(`${LOCAL_BASE}/vin-decoder/${brand.slug}`),
  ])

  if (!liveHtml || !localHtml) {
    return { brand, error: !liveHtml ? 'Live unreachable' : 'Local unreachable' }
  }

  const liveH = getHeadings(cheerio.load(liveHtml))
  const localH = getHeadings(cheerio.load(localHtml))

  const count = (arr, tag) => arr.filter(h => h.tag === tag).length
  const tags = ['h1', 'h2', 'h3', 'h4']
  const counts = {}
  for (const t of tags) {
    counts[t] = { live: count(liveH, t), local: count(localH, t) }
  }

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

  const missing = []
  for (const [key, h] of liveSet) {
    if (!localSet.has(key)) missing.push(h)
  }

  const extra = []
  for (const [key, h] of localSet) {
    if (!liveSet.has(key)) extra.push(h)
  }

  const tagChanges = []
  for (const misH of missing) {
    const normText = norm(misH.text)
    const match = extra.find(e => norm(e.text) === normText)
    if (match) {
      tagChanges.push({ text: misH.text, liveTag: misH.tag, localTag: match.tag })
    }
  }

  const matched = liveSet.size - missing.length

  return { brand, counts, liveTotal: liveH.length, localTotal: localH.length, matched, missing, extra, tagChanges }
}

async function main() {
  console.log('\n═══════════════════════════════════════')
  console.log('  BRAND HEADING DIFF: Live vs Localhost')
  console.log('═══════════════════════════════════════\n')

  const brands = brandFilter ? BRANDS.filter(b => b.slug === brandFilter) : BRANDS
  if (brands.length === 0) { console.log('No brands found. Run scraper first.'); return }

  const results = []
  let totalMissing = 0, totalExtra = 0, totalPerfect = 0

  for (const brand of brands) {
    process.stdout.write(`  ${brand.name.padEnd(25)}`)
    const r = await diffBrand(brand)
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
  console.log(`  Perfect: ${totalPerfect}/${brands.length}`)
  console.log(`  Total missing: ${totalMissing}  Total extra: ${totalExtra}`)
  console.log(`═══════════════════════════════════════\n`)

  const imperfect = results.filter(r => !r.error && (r.missing.length > 0 || r.extra.length > 0))
  if (imperfect.length > 0) {
    console.log('── MISSING ON LOCALHOST ─────────────────\n')
    for (const r of imperfect) {
      if (r.missing.length === 0) continue
      console.log(`  ${r.brand.name}:`)
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
        console.log(`  ${r.brand.name}:`)
        for (const h of r.extra) {
          console.log(`    + <${h.tag}> ${h.text.slice(0, 70)}`)
        }
        console.log()
      }
    }
  }

  if (reportFlag) {
    const lines = [
      '# Brand Heading Diff Report',
      `Live: ${LIVE_BASE} | Local: ${LOCAL_BASE}`,
      `Generated: ${new Date().toISOString()}`,
      '',
      `**Perfect: ${totalPerfect}/${results.length} | Missing: ${totalMissing} | Extra: ${totalExtra}**`,
      '',
      '| Brand | H1 | H2 | H3 | H4 | Missing | Extra | Status |',
      '|-------|----|----|----|----|---------|-------|--------|',
    ]
    for (const r of results) {
      if (r.error) { lines.push(`| ${r.brand.name} | — | — | — | — | — | — | ❌ ${r.error} |`); continue }
      const c = r.counts
      const s = r.missing.length === 0 && r.extra.length === 0 ? '✅' : r.missing.length === 0 ? '⚠️' : '🔴'
      lines.push(`| ${r.brand.name} | ${c.h1.local}/${c.h1.live} | ${c.h2.local}/${c.h2.live} | ${c.h3.local}/${c.h3.live} | ${c.h4.local}/${c.h4.live} | ${r.missing.length} | ${r.extra.length} | ${s} |`)
    }
    writeFileSync(join(__dirname, 'brand-heading-diff.md'), lines.join('\n'))
    console.log('Report saved to brand-heading-diff.md')
  }
}

main().catch(e => { console.error('Fatal:', e.message); process.exit(1) })
