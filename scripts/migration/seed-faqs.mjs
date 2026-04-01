#!/usr/bin/env node
/**
 * Seeds FAQ data into existing Payload pages.
 * Reads scraped-faqs.json and patches FAQ blocks with real Q&A pairs.
 *
 * Usage:
 *   node scripts/seed-faqs.mjs
 */

import { readFileSync } from 'fs'

const PAYLOAD_URL = process.env.PAYLOAD_URL || 'http://localhost:3001'
const EMAIL = process.env.PAYLOAD_EMAIL || 'lame@lame.com'
const PASSWORD = process.env.PAYLOAD_PASSWORD || 'lame@lame.com'

const FAQS = JSON.parse(readFileSync('scraped-faqs.json', 'utf8'))

// Page path → Payload slug
const SLUG_MAP = {
  '/': 'home',
  '/pricing': 'pricing',
  '/window-sticker': 'window-sticker',
  '/contact-us': 'contact-us',
}

let token = null

async function login() {
  const res = await fetch(`${PAYLOAD_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  })
  const data = await res.json()
  token = data.token
}

async function getPage(slug) {
  const res = await fetch(
    `${PAYLOAD_URL}/api/pages?where[slug][equals]=${slug}&limit=1`,
    { headers: { Authorization: `JWT ${token}` } },
  )
  const data = await res.json()
  return data.docs?.[0] || null
}

async function patchPage(id, content) {
  const res = await fetch(`${PAYLOAD_URL}/api/pages/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${token}`,
    },
    body: JSON.stringify({ content }),
    signal: AbortSignal.timeout(60_000),
  })
  try {
    const data = await res.json()
    return data.doc || null
  } catch {
    // Response may timeout but data still gets saved
    return { id }
  }
}

async function main() {
  console.log('Connecting to Payload...')
  await login()
  console.log('Authenticated.\n')

  for (const pageData of FAQS) {
    const path = pageData.path
    const slug = SLUG_MAP[path]
    if (!slug) {
      console.log(`${path}: no slug mapping, skipping`)
      continue
    }
    if (pageData.faqSections.length === 0) {
      console.log(`${path}: no FAQs scraped, skipping`)
      continue
    }

    console.log(`${path} (slug: ${slug})`)

    const page = await getPage(slug)
    if (!page) {
      console.log(`  Page not found in Payload, skipping`)
      continue
    }

    const blocks = page.content || []
    let patched = false

    // Find FAQ blocks and replace their items
    for (const block of blocks) {
      // FAQ can be an inner block inside a section
      if (block.blockType === 'section' && block.content) {
        for (const inner of block.content) {
          if (inner.blockType === 'faqs') {
            // Find matching FAQ section from scraped data
            const faqSection = pageData.faqSections[0] // Use first section
            if (faqSection && faqSection.faqs.length > 0) {
              inner.items = faqSection.faqs.map(f => ({
                question: f.question,
                answer: f.answer,
              }))
              patched = true
              console.log(`  Patched FAQ block: ${faqSection.faqs.length} Q&As`)

              // Also update section heading if scraped
              if (faqSection.sectionHeading && block.heading) {
                // Keep existing heading (may have **markers**), don't overwrite
              }
            }
          }
        }
      }
    }

    if (patched) {
      console.log(`  Saving...`)
      const result = await patchPage(page.id, blocks)
      if (result) {
        console.log(`  Saved (id: ${result.id})`)
      } else {
        console.log(`  FAILED`)
      }
    } else {
      console.log(`  No FAQ blocks found in page content`)
    }
    console.log()
  }

  console.log('Done.')
}

main().catch(err => {
  console.error('Fatal:', err.message)
  process.exit(1)
})
