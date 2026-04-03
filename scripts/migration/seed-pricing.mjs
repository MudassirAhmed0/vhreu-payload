#!/usr/bin/env node
/**
 * Seed the Pricing page into Payload CMS.
 *
 * Usage:
 *   node scripts/migration/seed-pricing.mjs
 *   node scripts/migration/seed-pricing.mjs --dry-run
 */

const PAYLOAD_URL = process.env.PAYLOAD_URL || 'http://localhost:3030'
const EMAIL = 'lame@lame.com'
const PASSWORD = 'lame@lame.com'
let token = null

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
        children: parseInlineFormatting(p.trim()),
      })),
    },
  }
}

function parseInlineFormatting(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/)
  return parts.filter(Boolean).map(part => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return { type: 'text', text: part.slice(2, -2), format: 1, version: 1, detail: 0, mode: 'normal', style: '' }
    }
    return { type: 'text', text: part, format: 0, version: 1, detail: 0, mode: 'normal', style: '' }
  })
}

// ── Auth ───────────────────────────────────────────────────────────

async function login() {
  const res = await fetch(`${PAYLOAD_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  })
  const data = await res.json()
  token = data.token
  if (!token) throw new Error('Login failed: ' + JSON.stringify(data))
  console.log('✅ Logged in')
}

async function findPage(slug) {
  const res = await fetch(`${PAYLOAD_URL}/api/pages?where[slug][equals]=${slug}&limit=1`, {
    headers: { Authorization: `JWT ${token}` },
  })
  const data = await res.json()
  return data.docs?.[0] || null
}

async function upsertPage(slug, payload) {
  const existing = await findPage(slug)
  const url = existing
    ? `${PAYLOAD_URL}/api/pages/${existing.id}`
    : `${PAYLOAD_URL}/api/pages`
  const method = existing ? 'PATCH' : 'POST'

  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${token}`,
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(60_000),
  })

  const data = await res.json()
  if (data.errors) {
    console.error('❌ Errors:', JSON.stringify(data.errors, null, 2))
    return null
  }
  console.log(`${existing ? '🔄 Updated' : '✅ Created'} page: ${slug} (id: ${data.doc?.id})`)
  return data.doc
}

// ── Block generators ───────────────────────────────────────────────

function generateHeroBlock() {
  return {
    blockType: 'page-hero',
    variant: 'centered',
    dark: true,
    title: 'Detailed Report at **Affordable Pricing**',
    tag: 'Plans For Every Buyer',
    tagLevel: 'span',
    description: 'Any package selected offers great value at affordable prices. Get instant access to your vehicle history report.',
    formType: 'none',
    features: [
      { text: 'Detailed Vehicle History', icon: { source: 'preset', preset: 'file-text' } },
      { text: 'Best Value for Money', icon: { source: 'preset', preset: 'circle-check' } },
      { text: '33% Cheaper than Carfax', icon: { source: 'preset', preset: 'shield-check' } },
    ],
    bullets: [
      { text: 'Verified Sources' },
      { text: 'Instant Delivery' },
      { text: 'Money-Back Guarantee' },
    ],
  }
}

function generatePricingSection() {
  return {
    blockType: 'section',
    heading: 'Choose Your **Package**',
    headingLevel: 'h2',
    tag: 'Pricing',
    background: 'light',
    scene: 'default',
    content: [
      {
        blockType: 'pricing',
        showSubscriptions: false,
        featuredPlanCode: 'VHREU5',
        columns: '3',
      },
    ],
  }
}

function generateTrustSection() {
  return {
    blockType: 'section',
    heading: 'Get 100% **Real-Time** Information Instantly',
    headingLevel: 'h2',
    tag: 'Trusted Data Sources',
    background: 'none',
    scene: 'default',
    description: textToLexical(
      'We provide up-to-date information from the Department of Motor Vehicles, auctions, police & state records, insurance and NMVTIS databases. Save 50% over service provider for an identical report.'
    ),
    content: [
      {
        blockType: 'card-grid',
        style: 'icon',
        layout: 'centered',
        columns: 3,
        cards: [
          {
            title: 'Comprehensive Reports',
            titleElement: 'h3',
            icon: { source: 'preset', preset: 'file-text' },
            description: textToLexical(
              'Vehicle History offers complete and detailed information obtained from government databases, and other authentic sources.'
            ),
          },
          {
            title: 'Exceptional Accuracy',
            titleElement: 'h3',
            icon: { source: 'preset', preset: 'circle-check' },
            description: textToLexical(
              'Vehicle History offers complete and detailed information obtained from government databases, and other authentic sources.'
            ),
          },
          {
            title: 'Real-time Information',
            titleElement: 'h3',
            icon: { source: 'preset', preset: 'zap' },
            description: textToLexical(
              'Our databases are automatically updated with real-time information as more records are placed on your vehicle worldwide.'
            ),
          },
        ],
      },
    ],
  }
}

function generateHowToSection() {
  return {
    blockType: 'section',
    heading: 'How to Gain **Lifetime Access** to VIN Reports',
    headingLevel: 'h2',
    tag: 'How It Works',
    background: 'dark',
    scene: 'default',
    content: [
      {
        blockType: 'steps',
        style: 'numbers',
        steps: [
          {
            title: 'Obtain the VIN',
            description: 'The Vehicle Identification Number is usually found on the dashboard through the driver-side windshield, or on the driver-side door jamb.',
          },
          {
            title: 'Run a VIN Check',
            description: 'Enter the VIN on our platform. The VIN Check will show the number of records available for that vehicle.',
          },
          {
            title: 'Purchase Your Package',
            description: 'Select a single report or save with a discounted multi-vehicle package. All packages offer the same comprehensive data.',
          },
          {
            title: 'Access Your Reports Anytime',
            description: 'Your reports never expire. Log in to your personal account anytime to view, download, or share your vehicle history reports.',
          },
        ],
        bottomText: textToLexical('Want to see what a report looks like before buying?'),
      },
    ],
    ctas: [
      { label: 'View Sample Report', href: '/sample-report', style: 'secondary', rel: 'none', newTab: false },
    ],
  }
}

function generateFaqSection() {
  return {
    blockType: 'section',
    heading: 'Any **Questions**?',
    headingLevel: 'h2',
    tag: 'FAQ',
    background: 'light',
    scene: 'default',
    narrow: true,
    content: [
      {
        blockType: 'faqs',
        items: [
          {
            question: 'How long does it take to get a Vehicle History report?',
            questionElement: 'h3',
            answer: textToLexical(
              'Reports are generated instantly after purchase. Once you complete payment, your comprehensive vehicle history report will be available immediately in your dashboard for viewing and download.'
            ),
          },
          {
            question: 'How long are my credits valid?',
            questionElement: 'h3',
            answer: textToLexical(
              'Your credits never expire. Whether you purchase a single report or a multi-vehicle package, you can use your credits at any time. Simply log in to your account to access your available credits.'
            ),
          },
          {
            question: 'What information may appear in the Vehicle History report?',
            questionElement: 'h3',
            answer: textToLexical(
              'Our reports may include title information, accident history, odometer readings, auction records, recalls, theft records, ownership history, service records, and more — sourced from government databases, insurance records, and other authentic sources.'
            ),
          },
          {
            question: 'What payment methods do you accept?',
            questionElement: 'h3',
            answer: textToLexical(
              'We accept all major credit and debit cards (Visa, Mastercard, American Express, Discover) through our secure Stripe payment gateway. PayPal is also available in supported regions.'
            ),
          },
        ],
      },
    ],
  }
}

function generateCtaBanner() {
  return {
    blockType: 'cta-banner',
    heading: 'Ready to Check Your **Vehicle History**?',
    headingLevel: 'h2',
    tag: 'Get Started',
    description: textToLexical(
      'Enter any VIN to get a comprehensive vehicle history report instantly. Trusted by thousands of European car buyers.'
    ),
    layout: 'full',
    scene: 'none',
    mode: 'vin-input',
  }
}

// ── Main ───────────────────────────────────────────────────────────

async function main() {
  const dryRun = process.argv.includes('--dry-run')

  const blocks = [
    generateHeroBlock(),
    generatePricingSection(),
    generateTrustSection(),
    generateHowToSection(),
    generateFaqSection(),
    generateCtaBanner(),
  ]

  if (dryRun) {
    console.log(JSON.stringify(blocks, null, 2))
    console.log(`\n📋 ${blocks.length} blocks generated (dry run)`)
    return
  }

  await login()

  const pageData = {
    name: 'Pricing',
    slug: 'pricing',
    content: blocks,
    meta: {
      title: 'Pricing | Vehicle History Europe',
      description: 'Get detailed pricing and package information of Vehicle History Europe for VIN Decoding, VIN Check, VIN Lookup, and Vehicle history report service.',
    },
    _status: 'published',
  }

  await upsertPage('pricing', pageData)
  console.log('\n✅ Pricing page seeded successfully')
}

main().catch(err => {
  console.error('❌ Fatal:', err.message)
  process.exit(1)
})
