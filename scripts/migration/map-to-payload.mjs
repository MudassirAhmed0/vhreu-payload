#!/usr/bin/env node
/**
 * Maps scraped vehiclehistory.eu content → Payload CMS block structures.
 * Reads scraped-content.json and outputs migration-ready Payload block data.
 *
 * Usage:
 *   node scripts/map-to-payload.mjs                         # all pages, pretty print
 *   node scripts/map-to-payload.mjs --page /                # homepage only
 *   node scripts/map-to-payload.mjs --page /contact-us      # contact only
 *   node scripts/map-to-payload.mjs --out payload-blocks.json
 */

import { readFileSync, writeFileSync } from 'fs'

const BASE = 'https://vehiclehistory.eu'
// Prefer improvised content (stage 2 output), fall back to raw scraped
let SCRAPED
try {
  SCRAPED = JSON.parse(readFileSync('improvised-content.json', 'utf8'))
  console.log('Using improvised content (stage 2)\n')
} catch {
  SCRAPED = JSON.parse(readFileSync('scraped-content.json', 'utf8'))
  console.log('Using raw scraped content (no improvisation found)\n')
}

// ── helpers ─────────────────────────────────────────────────────────

/** Get improvised field or fall back to scraped value */
function imp(section, field, fallback = null) {
  return section._improvised?.[field] ?? fallback
}

/** Get improvised heading or apply highlight to raw heading */
function impHeading(section, rawHeading) {
  return imp(section, 'heading') || rawHeading || ''
}

/** Get improvised description or first paragraph */
function impDesc(section) {
  return imp(section, 'description') || section.paragraphs[0] || null
}

function findLink(links, textPattern) {
  return links.find(l =>
    typeof textPattern === 'string'
      ? l.text.toLowerCase().includes(textPattern.toLowerCase())
      : textPattern.test(l.text)
  )
}

function findHeading(headings, level) {
  return headings.find(h => h.level === level)
}

function findHeadingByText(headings, textPattern) {
  return headings.find(h =>
    typeof textPattern === 'string'
      ? h.text.toLowerCase().includes(textPattern.toLowerCase())
      : textPattern.test(h.text)
  )
}

function makeFeature(icon, text, href = null, rel = null, newTab = false) {
  const feature = {
    icon: { source: 'preset', preset: icon },
    text,
    tag: 'span',
  }
  if (href) {
    feature.href = href
    if (rel) feature.rel = rel
    if (newTab) feature.newTab = newTab
  }
  return feature
}

function makeCta(label, href, style = 'primary', rel = 'none', newTab = false) {
  return { label, href, style, rel, newTab }
}

function makeHelperLink(label, href, style = 'arrow', icon = null, rel = 'none', newTab = false) {
  const link = { label, href, style, rel, newTab }
  if (icon) link.icon = icon
  return link
}

// ── page mappers ────────────────────────────────────────────────────

function mapHomepage(page) {
  const hero = page.sections[0]
  const h1 = findHeading(hero.headings, 'h1')
  const desc = hero.paragraphs[0] || ''
  const sampleLink = findLink(hero.links, 'sample report')
  const coverageLink = findLink(hero.links, 'coverage')

  const blocks = []

  // ── HERO ──
  blocks.push({
    blockType: 'page-hero',
    variant: 'split',
    dark: true,
    fullHeight: true,
    glow: false,
    formType: 'vin',
    tag: imp(hero, 'tagline', 'Trusted by Thousands Across Europe'),
    tagLevel: imp(hero, 'tagLevel', 'span'),
    title: impHeading(hero, 'European VIN Check **EU VIN Lookup**'),
    description: impDesc(hero) || desc,
    heroImage: '(upload: report-preview mockup — 580×660)',
    helperLinks: [
      makeHelperLink(
        'View Sample Report',
        sampleLink?.href || '/sample-report',
        'arrow',
        null,
        'none',
        sampleLink?.newTab || false
      ),
      makeHelperLink(
        'Pan-European Coverage',
        coverageLink?.href || '#country-coverage',
        'pill',
        'globe',
        'none',
        false
      ),
    ],
    features: [
      makeFeature('circle-check', 'Reliable'),
      makeFeature('circle-check', 'Detailed'),
      makeFeature('circle-check', 'Accurate'),
      makeFeature('circle-check', 'Affordable'),
    ],
    _source: { url: page.url, section: 1 },
  })

  // ── SECTION 2: Problem & Stats ──
  // Split-content owns everything — section is just a shell
  const s2 = page.sections[1]
  const statLines = s2.paragraphs.filter(p => /\d+%|\d+ in \d+/.test(p))
  const s2Desc = s2.paragraphs[0] || ''
  const s2SampleLink = findLink(s2.links, 'sample')
  const s2CheckLink = findLink(s2.links, /check|vehicle history/i)
  blocks.push({
    blockType: 'section',
    bg: 'white',
    scene: 'default',
    content: [{
      blockType: 'split-content',
      tag: imp(s2, 'tagline') || null,
      heading: impHeading(s2, s2.headings[0]?.text?.replace(/(Costly Mistakes)/, '**$1**') || 'Save Money and Avoid **Costly Mistakes**'),
      headingLevel: 'h2',
      mediaType: 'image',
      media: null, // will be patched with media ID after seed
      description: s2Desc,
      listItems: statLines.map(text => ({
        icon: { source: 'preset', preset: 'triangle-alert' },
        text,
        variant: 'danger',
      })),
      ctas: [
        makeCta('View Sample', s2SampleLink?.href || '/sample-report', 'secondary'),
        makeCta('Check Vehicle History!', '/#vin-form', 'primary'),
      ],
    }],
    _source: { url: page.url, section: 2 },
  })

  // ── SECTION 3: What is a VIN ──
  // Split-content owns everything — section is just a shell
  const s3 = page.sections[2]
  blocks.push({
    blockType: 'section',
    bg: 'white',
    scene: 'default',
    content: [{
      blockType: 'split-content',
      tag: imp(s3, 'tagline') || null,
      heading: impHeading(s3, s3.headings[0]?.text?.replace(/(VIN Number)/, '**$1**') || 'What is a **VIN Number**?'),
      headingLevel: 'h2',
      mediaType: 'vin-structure',
      reverse: true,
      description: s3.paragraphs.join('\n\n') || null,
    }],
    _source: { url: page.url, section: 3 },
  })

  // ── SECTION 4: Why VIN Check — 6 icon cards with descriptions ──
  const s4 = page.sections[3]
  const s4Icons = ['eye', 'shield-check', 'gauge', 'file-text', 'triangle-alert', 'lock']
  const s4Descs = [
    "1 in 3 used cars has a hidden problem. A European VIN check provides detailed information about a car's past, including accidents, repairs, or ownership changes, ensuring you're not blindsided by undisclosed issues.",
    "A car's accident history can reveal whether a car has undergone major repairs that might compromise its safety or performance. A VIN check helps you avoid vehicles with serious damage.",
    "Odometer tampering is common with up to 30% of European used cars with tampered odometers. A VIN check uncovers inconsistencies in mileage records, protecting you from paying more for a vehicle with manipulated mileage.",
    "A VIN number check verifies that the vehicle's title is clean and free from issues like salvage or rebuilt titles, which could affect the car's value and insurability.",
    "About 10% of vehicles on European roads have unresolved recall issues. A VIN check ensures you're aware of any unresolved recalls, enabling you to address safety concerns before purchasing a car.",
    "EU police recorded an average of 697,000 vehicle thefts between 2015 to 2017. Checking the VIN against international databases helps confirm the vehicle hasn't been reported as stolen, saving you from legal troubles or losing the car.",
  ]
  const s4Titles = s4.headings.filter(h => h.level === 'h3')
  blocks.push({
    blockType: 'section',
    bg: 'muted',
    scene: 'default',
    heading: s4.headings[0]?.text?.replace(/(European VIN Number Check)/, '**$1**') || '',
    headingLevel: 'h2',
    description: s4.paragraphs[0] || null,
    content: [{
      blockType: 'card-grid',
      columns: '3',
      tabletColumns: '2',
      mobileColumns: '1',
      cards: s4Titles.map((h, i) => ({
        cardType: 'feature',
        style: 'icon',
        layout: 'stacked',
        icon: { source: 'preset', preset: s4Icons[i] || 'shield-check' },
        title: h.text,
        titleElement: 'h3',
        contentType: 'description',
        description: s4Descs[i] || null,
      })),
    }],
    _source: { url: page.url, section: 4 },
  })

  // ── SECTION 5: How-To Steps ──
  const s5 = page.sections[4]
  const homeSteps = [
    { title: 'Enter VIN', desc: 'Enter the 17-digit VIN into the VIN search form at the top.', icon: 'search' },
    { title: 'Provide Details', desc: 'Provide your email and phone number so we can deliver your report securely.', icon: 'mail' },
    { title: 'Start the Check', desc: 'Click "Check Vehicle History" to start the process.', icon: 'mouse-pointer-click' },
    { title: 'Review Report', desc: "Review the detailed report to understand the car's history, usage, and condition.", icon: 'file-text' },
    { title: 'Decide with Confidence', desc: 'Make an informed decision before buying or selling the vehicle.', icon: 'circle-check' },
  ]
  blocks.push({
    blockType: 'section',
    bg: 'dark',
    scene: 'default',
    heading: s5.headings[0]?.text?.replace(/(European VIN Check)/, '**$1**') || '',
    headingLevel: 'h2',
    content: [{
      blockType: 'steps',
      style: 'icons',
      steps: homeSteps.map(s => ({
        title: s.title,
        description: s.desc,
        icon: { source: 'preset', preset: s.icon },
      })),
    }],
    _source: { url: page.url, section: 5 },
  })

  // ── SECTION 6: Buyers vs Resellers — 2 cards with icon-lists ──
  const s6 = page.sections[5]
  /** Build a richText item with "Bold: rest of text" as a single paragraph with <strong> */
  function boldPrefixItem(text) {
    const idx = text.indexOf(':')
    if (idx === -1) return { description: text }
    const bold = text.slice(0, idx).trim()
    const rest = text.slice(idx + 1).trim()
    // Return as description string — the seed sanitizer will convert to Lexical
    // But we need bold formatting, so build Lexical directly
    return {
      description: {
        root: {
          type: 'root', direction: 'ltr', format: '', indent: 0, version: 1,
          children: [{
            type: 'paragraph', direction: 'ltr', format: '', indent: 0, version: 1, textFormat: 0, textStyle: '',
            children: [
              { type: 'text', text: bold + ': ', format: 1, version: 1, detail: 0, mode: 'normal', style: '' },
              { type: 'text', text: rest, format: 0, version: 1, detail: 0, mode: 'normal', style: '' },
            ],
          }],
        },
      },
    }
  }
  const buyerItems = [
    'Avoid Scams: Know the real story of the car before purchase.',
    'Check Ownership: Find out how many people owned the car.',
    "Accident Records: Ensure the vehicle wasn't severely damaged.",
    'Mileage Accuracy: Spot tampered odometers, avoid odometer fraud easily.',
    'Service Records: Confirm the car has been well-maintained.',
    "Theft History: Ensure the car isn't flagged as stolen.",
  ]
  const dealerItems = [
    "Build Trust: Show potential buyers the car's complete history.",
    'Highlight Value: Use car title and condition to increase appeal.',
    'Close Sales Faster: Provide detailed reports to eliminate buyer doubts.',
    'Compliance: Ensure vehicles meet EU legal requirements for sale.',
    'Better resale value: Shows servicing, set fair, market-aligned prices.',
    'Boost reputation: Establish trustworthiness, attracting repeat customers and referrals.',
  ]
  blocks.push({
    blockType: 'section',
    bg: 'white',
    scene: 'default',
    heading: s6.headings[0]?.text || '',
    headingLevel: 'h2',
    content: [{
      blockType: 'card-grid',
      columns: '2',
      tabletColumns: '2',
      mobileColumns: '1',
      cards: [
        {
          cardType: 'feature',
          style: 'none',
          layout: 'stacked',
          title: 'For Car Buyers',
          titleElement: 'h3',
          listIcon: { source: 'preset', preset: 'circle-check' },
          listVariant: 'success',
          listItemStyle: 'flat',
          items: buyerItems.map(boldPrefixItem),
        },
        {
          cardType: 'feature',
          style: 'none',
          layout: 'stacked',
          title: 'For Dealerships and Resellers',
          titleElement: 'h3',
          listIcon: { source: 'preset', preset: 'circle-check' },
          listVariant: 'success',
          listItemStyle: 'flat',
          items: dealerItems.map(boldPrefixItem),
        },
      ],
    }],
    _source: { url: page.url, section: 6 },
  })

  // ── SECTION 7: Report Contents — 5 cards with list items on dark ──
  const s7 = page.sections[6]
  const reportCards = [
    { title: 'Detailed Vehicle Specification', items: ['General specification', 'Number of doors and seats', 'Body type', 'Engine type', 'Fuel type', 'Displacement information', 'Gearbox type'] },
    { title: 'Auction Records', items: ['Sales status and history', 'Engine status (Runs and drives, engine starts, and car keys status)', 'Auction type, date and location, type of seller'] },
    { title: 'Title and Condition', items: ['Title brand (clean, salvage, etc)', 'Title Description', 'Damage (Primary and secondary)'] },
    { title: 'Technical Specs', items: ['Odometer on title', 'Average estimated retail value', 'Vehicle color', 'Transmission', 'Estimated repair cost', 'Damage ratio', 'Estimated retail value'] },
    { title: 'Theft Records (Stolen Check)', items: ['Reported as Stolen', 'Stolen Date', 'Location', 'License Plate', 'Color'] },
  ]
  blocks.push({
    blockType: 'section',
    bg: 'dark',
    scene: 'default',
    heading: s7.headings[0]?.text?.replace(/(Europe Vehicle History Report)/, '**$1**') || '',
    headingLevel: 'h2',
    content: [{
      blockType: 'card-grid',
      columns: '3',
      tabletColumns: '2',
      mobileColumns: '1',
      cards: reportCards.map(c => ({
        cardType: 'feature',
        style: 'none',
        layout: 'inline',
        title: c.title,
        titleElement: 'h3',
        contentType: 'list',
        listIcon: { source: 'preset', preset: 'circle-check' },
        listVariant: 'success',
        listItemStyle: 'flat',
        items: c.items.map(text => ({ title: text, titleElement: 'p' })),
      })),
    }],
    _source: { url: page.url, section: 7 },
  })

  // ── SECTION 8: Comparison Table ──
  const s8 = page.sections[7]
  // c = check, x = x, r = richtext
  const tableRows = [
    { cells: [{ type: 'richtext', content: 'Features' }, { type: 'richtext', content: 'VHR.eu' }, { type: 'richtext', content: 'Carfax' }, { type: 'richtext', content: 'AutoDNA' }] },
    { cells: [{ type: 'richtext', content: 'Sales History' }, { type: 'check' }, { type: 'check' }, { type: 'check' }] },
    { cells: [{ type: 'richtext', content: 'Accident Records' }, { type: 'check' }, { type: 'check' }, { type: 'check' }] },
    { cells: [{ type: 'richtext', content: 'Auction Records (NA)' }, { type: 'check' }, { type: 'x' }, { type: 'x' }] },
    { cells: [{ type: 'richtext', content: 'Mileage Verification' }, { type: 'richtext', content: 'Included' }, { type: 'richtext', content: 'Included' }, { type: 'richtext', content: 'Included' }] },
    { cells: [{ type: 'richtext', content: 'Auction History & Photos' }, { type: 'richtext', content: 'Detailed' }, { type: 'x' }, { type: 'check' }] },
    { cells: [{ type: 'richtext', content: 'Theft Records' }, { type: 'richtext', content: 'Recent' }, { type: 'check' }, { type: 'check' }] },
    { cells: [{ type: 'richtext', content: 'Free VIN Lookup' }, { type: 'richtext', content: 'Included' }, { type: 'richtext', content: 'Paid Only' }, { type: 'richtext', content: 'Included' }] },
    { cells: [{ type: 'richtext', content: 'Cost per report' }, { type: 'richtext', content: '€4.99' }, { type: 'richtext', content: '€39.99' }, { type: 'richtext', content: '€19.90' }] },
    { cells: [{ type: 'richtext', content: 'Report Expiration' }, { type: 'richtext', content: 'No' }, { type: 'richtext', content: 'Yes (30 days)' }, { type: 'richtext', content: 'Yes (12 days)' }] },
  ]
  blocks.push({
    blockType: 'section',
    bg: 'white',
    scene: 'default',
    heading: s8.headings[0]?.text?.replace(/(Competitors)/, '**$1**') || '',
    headingLevel: 'h2',
    description: s8.paragraphs[0] || null,
    content: [{
      blockType: 'comparison-table',
      stickyFirstColumn: true,
      highlightColumn: 2,
      rows: tableRows,
    }],
    _source: { url: page.url, section: 8 },
  })

  // ── SECTION 9: Why Choose Us — 6 icon cards with descriptions ──
  const s9 = page.sections[8]
  const s9Icons = ['zap', 'database', 'wrench', 'wallet', 'globe', 'headphones']
  const s9Data = [
    { title: 'Fast and Reliable Reports', desc: 'Access your report instantly with a user-friendly experience and up-to-date information.' },
    { title: 'Trusted European Databases', desc: 'Our data comes directly from reliable sources across Europe, ensuring accuracy.' },
    { title: 'Easy-to-Use Tools', desc: 'Simply enter the VIN, and our system does the rest in seconds.' },
    { title: 'Affordable Options', desc: 'Choose between free basic checks or detailed premium reports for full insights.' },
    { title: 'Multilingual Support', desc: 'Available in multiple languages to cater to all European users.' },
    { title: '24/7 Customer Service', desc: 'Get issues resolved on time. Make informed decisions without delay.' },
  ]
  blocks.push({
    blockType: 'section',
    bg: 'white',
    scene: 'default',
    heading: s9.headings[0]?.text?.replace(/(EU VIN Decoder)/, '**$1**') || '',
    headingLevel: 'h2',
    content: [{
      blockType: 'card-grid',
      columns: '3',
      tabletColumns: '2',
      mobileColumns: '1',
      cards: s9Data.map((c, i) => ({
        cardType: 'feature',
        style: 'icon',
        layout: 'stacked',
        icon: { source: 'preset', preset: s9Icons[i] || 'circle' },
        title: c.title,
        titleElement: 'h3',
        contentType: 'description',
        description: c.desc,
      })),
    }],
    _source: { url: page.url, section: 9 },
  })

  // ── SECTION 10: Country Coverage ──
  const s10 = page.sections[9]
  blocks.push({
    blockType: 'section',
    bg: 'white',
    scene: 'default',
    sectionId: 'country-coverage',
    heading: s10.headings[0]?.text?.replace(/(by Country)/, '**$1**') || '',
    headingLevel: 'h2',
    description: s10.paragraphs[0] || null,
    content: [{
      blockType: 'pill-grid',
      items: s10.links.map(l => ({ label: l.text, href: l.href })),
    }],
    _source: { url: page.url, section: 10 },
  })

  // ── SECTION 11: Vehicle Makes ──
  const s11 = page.sections[10]
  blocks.push({
    blockType: 'section',
    bg: 'muted',
    scene: 'default',
    heading: s11.headings[0]?.text?.replace(/(by Makes)/, '**$1**') || '',
    headingLevel: 'h2',
    description: s11.paragraphs[0] || null,
    content: [{
      blockType: 'link-card-grid',
      columns: '5',
      tabletColumns: '3',
      mobileColumns: '2',
      size: 'regular',
      items: s11.links.map(l => ({ label: l.text, href: l.href })),
    }],
    _source: { url: page.url, section: 11 },
  })

  // ── SECTION 12: Blog (deferred) ──
  blocks.push({
    blockType: 'section',
    bg: 'white',
    heading: 'Blog',
    headingLevel: 'h2',
    content: [{ blockType: 'blog-grid', _note: 'Deferred — needs Posts API' }],
    _source: { url: page.url, section: 12 },
  })

  // ── SECTION 13: FAQ ──
  const s13 = page.sections[12]
  const faqHeadings = s13.headings.filter(h => h.level === 'h3' || h.level === 'h4')
  blocks.push({
    blockType: 'section',
    bg: 'white',
    scene: 'default',
    narrow: true,
    heading: 'Frequently Asked **Questions**',
    headingLevel: 'h2',
    content: [{
      blockType: 'faqs',
      items: faqHeadings.map(h => ({
        question: h.text,
        answer: '(extract from scraped paragraphs)',
      })),
    }],
    _source: { url: page.url, section: 13 },
  })

  return { page: '/', slug: 'home', title: page.pageTitle, blocks }
}

function mapPricing(page) {
  const hero = page.sections[0]
  const blocks = []

  blocks.push({
    blockType: 'page-hero',
    variant: 'centered',
    dark: true,
    fullHeight: false,
    glow: false,
    formType: 'none',
    tag: 'Simple, Transparent Pricing',
    tagLevel: 'span',
    title: 'Detailed Report at **Affordable Pricing**',
    description: hero.paragraphs[0] || '',
    bullets: [
      { text: 'Detailed Vehicle History', tag: 'span' },
      { text: 'Best Value for Money', tag: 'span' },
      { text: '33% Cheaper Than Carfax', tag: 'span' },
    ],
    _source: { url: page.url, section: 1 },
  })

  // Pricing cards section
  const s2 = page.sections[1]
  blocks.push({
    blockType: 'section',
    bg: 'white',
    scene: 'default',
    content: [{
      blockType: 'card-grid',
      columns: '3',
      tabletColumns: '2',
      mobileColumns: '1',
      cards: s2.headings.filter(h => h.level === 'h3').map(h => ({
        cardType: 'feature',
        style: 'stat',
        title: h.text,
        titleElement: 'h3',
        contentType: 'list',
      })),
      _note: 'Pricing cards — may need pricing-grid block for per-credit display',
    }],
    _source: { url: page.url, section: 2 },
  })

  // Trust section
  const s3 = page.sections[2]
  blocks.push({
    blockType: 'section',
    bg: 'muted',
    scene: 'default',
    heading: s3.headings[0]?.text || '',
    headingLevel: 'h2',
    description: s3.paragraphs[0] || null,
    content: [{
      blockType: 'card-grid',
      columns: '3',
      tabletColumns: '3',
      mobileColumns: '1',
      cards: s3.headings.filter(h => h.level === 'h3').map(h => ({
        cardType: 'feature',
        style: 'icon',
        layout: 'centered',
        title: h.text,
        titleElement: 'h3',
        contentType: 'description',
      })),
    }],
    _source: { url: page.url, section: 3 },
  })

  // How it works
  const s4 = page.sections[3]
  // Steps are in Elementor widgets — scraper can't reach them, use WebFetch data
  const pricingSteps = s4.paragraphs.length >= 2
    ? s4.paragraphs.filter(p => p.length > 10 && p.length < 300)
    : [
        'Obtain the Vehicle Identification Number (VIN) of the vehicle you are interested in. One can usually find the VIN on the dashboard when looking through the driver side of the windshield.',
        'Our VIN Check will inform you of the Number of Records we have for that particular Vehicle.',
        "You're given the Opportunity to purchase a Report for this one car or a Package for multiple cars at a Discounted Price.",
        'Your reports will never expire and will be visible through your personal login.',
      ]
  blocks.push({
    blockType: 'section',
    bg: 'dark',
    scene: 'default',
    heading: s4.headings[0]?.text?.replace(/(lifetime access)/, '**$1**') || '',
    headingLevel: 'h2',
    content: [{
      blockType: 'steps',
      style: 'numbers',
      steps: pricingSteps.map((text, i) => ({
        description: text,
        icon: { source: 'preset', preset: ['search', 'file-text', 'credit-card', 'lock'][i] || 'circle' },
      })),
    }],
    _source: { url: page.url, section: 4 },
  })

  // FAQ
  const s5 = page.sections[4]
  blocks.push({
    blockType: 'section',
    bg: 'white',
    scene: 'default',
    narrow: true,
    heading: 'Any **Questions**?',
    headingLevel: 'h2',
    content: [{
      blockType: 'faqs',
      items: s5.headings.filter(h => h.level !== 'h2').map(h => ({
        question: h.text,
        answer: '(extract from scraped paragraphs)',
      })),
    }],
    _source: { url: page.url, section: 5 },
  })

  // Sample report CTA
  const s6 = page.sections[5]
  if (s6) {
    const sampleLink = findLink(s6.links, 'sample') || findLink(s6.links, 'report')
    blocks.push({
      blockType: 'cta-banner',
      layout: 'contained',
      dark: true,
      mode: 'link',
      heading: s6.headings[0]?.text || 'View a **Sample Report**',
      headingLevel: 'h2',
      ctas: sampleLink ? [makeCta(sampleLink.text, sampleLink.href, 'primary')] : [],
      _source: { url: page.url, section: 6 },
    })
  }

  return { page: '/pricing', slug: 'pricing', title: page.pageTitle, blocks }
}

function mapSampleReport(page) {
  const hero = page.sections[0]
  const blocks = []

  // ── HERO — centered with VIN form ──
  blocks.push({
    blockType: 'page-hero',
    variant: 'centered',
    dark: true,
    fullHeight: false,
    glow: false,
    formType: 'vin',
    tag: imp(hero, 'tagline', 'See Before You Buy'),
    tagLevel: imp(hero, 'tagLevel', 'span'),
    title: impHeading(hero, 'Get a Peek at Our **Premium Reports**'),
    description: hero.paragraphs[0] || null,
    _source: { url: page.url, section: 1 },
  })

  // ── SAMPLE REPORT CARDS — dedicated component ──
  blocks.push({
    blockType: 'section',
    bg: 'white',
    scene: 'default',
    content: [{
      blockType: 'sample-report-grid',
      reports: [
        {
          year: 2006,
          make: 'Toyota',
          model: 'Corolla Verso',
          vin: 'NMTER16RX0R073590',
          bodyStyle: '4 Doors Minivan',
          engine: '1.8L L4 DOHC AWD',
          country: 'Turkey',
          href: '/report/vin/NMTER16RX0R073590',
        },
        {
          year: 2005,
          make: 'Renault',
          model: 'Clio',
          vin: 'VF15RE20A55268448',
          bodyStyle: '4 Doors Hatchback',
          engine: '2.0L FWD',
          country: 'France',
          href: '/report/vin/VF15RE20A55268448',
        },
      ],
    }],
    _source: { url: page.url, section: 2 },
  })

  // ── DID YOU KNOW — stat callout banner ──
  blocks.push({
    blockType: 'cta-banner',
    layout: 'contained',
    dark: true,
    mode: 'link',
    tag: 'Did you know?',
    heading: 'Over 73% of cars imported to Europe between 2011 and 2021 in ten countries had **salvage titles**',
    headingLevel: 'h2',
    _source: { url: page.url, section: 3 },
  })

  // ── WHAT TO EXPECT — description + feature cards + bottom text ──
  const s4 = page.sections[3]
  blocks.push({
    blockType: 'section',
    bg: 'white',
    scene: 'default',
    heading: impHeading(s4, 'What to Expect in a **Premium Report** from Vehicle History'),
    headingLevel: 'h2',
    description: "A vehicle history report from Vehicle History provides information about your vehicle from records and databases nationwide. In our reports, you can find essential information a car owner must be aware of before a vehicle is purchased from a dealership. With a free VIN check from Vehicle History, you can uncover every hidden detail about any vehicle and walk out of that dealership with a reliable vehicle.\n\nBelow are examples of some of the details you will be granted access to with a report from Vehicle History:",
    content: [{
      blockType: 'link-card-grid',
      columns: '3',
      tabletColumns: '2',
      mobileColumns: '2',
      items: [
        { label: 'Vehicle History' },
        { label: 'Vehicle Specifications' },
        { label: 'Auction Records with Images' },
        { label: 'Lien and Loan Records' },
        { label: 'Salvage, Junk, or Rebuilt Records' },
        { label: 'Theft Records' },
      ],
    }],
    bottomText: "With a vehicle history report from Vehicle History, you gain access to expert knowledge that a dealer in Europe may not hand over to you, and all that is required is the vehicle's VIN number.",
    ctas: [makeCta('Check Your VIN Now', '/#vin-form', 'primary')],
    _source: { url: page.url, section: 4 },
  })

  return { page: '/sample-report', slug: 'sample-report', title: page.pageTitle, blocks }
}

function mapWindowSticker(page) {
  const hero = page.sections[0]
  const blocks = []

  blocks.push({
    blockType: 'page-hero',
    variant: 'centered',
    dark: true,
    fullHeight: false,
    glow: false,
    formType: 'vin',
    tag: 'Original Factory Specifications',
    tagLevel: 'span',
    title: "Look Up a Vehicle's **Original Window Sticker** Online",
    description: hero.paragraphs[0] || '',
    features: [
      makeFeature('file-text', 'Factory Specs'),
      makeFeature('list', 'Equipment Lists'),
      makeFeature('tag', 'Original MSRP'),
      makeFeature('zap', 'Instant Results'),
    ],
    _source: { url: page.url, section: 1 },
  })

  // What is it — split-content (text left, sticker image right)
  const s2 = page.sections[1]
  blocks.push({
    blockType: 'section',
    bg: 'white',
    scene: 'default',
    content: [{
      blockType: 'split-content',
      tag: imp(s2, 'tagline') || null,
      heading: impHeading(s2, s2.headings[0]?.text?.replace(/(Window Sticker by VIN)/, '**$1**') || ''),
      headingLevel: 'h2',
      mediaType: 'image',
      media: null, // needs window sticker sample image uploaded
      description: s2.paragraphs.join('\n\n'),
    }],
    _source: { url: page.url, section: 2 },
  })

  // Details you can find — 6 cards with descriptions + list items
  const s3 = page.sections[2]
  const detailCards = [
    { title: 'Vehicle Description', icon: 'car', desc: 'This part tells you exactly what the car is, in plain factory terms, including the model year, make, model/derivative, engine line, gearbox, and the VIN.', items: [
      { title: 'Vehicle year, make, and model', description: "Shows the official year, manufacturer, and model name so you can confirm you're looking at the right vehicle and not a similar version with a different spec." },
      { title: 'Trim level and body style', description: 'Lists the specific trim/derivative and body style where available. This helps you understand the equipment level and why two "same model" cars can be priced differently.' },
      { title: 'Vehicle Identification Number (VIN)', description: 'Displays the VIN used for the lookup. This ties our original window sticker by VIN to that exact vehicle, so you can cross-check it against the VIN on the car or documents.' },
    ]},
    { title: 'Standard Equipment', icon: 'list', desc: 'Knowing this, you can instantly see what the car was supposed to include from the factory, without relying on memory or brochure hunting.', items: [
      { title: 'Core comfort and convenience features', description: 'Shows the day-to-day features that typically come standard on that trim level, making it easier to understand what "normal spec" looks like.' },
      { title: 'Safety basics', description: 'Includes basic safety and driver support items when present in the record, so you can confirm what safety equipment should be on the car.' },
    ]},
    { title: 'Optional Equipment', icon: 'wrench', desc: 'The window sticker lists the recorded factory-fitted upgrades and packages that were not standard, like tech features, comfort upgrades, or trim enhancements.', items: [
      { title: 'Factory option packages', description: 'Packages bundle upgrades together (tech packs, comfort packs, appearance packs) — useful for confirming the car has the spec you expect.' },
      { title: 'Individual add-on options', description: 'Shows the available single options added to the vehicle, like upgraded seats, lighting, wheels.' },
      { title: 'Trim-level additions', description: 'Some trims come with factory upgrades not found on the base model.' },
    ]},
    { title: 'Pricing Information', icon: 'tag', desc: 'When available in the record, the original MSRP helps you understand what the vehicle was worth new.', items: [
      { title: 'Base MSRP', description: 'The starting price of the vehicle before any options or packages were added.' },
      { title: 'Options pricing', description: 'Individual prices for factory-installed options and packages when available in the record.' },
      { title: 'Total MSRP', description: "The final manufacturer's suggested retail price including all options and destination charges." },
    ]},
    { title: 'Technical Specifications', icon: 'gauge', desc: 'Core vehicle specs like engine type, displacement, transmission, drivetrain, fuel type, and emission standards.', items: [
      { title: 'Engine and performance', description: 'Engine size, type, horsepower, and torque figures when available in the factory record.' },
      { title: 'Fuel economy and emissions', description: 'Official fuel consumption figures (city/highway/combined) and CO₂ emissions per Euro standards.' },
    ]},
    { title: 'Safety Ratings', icon: 'shield-check', desc: 'When present in records, safety ratings from Euro NCAP or other testing organizations provide independent assessment of crash protection.', items: [
      { title: 'Crash test results', description: 'Overall safety rating and specific scores for adult occupant, child occupant, pedestrian, and safety assist.' },
    ]},
  ]
  blocks.push({
    blockType: 'section',
    bg: 'muted',
    scene: 'default',
    heading: s3.headings[0]?.text?.replace(/(Factory Window Sticker)/, '**$1**') || '',
    headingLevel: 'h2',
    description: s3.paragraphs[0] || null,
    content: [{
      blockType: 'card-grid',
      columns: '3',
      tabletColumns: '2',
      mobileColumns: '1',
      cards: detailCards.map(c => ({
        cardType: 'feature',
        style: 'icon',
        layout: 'inline',
        icon: { source: 'preset', preset: c.icon },
        title: c.title,
        titleElement: 'h3',
        contentType: 'list',
        listIcon: { source: 'preset', preset: 'circle-check' },
        listVariant: 'success',
        listItemStyle: 'flat',
        description: c.desc,
        items: c.items.map(item => ({
          title: item.title,
          titleElement: 'h4',
          description: item.description,
        })),
      })),
    }],
    _source: { url: page.url, section: 3 },
  })

  // Who benefits — 3 cards with descriptions + list items
  const s4 = page.sections[3]
  const benefitCards = [
    { title: 'Used Car Buyers', icon: 'user', desc: "Buying used in Europe can feel like decoding a puzzle. A car window sticker lookup shows what the vehicle originally came with, so you can compare the ad to the factory record and ask smarter questions before you travel, pay a deposit, or sign anything.", items: [
      { title: 'Identify hidden damages before purchase', description: 'A window sticker helps you spot red flags by showing what should be there. Missing equipment, swapped trims, or "wrong spec" claims can hint at past repairs or a rough history.' },
      { title: 'Support smarter negotiation', description: 'Factory options and original specs give you a factual base for negotiation, instead of arguing over opinions or sales talk.' },
      { title: 'Compare two similar cars fairly', description: 'Two cars can look identical, but the sticker shows what separates them by looking at the packages, equipment, and specs information.' },
    ]},
    { title: 'Sellers & Dealers', icon: 'building', desc: "If you sell cars in Europe, buyers may ask the same questions again and again about the trim, packages, and specs. A window sticker lookup gives you a clean, shareable answer, so your listing feels more trustworthy and less like a negotiation trap.", items: [
      { title: "Verify a vehicle's value", description: "Showing factory options and the original spec helps justify your price. It's easier to defend value when the equipment list backs it up." },
      { title: 'Stand out in crowded marketplaces', description: 'In many European markets, detailed listings win. A sticker gives you instant detail without sounding salesy.' },
      { title: 'Speed up the sales process', description: 'Clear info reduces delays, fewer misunderstandings, and fewer "let me confirm and get back to you" moments.' },
    ]},
    { title: 'Automotive Enthusiasts & Collectors', icon: 'star', desc: "Collectors in Europe care about authenticity. An original window sticker by VIN can help confirm how the car was built when new, what options it had, and whether it's truly a rare spec. For restorations, resale, or just peace of mind, factory details matter more than stories.", items: [
      { title: 'Confirm originality for concours or shows', description: 'A factory equipment record helps prove the car is presented in its correct original configuration, not just "close enough."' },
      { title: 'Verify rare factory options', description: 'Collectors pay for rarity. The sticker can confirm special packages or equipment tied to that VIN.' },
      { title: 'Reduce uncertainty on classic purchases', description: 'For older cars that still have retrievable records, a sticker report can reduce the "unknown spec" concern.' },
    ]},
  ]
  blocks.push({
    blockType: 'section',
    bg: 'white',
    scene: 'default',
    heading: s4.headings[0]?.text?.replace(/(Window Sticker)/, '**$1**') || '',
    headingLevel: 'h2',
    description: s4.paragraphs[0] || null,
    content: [{
      blockType: 'card-grid',
      columns: '3',
      tabletColumns: '2',
      mobileColumns: '1',
      cards: benefitCards.map(c => ({
        cardType: 'feature',
        style: 'icon',
        layout: 'inline',
        icon: { source: 'preset', preset: c.icon },
        title: c.title,
        titleElement: 'h3',
        contentType: 'list',
        listIcon: { source: 'preset', preset: 'circle-check' },
        listVariant: 'success',
        listItemStyle: 'flat',
        description: c.desc,
        items: c.items.map(item => typeof item === 'string'
          ? { title: item, titleElement: 'h4' }
          : { title: item.title, titleElement: 'h4', description: item.description }
        ),
      })),
    }],
    _source: { url: page.url, section: 4 },
  })

  // How to — 3 steps with real descriptions
  const s5 = page.sections[4]
  const wsSteps = [
    { title: 'Find the VIN', desc: 'Look for the VIN on the vehicle. Then, examine the official documentation or insurance paperwork.', icon: 'search' },
    { title: 'Fill out the form', desc: 'Type or copy the VIN into the form. Make sure you entered the correct VIN. Submit it to begin the process.', icon: 'credit-card' },
    { title: 'Review the sticker details', desc: 'In seconds, you will see the free preview with the basic details. Proceed to payment and receive your detailed window sticker, complete with all the information you need.', icon: 'download' },
  ]
  blocks.push({
    blockType: 'section',
    bg: 'dark',
    scene: 'default',
    heading: s5.headings[0]?.text?.replace(/(Window Sticker by VIN)/, '**$1**') || '',
    headingLevel: 'h2',
    description: s5.paragraphs[0] || null,
    content: [{
      blockType: 'steps',
      style: 'icons',
      steps: wsSteps.map(s => ({
        title: s.title,
        description: s.desc,
        icon: { source: 'preset', preset: s.icon },
      })),
      ctas: [
        makeCta('Get Window Sticker Now', '/#vin-form', 'primary'),
        makeCta('View Window Sticker Sample', '/sample-report', 'secondary'),
      ],
    }],
    _source: { url: page.url, section: 5 },
  })

  // VIN Location — 4 icon cards
  const s6 = page.sections[5]
  const vinLocations = [
    { title: 'Dashboard', icon: 'car', desc: "Look at the lower corner of the windscreen on the driver's side. Many cars have a VIN plate visible from the outside." },
    { title: "Driver's Door Area", icon: 'scan', desc: "Open the driver's door and check the door frame area. Often, there's a manufacturer's label with the VIN." },
    { title: 'Vehicle Documents', icon: 'file-text', desc: 'VINs are usually printed on registration documents, title paperwork, and many insurance cards or policy documents.' },
    { title: 'Under the bonnet', icon: 'wrench', desc: 'Some vehicles have stamped VIN locations in the engine bay, depending on make and model.' },
  ]
  blocks.push({
    blockType: 'section',
    bg: 'white',
    scene: 'default',
    heading: impHeading(s6, s6.headings[0]?.text?.replace(/(VIN Located)/, '**$1**') || ''),
    headingLevel: 'h2',
    description: s6.paragraphs[0] || null,
    content: [{
      blockType: 'card-grid',
      columns: '4',
      tabletColumns: '2',
      mobileColumns: '1',
      cards: vinLocations.map(c => ({
        cardType: 'feature',
        style: 'icon',
        layout: 'stacked',
        icon: { source: 'preset', preset: c.icon },
        title: c.title,
        titleElement: 'h3',
        contentType: 'description',
        description: c.desc,
      })),
    }],
    _source: { url: page.url, section: 6 },
  })

  // CTA
  const s7 = page.sections[6]
  blocks.push({
    blockType: 'cta-banner',
    layout: 'full',
    dark: true,
    mode: 'vin-input',
    heading: s7.headings[0]?.text?.replace(/(Window Sticker)/, '**$1**') || 'Get a **Window Sticker** for Your Vehicle Now!',
    headingLevel: 'h2',
    description: s7.paragraphs[0] || null,
    vinButtonText: 'Check Vehicle',
    _source: { url: page.url, section: 7 },
  })

  // Brands — full list from live site (scraper only gets linked ones)
  const s8 = page.sections[7]
  const wsBrands = [
    'Alfa Romeo', 'Audi', 'BMW', 'Chevrolet', 'Chrysler', 'Citroën', 'Dodge',
    'Fiat', 'Ford', 'Honda', 'Hyundai', 'Jaguar', 'Jeep', 'KIA', 'Land Rover',
    'Mazda', 'Mercedes-Benz', 'Mini', 'Nissan', 'Opel', 'Peugeot', 'Porsche',
    'Renault', 'SEAT', 'Škoda', 'Subaru', 'Toyota', 'Volkswagen', 'Volvo',
  ]
  // Use scraped links where available, otherwise just label (no href)
  const wsLinkMap = Object.fromEntries(s8.links.map(l => [l.text.toLowerCase(), l.href]))
  blocks.push({
    blockType: 'section',
    bg: 'muted',
    scene: 'default',
    heading: s8.headings[0]?.text?.replace(/(by Brand)/, '**$1**') || '',
    headingLevel: 'h2',
    description: s8.paragraphs[0] || null,
    content: [{
      blockType: 'link-card-grid',
      columns: '5',
      tabletColumns: '3',
      mobileColumns: '2',
      items: wsBrands.map(name => ({
        label: name,
        href: wsLinkMap[name.toLowerCase()] || `/window-sticker/${name.toLowerCase().replace(/\s+/g, '-')}`,
      })),
    }],
    _source: { url: page.url, section: 8 },
  })

  // FAQ
  const s9 = page.sections[8]
  if (s9) {
    blocks.push({
      blockType: 'section',
      bg: 'white',
      scene: 'default',
      narrow: true,
      heading: 'Common Questions About **Window Sticker** Lookups',
      headingLevel: 'h2',
      content: [{
        blockType: 'faqs',
        items: s9.headings.filter(h => h.level === 'h3' || h.level === 'h4').map(h => ({
          question: h.text,
          answer: '(extract from scraped content)',
        })),
      }],
      _source: { url: page.url, section: 9 },
    })
  }

  return { page: '/window-sticker', slug: 'window-sticker', title: page.pageTitle, blocks }
}

function mapContact(page) {
  const hero = page.sections[0]
  const blocks = []

  // Extract real links
  const helpDeskLink = findLink(hero.links, 'help desk')
  const faqLink = findLink(hero.links, 'faq')
  const liveChatLink = findLink(hero.links, 'live chat')
  const emailLink = findLink(hero.links, 'email') || findLink(hero.links, 'mailto')
  const phoneHeading = findHeadingByText(hero.headings, '(866)')

  blocks.push({
    blockType: 'page-hero',
    variant: 'centered',
    dark: true,
    fullHeight: false,
    glow: false,
    variant: 'split',
    formType: 'contact',
    tag: imp(hero, 'tagline', 'Got any Questions?'),
    tagLevel: imp(hero, 'tagLevel', 'h2'),
    title: impHeading(hero, '**Contact Us**'),
    description: hero.paragraphs[0] || '',
    secondaryHeading: "We'll be happy to assist you!",
    secondaryHeadingLevel: 'h3',
    ctas: [
      makeCta(
        'Help Desk',
        helpDeskLink?.href || 'https://secure.livechatinc.com/licence/10186117/v2/open_chat.cgi?groups=0',
        'primary',
        helpDeskLink?.rel || 'noopener',
        helpDeskLink?.newTab ?? true,
      ),
      makeCta(
        'FAQ',
        faqLink?.href || '/frequently-asked-questions',
        'secondary',
        faqLink?.rel || 'none',
        faqLink?.newTab ?? false,
      ),
    ],
    features: [
      makeFeature(
        'headphones',
        '24/7 Live Chat',
        liveChatLink?.href || 'https://secure.livechatinc.com/licence/10186117/v2/open_chat.cgi?groups=0',
        liveChatLink?.rel || 'noopener',
        liveChatLink?.newTab ?? true,
      ),
      makeFeature(
        'phone',
        phoneHeading?.text || '(866)-300-0554',
        'tel:+8663000554',
      ),
      makeFeature(
        'mail',
        'support@vehiclehistory.eu',
        emailLink?.href || 'mailto:support@vehiclehistory.eu',
      ),
    ],
    _source: { url: page.url, section: 1 },
  })

  // FAQ section
  const s2 = page.sections[1]
  if (s2) {
    blocks.push({
      blockType: 'section',
      bg: 'white',
      scene: 'default',
      narrow: true,
      heading: 'Frequently Asked **Questions**',
      headingLevel: 'h2',
      content: [{
        blockType: 'faqs',
        items: s2.headings.filter(h => h.level === 'h3' || h.level === 'h4').map(h => ({
          question: h.text,
          answer: '(extract from scraped content)',
        })),
      }],
      _source: { url: page.url, section: 2 },
    })
  }

  return { page: '/contact-us', slug: 'contact-us', title: page.pageTitle, blocks }
}

function mapFAQ() {
  const blocks = []

  blocks.push({
    blockType: 'section',
    bg: 'white',
    scene: 'default',
    narrow: true,
    tag: 'Help Center',
    heading: 'Frequently Asked **Questions**',
    headingLevel: 'h1',
    description: "Here are some questions Most People ask:\n\nYou can go through this section first, and if your questions remain unanswered, be sure to contact us and we will respond as soon as possible.",
    content: [{
      blockType: 'faqs',
      items: [
        { question: 'What is a VIN number?', answer: 'A Vehicle Identification Number (VIN) is a 17-character string of letters and numbers that is assigned to every vehicle during manufacture. The VIN provides access to vehicle history, year, make, model, and records. Pre-1980 vehicles have varying VIN lengths (5, 7, 13 digits, etc.).' },
        { question: 'Where can I find the VIN number?', answer: 'The VIN can be found in several locations: on the dashboard under the windshield, on the driver\'s side door by the doorpost, on the front engine block, in vehicle registration or title documents, or by contacting your dealer.' },
        { question: 'Do cars in Europe have VIN numbers?', answer: 'Yes, every European car has a 17-character VIN required by law for tracking records and registration. Pre-1980 vehicles may have shorter VINs.' },
        { question: 'How do you read a European VIN?', answer: 'The VIN character breakdown includes: first character (manufacturing location), characters 2-3 (manufacturer), characters 4-8 (vehicle specifications), character 9 (check digit), character 10 (year), character 11 (plant), characters 12-17 (serial number).' },
        { question: 'How can I find the history of my car?', answer: 'Use the car\'s VIN to generate a vehicle history report. Reports include specifications, accident history, damage records, odometer fraud detection, auction history with photos, title records, theft records, and lien information.' },
        { question: 'Why do I need a vehicle history report?', answer: 'Reports help determine vehicle reliability, performance, and dependability, enabling informed purchasing decisions.' },
        { question: 'How can I order a Vehicle History Report?', answer: 'Enter your VIN to access free specifications, then purchase a package: Basic (1 report), Platinum (5 reports), or Gold (10 reports).' },
        { question: 'How does Vehicle History get its vehicle information?', answer: 'Data comes from government agencies, insurance companies, automobile manufacturers, and other sources compiled into comprehensive reports.' },
        { question: 'Can I have my vehicle history report as a document?', answer: 'Yes, users receive lifetime access and can store reports as PDF files or receive them via email.' },
        { question: 'Can I change my VIN number?', answer: 'No, altering a VIN is illegal. The VIN remains unchanged throughout the vehicle\'s lifespan.' },
        { question: 'Is there a free way to look up VIN numbers?', answer: 'Yes, free VIN decoding provides vehicle specifications. Detailed premium reports require payment.' },
        { question: 'What does a vehicle history report from Vehicle History contain?', answer: 'Reports include specifications, accident history, damage records, odometer fraud detection, auction history with photos, title brands, theft records, and lien information.' },
      ],
    }],
  })

  return { page: '/frequently-asked-questions', slug: 'frequently-asked-questions', title: 'Frequently Asked Questions — Vehicle History Europe', blocks }
}

function mapRefund() {
  const blocks = []

  // ── Quick Contact — "Any problems?" ──
  blocks.push({
    blockType: 'contact-form',
    bg: 'muted',
    heading: 'Any Problems with Your Order?',
    description: "Let a customer service representative reach out to you and get a chance to get €50.00 worth of history report.",
  })

  // ── Refund Form ──
  blocks.push({
    blockType: 'refund-form',
    heading: 'Request a **Refund**',
    description: "Fill in the details below and we'll review your refund request.",
  })

  // ── VIN Search ──
  blocks.push({
    blockType: 'cta-banner',
    layout: 'full',
    dark: true,
    mode: 'vin-input',
    heading: 'Check Your **Vehicle History**',
    headingLevel: 'h2',
    description: null,
    vinButtonText: 'Search VIN',
  })

  return { page: '/request-a-refund', slug: 'request-a-refund', title: 'Request a Refund — Vehicle History Europe', blocks }
}

function mapLegalPage(pagePath, slug, title, heading, lastUpdated) {
  // Load scraped legal content if available
  let legalContent = null
  try {
    const legalData = JSON.parse(readFileSync('scraped-legal.json', 'utf8'))
    legalContent = legalData[slug] || null
  } catch { /* file not found */ }

  // Remove the h1 from the Lexical content since the block renders its own title
  if (legalContent?.root?.children?.[0]?.type === 'heading' && legalContent.root.children[0].tag === 'h1') {
    legalContent.root.children = legalContent.root.children.slice(1)
  }

  const blocks = []

  blocks.push({
    blockType: 'legal-content',
    title: heading,
    lastUpdated: lastUpdated || null,
    content: legalContent || '(Legal content to be added via Payload admin)',
  })

  return { page: pagePath, slug, title: `${title} — Vehicle History Europe`, blocks }
}

// ── router ──────────────────────────────────────────────────────────

const PAGE_MAPPERS = {
  '/': mapHomepage,
  '/pricing': mapPricing,
  '/sample-report': mapSampleReport,
  '/window-sticker': mapWindowSticker,
  '/contact-us': mapContact,
  '/frequently-asked-questions': mapFAQ,
  '/request-a-refund': mapRefund,
  '/privacy-policy': () => mapLegalPage('/privacy-policy', 'privacy-policy', 'Privacy Policy', 'VEHICLEHISTORY.EU Privacy Policy', '2026-01-05'),
  '/terms-of-service': () => mapLegalPage('/terms-of-service', 'terms-of-service', 'Terms of Service', 'Terms of Use and Conditions', '2026-01-05'),
}

function getPageData(path) {
  const url = path === '/' ? `${BASE}/` : `${BASE}${path}`
  return SCRAPED.find(p => p.url === url || p.url === url.replace(/\/$/, ''))
}

// ── CLI ─────────────────────────────────────────────────────────────

const args = process.argv.slice(2)
const outIdx = args.indexOf('--out')
const outFile = outIdx !== -1 ? args[outIdx + 1] : null
const pageFilter = args.find(a => a.startsWith('--page'))
  ? args[args.indexOf('--page') + 1]
  : null

/** Post-process: apply any _improvised headings/descriptions from stage 2
 *  to blocks that still have the raw scraped version */
function postProcess(mapped, pageData) {
  for (const block of mapped.blocks) {
    const srcSection = block._source?.section
    if (!srcSection) continue
    const section = pageData.sections[srcSection - 1]
    if (!section?._improvised) continue
    const impr = section._improvised

    // Apply improvised tagline to section blocks — but NOT if inner block is split-content
    // (split-content carries its own tagline)
    const hasSplitContent = block.content?.some(c => c.blockType === 'split-content')
    if (impr.tagline && block.blockType === 'section' && !block.tag && !hasSplitContent) {
      block.tag = impr.tagline
    }

    // Apply improvised heading if block still has raw version
    if (impr.heading && block.heading) {
      const rawHeading = impr.headingOriginal || ''
      if (block.heading === rawHeading || !block.heading.includes('**')) {
        block.heading = impr.heading
      }
    }

    // Apply improvised description
    if (impr.description && block.description) {
      const rawDesc = impr.descriptionOriginal || ''
      if (block.description === rawDesc) {
        block.description = impr.description
      }
    }

    // Also check inner content blocks
    if (block.content) {
      for (const inner of block.content) {
        if (impr.heading && inner.heading) {
          const rawHeading = impr.headingOriginal || ''
          if (inner.heading === rawHeading || !inner.heading.includes('**')) {
            inner.heading = impr.heading
          }
        }
      }
    }
  }
  return mapped
}

const paths = pageFilter ? [pageFilter] : Object.keys(PAGE_MAPPERS)
const results = []

for (const path of paths) {
  const mapper = PAGE_MAPPERS[path]
  if (!mapper) {
    console.error(`No mapper for ${path}`)
    continue
  }
  const pageData = getPageData(path)
  if (!pageData && mapper.length > 0) {
    console.error(`No scraped data for ${path} — run scrape-content.mjs first`)
    continue
  }
  const mapped = pageData ? mapper(pageData) : mapper()
  results.push(pageData ? postProcess(mapped, pageData) : mapped)
}

const output = results.length === 1 ? results[0] : results

if (outFile) {
  writeFileSync(outFile, JSON.stringify(output, null, 2))
  console.log(`Saved ${results.length} page(s) to ${outFile}`)
} else {
  console.log(JSON.stringify(output, null, 2))
}
