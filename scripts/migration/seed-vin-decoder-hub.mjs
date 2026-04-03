#!/usr/bin/env node
/**
 * Seed the VIN Decoder hub page (/vin-decoder).
 * Scrapes live site, uploads images, creates Payload page.
 *
 * Usage:
 *   node seed-vin-decoder-hub.mjs              # create/update page
 *   node seed-vin-decoder-hub.mjs --dry-run    # preview blocks
 */

import * as cheerio from 'cheerio'

const PAYLOAD_URL = process.env.PAYLOAD_URL || 'http://localhost:3030'
const EMAIL = 'lame@lame.com'
const PASSWORD = 'lame@lame.com'
const LIVE_URL = 'https://vehiclehistory.eu/vin-decoder'
let token = null

const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')

// ── Helpers ───────────────────────────────────────────────────────

function clean(s) { return (s || '').replace(/\s+/g, ' ').trim() }

function textToLexical(text) {
  if (!text) return undefined
  const paragraphs = String(text).split(/\n\n+/).filter(Boolean)
  return {
    root: {
      type: 'root', direction: 'ltr', format: '', indent: 0, version: 1,
      children: paragraphs.map(p => ({
        type: 'paragraph', direction: 'ltr', format: '', indent: 0, version: 1, textFormat: 0, textStyle: '',
        children: [{ type: 'text', text: p.trim(), format: 0, version: 1, detail: 0, mode: 'normal', style: '' }],
      })),
    },
  }
}

function icon(preset) {
  return { source: 'preset', preset }
}

async function login() {
  const res = await fetch(`${PAYLOAD_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  })
  const data = await res.json()
  token = data.token
}

async function uploadMedia(url, alt) {
  const res = await fetch(url)
  if (!res.ok) { console.error(`    Download failed: ${res.status} ${url}`); return null }
  const buffer = Buffer.from(await res.arrayBuffer())
  const filename = url.split('/').pop()

  const check = await fetch(
    `${PAYLOAD_URL}/api/media?where[alt][equals]=${encodeURIComponent(alt || filename)}&limit=1`,
    { headers: { Authorization: `JWT ${token}` } },
  )
  const existing = await check.json()
  if (existing.docs?.[0]?.id) return existing.docs[0].id

  const ext = filename.split('.').pop()?.toLowerCase() || 'bin'
  const mimeTypes = { svg: 'image/svg+xml', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp' }
  const mime = mimeTypes[ext] || 'application/octet-stream'

  const form = new FormData()
  form.append('_payload', JSON.stringify({ alt: alt || filename }))
  form.append('file', new File([buffer], filename, { type: mime }))

  const upload = await fetch(`${PAYLOAD_URL}/api/media`, {
    method: 'POST',
    headers: { Authorization: `JWT ${token}` },
    body: form,
  })
  const result = await upload.json()
  if (result.errors) {
    console.error(`    Upload error:`, JSON.stringify(result.errors[0]?.message || result.errors).slice(0, 200))
    return null
  }
  return result.doc?.id || null
}

// ── Scrape ────────────────────────────────────────────────────────

async function scrape() {
  console.log('  Scraping live page...')
  const res = await fetch(LIVE_URL, { headers: { 'User-Agent': 'Mozilla/5.0' } })
  const html = await res.text()
  const $ = cheerio.load(html)

  const sections = {}
  const matched = new Set()

  function findSection(keywords) {
    let found = null
    $('h2').each((_, el) => {
      const text = clean($(el).text()).toLowerCase()
      const parent = $(el).closest('.elementor-top-section, .e-con.e-parent')
      if (!parent.length || matched.has(parent[0])) return
      if (keywords.some(k => text.includes(k))) {
        found = { parent, heading: clean($(el).text()), headingLevel: 'h2' }
        matched.add(parent[0])
        return false
      }
    })
    return found
  }

  function findSectionH3(keywords) {
    let found = null
    $('h3').each((_, el) => {
      const text = clean($(el).text()).toLowerCase()
      const parent = $(el).closest('.elementor-top-section, .e-con.e-parent')
      if (!parent.length || matched.has(parent[0])) return
      if (keywords.some(k => text.includes(k))) {
        found = { parent, heading: clean($(el).text()), headingLevel: 'h3' }
        matched.add(parent[0])
        return false
      }
    })
    return found
  }

  function getParagraphs(parent, heading) {
    const paragraphs = []
    let found = false
    parent.find('h2, h3, p').each((_, el) => {
      const tag = el.tagName.toLowerCase()
      const text = clean($(el).text())
      if ((tag === 'h2' || tag === 'h3') && text === heading) { found = true; return }
      if ((tag === 'h2') && found) return false
      if (found && tag === 'p' && text.length > 30) paragraphs.push(text)
    })
    // Fallback: check .elementor-text-editor widgets
    if (paragraphs.length === 0) {
      parent.find('.elementor-text-editor').each((_, w) => {
        const text = clean($(w).text())
        if (text.length > 30) {
          // Split on sentences/line breaks
          text.split(/\.\s+/).forEach(s => {
            const t = s.trim()
            if (t.length > 20) paragraphs.push(t.endsWith('.') ? t : t + '.')
          })
        }
      })
    }
    return paragraphs
  }

  function getWidgetText(parent) {
    const texts = []
    parent.find('.elementor-text-editor').each((_, w) => {
      const text = clean($(w).text())
      if (text.length > 20) texts.push(text)
    })
    return texts
  }

  function getImage(parent) {
    let image = null
    parent.find('img').each((_, img) => {
      const src = $(img).attr('data-lazy-src') || $(img).attr('data-src') || $(img).attr('src') || ''
      const alt = $(img).attr('alt') || ''
      if (src && !image && !src.includes('data:image') && !src.includes('number-') && /\.(jpg|jpeg|png|webp)/i.test(src)) {
        image = { src: src.startsWith('http') ? src : `https://vehiclehistory.eu${src}`, alt }
      }
    })
    return image
  }

  // 1. Hero
  const h1 = clean($('h1').first().text())
  let heroDesc = null
  $('h1').first().closest('.elementor-top-section, .e-con.e-parent').find('p').each((_, p) => {
    const t = clean($(p).text())
    if (t.length > 20 && !heroDesc && !t.includes('10% OFF') && !t.includes('phone')) heroDesc = t
  })
  sections.hero = { heading: h1, description: heroDesc }

  // 2. How Does VIN Decoder Work
  const howWork = findSection(['how does the vehicle history', 'how does the vin decoder'])
  if (howWork) {
    const paras = getParagraphs(howWork.parent, howWork.heading)
    sections.howWork = { heading: howWork.heading, headingLevel: howWork.headingLevel, paragraphs: paras }
  }

  // 3. How To Discover History (steps)
  const howDiscover = findSection(['how to discover'])
  if (howDiscover) {
    const steps = []
    howDiscover.parent.find('h3').each((_, el) => {
      const title = clean($(el).text())
      steps.push({ title })
    })
    // Get step descriptions
    let stepIdx = 0
    howDiscover.parent.find('.elementor-icon-box-description, .elementor-icon-box-content p').each((_, el) => {
      const text = clean($(el).text())
      if (text.length > 10 && steps[stepIdx]) {
        steps[stepIdx].description = text
        stepIdx++
      }
    })
    // Fallback: get descriptions from paragraphs near each h3
    if (!steps[0]?.description) {
      stepIdx = -1
      howDiscover.parent.find('h3, p').each((_, el) => {
        const tag = el.tagName.toLowerCase()
        const text = clean($(el).text())
        if (tag === 'h3') { stepIdx++; return }
        if (tag === 'p' && text.length > 10 && stepIdx >= 0 && steps[stepIdx] && !steps[stepIdx].description) {
          steps[stepIdx].description = text
        }
      })
    }
    sections.howDiscover = { heading: howDiscover.heading, headingLevel: howDiscover.headingLevel, steps }
  }

  // 4. Why Important to Check VIN
  const whyImportant = findSection(['why is it', 'importance to check'])
  if (whyImportant) {
    const items = []
    whyImportant.parent.find('li, .elementor-icon-list-text').each((_, el) => {
      const text = clean($(el).text())
      if (text.length > 10 && !items.includes(text)) items.push(text)
    })
    // Fallback: check p tags
    if (items.length === 0) {
      whyImportant.parent.find('p').each((_, el) => {
        const text = clean($(el).text())
        if (text.length > 15) items.push(text)
      })
    }
    sections.whyImportant = { heading: whyImportant.heading, headingLevel: whyImportant.headingLevel, items }
  }

  // 5. Where to Find VIN (locations in <li><strong>Title:</strong> desc</li>)
  const whereVin = findSection(['where can i find'])
  if (whereVin) {
    let introParagraph = null
    const locations = []

    // Get intro text from widget container (text before first <li>, skip heading text)
    whereVin.parent.find('.elementor-widget-container').each((_, w) => {
      const cloned = $(w).clone()
      cloned.find('li, strong, b').remove()
      const intro = clean(cloned.text())
      if (intro.length > 15 && !introParagraph && !intro.includes(whereVin.heading)) {
        introParagraph = intro
      }
    })
    // Fallback: extract "The VIN can typically..." intro from the full widget text
    if (!introParagraph) {
      whereVin.parent.find('.elementor-widget-container').each((_, w) => {
        const text = clean($(w).text())
        const match = text.match(/(The VIN can[^:]+:)/)
        if (match) introParagraph = match[1]
      })
    }

    // Extract locations from <li> elements with <strong> titles
    whereVin.parent.find('li').each((_, li) => {
      const strong = $(li).find('strong, b').first()
      if (strong.length) {
        const title = clean(strong.text()).replace(/:$/, '')
        const fullText = clean($(li).text())
        const desc = clean(fullText.replace(clean(strong.text()), '').trim())
        if (title.length > 3) {
          locations.push({ title, titleElement: 'h4', description: desc.length > 10 ? desc : null })
        }
      }
    })

    // Fallback: try h3/h4 structure
    if (locations.length === 0) {
      whereVin.parent.find('h3, h4').each((_, el) => {
        const title = clean($(el).text())
        if (title.length > 3) locations.push({ title, titleElement: el.tagName.toLowerCase() })
      })
    }

    const image = getImage(whereVin.parent)
    sections.whereVin = { heading: whereVin.heading, headingLevel: whereVin.headingLevel, introParagraph, locations, image }
  }

  // 6. Decoding A VIN Number — split-content: image left, heading + richText right
  const decoding = findSection(['decoding a vin'])
  if (decoding) {
    const paras = []
    const listItems = []
    decoding.parent.find('.elementor-widget-container').each((_, w) => {
      const $w = $(w)
      // Extract list items
      $w.find('li').each((_, li) => {
        const text = clean($(li).text())
        if (text.length > 5) listItems.push(text)
      })
      // Extract paragraphs (skip list items, images, headings)
      const cloned = $w.clone()
      cloned.find('li, ul, ol, img, h2, h3, noscript, script, style').remove()
      const text = clean(cloned.text())
      // Filter out any remaining HTML tags leaked as text
      text.split(/(?<=\.)\s+/).forEach(s => {
        const t = s.trim()
        if (t.length > 20 && !t.includes('<img') && !t.includes('<a ') && !t.includes('srcset')) {
          paras.push(t.endsWith('.') ? t : t + '.')
        }
      })
    })
    const image = getImage(decoding.parent)
    sections.decoding = { heading: decoding.heading, headingLevel: decoding.headingLevel, paras, listItems, image }
  }

  // 7. Vehicle History Europe (CTA section)
  const vhHistory = findSection(['vehicle history europe', 'the history of your used car'])
  if (vhHistory) {
    const paras = getParagraphs(vhHistory.parent, vhHistory.heading)
    const image = getImage(vhHistory.parent)
    const ctas = []
    vhHistory.parent.find('a.elementor-button, a[role="button"]').each((_, a) => {
      const text = clean($(a).text())
      const href = $(a).attr('href') || '#'
      if (text.length > 3) ctas.push({ text, href })
    })
    sections.vhHistory = { heading: vhHistory.heading, headingLevel: vhHistory.headingLevel, paragraphs: paras, image, ctas }
  }

  // 8. VIN Decoding for Business
  const business = findSection(['business customers', 'vin decoding for business'])
  if (business) {
    const paras = getParagraphs(business.parent, business.heading)
    const image = getImage(business.parent)
    const ctas = []
    business.parent.find('a.elementor-button, a[role="button"]').each((_, a) => {
      const text = clean($(a).text())
      const href = $(a).attr('href') || '#'
      if (text.length > 3) ctas.push({ text, href })
    })
    sections.business = { heading: business.heading, headingLevel: business.headingLevel, paragraphs: paras, image, ctas }
  }

  // 9. How to Decode other Makes (brand grid) — may be H3
  let brandGrid = findSection(['how to decode other makes'])
  if (!brandGrid) brandGrid = findSectionH3(['how to decode other makes'])
  if (brandGrid) {
    const brands = []
    brandGrid.parent.find('a').each((_, a) => {
      const text = clean($(a).text())
      const href = $(a).attr('href') || '#'
      if (text.length > 1 && text.length < 40 && !brands.some(b => b.name === text) && !text.includes('Sample')) {
        brands.push({ name: text, href })
      }
    })
    sections.brandGrid = { heading: brandGrid.heading, headingLevel: brandGrid.headingLevel, brands }
  }

  console.log(`  Scraped ${Object.keys(sections).length} sections`)
  return sections
}

// ── Build blocks ──────────────────────────────────────────────────

async function buildBlocks(sections) {
  const blocks = []

  // 1. Hero
  if (sections.hero) {
    blocks.push({
      blockType: 'page-hero',
      blockName: sections.hero.heading,
      variant: 'centered',
      dark: true,
      fullHeight: false,
      glow: false,
      formType: 'vin',
      tag: 'Decode Any VIN',
      tagLevel: 'span',
      title: 'Unlock Vehicle Insights with a **VIN Decoder**',
      description: sections.hero.description,
      features: [
        { icon: icon('file-search'), text: 'Full VIN Decode', tag: 'span' },
        { icon: icon('shield-check'), text: 'History Check', tag: 'span' },
        { icon: icon('globe'), text: 'European Coverage', tag: 'span' },
        { icon: icon('zap'), text: 'Instant Results', tag: 'span' },
      ],
    })
  }

  // 2. How Does VIN Decoder Work
  if (sections.howWork) {
    blocks.push({
      blockType: 'section',
      blockName: sections.howWork.heading,
      bg: 'white',
      scene: 'default',
      tag: 'How It Works',
      heading: 'How Does the Vehicle History **VIN Decoder** Work?',
      headingLevel: sections.howWork.headingLevel || 'h2',
      description: textToLexical(sections.howWork.paragraphs.join('\n\n')),
    })
  }

  // 3. How To Discover (steps)
  if (sections.howDiscover) {
    blocks.push({
      blockType: 'section',
      blockName: sections.howDiscover.heading,
      bg: 'dark',
      scene: 'default',
      tag: 'Three Simple Steps',
      heading: 'How To Discover The **History** of a Vehicle?',
      headingLevel: sections.howDiscover.headingLevel || 'h2',
      content: [{
        blockType: 'steps',
        style: 'icons',
        titleElement: 'h3',
        steps: (sections.howDiscover.steps || []).map((s, i) => ({
          title: s.title,
          description: s.description || '',
          icon: icon(['search', 'scan', 'download'][i] || 'circle-check'),
        })),
      }],
    })
  }

  // 4. Why Important to Check VIN
  if (sections.whyImportant) {
    blocks.push({
      blockType: 'section',
      blockName: sections.whyImportant.heading,
      bg: 'muted',
      scene: 'default',
      tag: 'Why It Matters',
      heading: 'Why is it Important to Check the **VIN Number**?',
      headingLevel: sections.whyImportant.headingLevel || 'h2',
      content: [{
        blockType: 'card-grid',
        columns: '3',
        tabletColumns: '2',
        mobileColumns: '1',
        cards: (sections.whyImportant.items || []).map(item => ({
          cardType: 'feature',
          style: 'icon',
          layout: 'inline',
          icon: icon('circle-check'),
          title: item,
          titleElement: 'p',
        })),
      }],
    })
  }

  // 5. Where to Find VIN
  if (sections.whereVin) {
    const splitContent = {
      blockType: 'split-content',
      tag: 'VIN Location Guide',
      heading: 'Where can I find the **VIN Number**?',
      headingLevel: sections.whereVin.headingLevel || 'h2',
      description: sections.whereVin.introParagraph ? textToLexical(sections.whereVin.introParagraph) : undefined,
      contentType: 'cards',
      cardColumns: '2',
      reverse: false,
    }

    if (sections.whereVin.locations?.length > 0) {
      const vinIcons = { dashboard: 'car-front', door: 'lock-open', engine: 'wrench', document: 'file-text', registration: 'file-text' }
      splitContent.cards = sections.whereVin.locations.map(loc => {
        const lower = loc.title.toLowerCase()
        let iconName = 'map-pin'
        for (const [k, v] of Object.entries(vinIcons)) { if (lower.includes(k)) { iconName = v; break } }
        return {
          icon: icon(iconName),
          title: loc.title,
          titleElement: loc.titleElement || 'h4',
          cardDescription: loc.description ? textToLexical(loc.description) : undefined,
        }
      })
    }

    if (sections.whereVin.image?.src && !dryRun) {
      const mediaId = await uploadMedia(sections.whereVin.image.src, sections.whereVin.image.alt || 'VIN location guide')
      if (mediaId) splitContent.media = mediaId
    }

    blocks.push({
      blockType: 'section',
      blockName: sections.whereVin.heading,
      bg: 'white',
      scene: 'default',
      content: [splitContent],
    })
  }

  // 6. Decoding A VIN Number — split-content with richText (paragraphs + list)
  if (sections.decoding) {
    // Build Lexical richText with paragraphs + unordered list
    const children = []
    const { paras, listItems } = sections.decoding

    // First paragraph(s) before the list
    if (paras[0]) {
      children.push({
        type: 'paragraph', direction: 'ltr', format: '', indent: 0, version: 1, textFormat: 0, textStyle: '',
        children: [{ type: 'text', text: paras[0], format: 0, version: 1, detail: 0, mode: 'normal', style: '' }],
      })
    }

    // Unordered list
    if (listItems.length > 0) {
      children.push({
        type: 'list', listType: 'bullet', direction: 'ltr', format: '', indent: 0, version: 1, tag: 'ul', start: 1,
        children: listItems.map(item => ({
          type: 'listitem', direction: 'ltr', format: '', indent: 0, version: 1, value: 1,
          children: [{ type: 'text', text: item, format: 0, version: 1, detail: 0, mode: 'normal', style: '' }],
        })),
      })
    }

    // Remaining paragraphs after the list
    for (let i = 1; i < paras.length; i++) {
      children.push({
        type: 'paragraph', direction: 'ltr', format: '', indent: 0, version: 1, textFormat: 0, textStyle: '',
        children: [{ type: 'text', text: paras[i], format: 0, version: 1, detail: 0, mode: 'normal', style: '' }],
      })
    }

    const description = children.length > 0 ? {
      root: { type: 'root', direction: 'ltr', format: '', indent: 0, version: 1, children }
    } : undefined

    const splitContent = {
      blockType: 'split-content',
      tag: 'VIN Structure',
      heading: 'Decoding A **VIN Number**',
      headingLevel: sections.decoding.headingLevel || 'h2',
      description,
      contentType: 'richtext',
      reverse: true,
    }

    if (sections.decoding.image?.src && !dryRun) {
      const mediaId = await uploadMedia(sections.decoding.image.src, sections.decoding.image.alt || 'VIN decoding structure')
      if (mediaId) splitContent.media = mediaId
    }

    blocks.push({
      blockType: 'section',
      blockName: sections.decoding.heading,
      bg: 'muted',
      scene: 'default',
      content: [splitContent],
    })
  }

  // 7. Vehicle History Europe (CTA with image)
  if (sections.vhHistory) {
    const splitContent = {
      blockType: 'split-content',
      tag: 'Our Reports',
      heading: 'Vehicle History Europe — The **History** of Your Used Car',
      headingLevel: sections.vhHistory.headingLevel || 'h2',
      description: textToLexical(sections.vhHistory.paragraphs.join('\n\n')),
      contentType: 'richtext',
      reverse: false,
      ctas: (sections.vhHistory.ctas || []).map((c, i) => ({
        label: c.text,
        href: c.href,
        style: i === 0 ? 'primary' : 'secondary',
      })),
    }

    if (sections.vhHistory.image?.src && !dryRun) {
      const mediaId = await uploadMedia(sections.vhHistory.image.src, sections.vhHistory.image.alt || 'Vehicle History sample report')
      if (mediaId) splitContent.media = mediaId
    }

    blocks.push({
      blockType: 'section',
      blockName: sections.vhHistory.heading,
      bg: 'white',
      scene: 'default',
      content: [splitContent],
    })
  }

  // 8. VIN Decoding for Business
  if (sections.business) {
    const splitContent = {
      blockType: 'split-content',
      tag: 'Business Solutions',
      heading: 'VIN Decoding for **Business Customers**',
      headingLevel: sections.business.headingLevel || 'h2',
      description: textToLexical(sections.business.paragraphs.join('\n\n')),
      contentType: 'richtext',
      reverse: true,
      ctas: (sections.business.ctas || []).map((c, i) => ({
        label: c.text,
        href: c.href,
        style: i === 0 ? 'primary' : 'secondary',
      })),
    }

    if (sections.business.image?.src && !dryRun) {
      const mediaId = await uploadMedia(sections.business.image.src, sections.business.image.alt || 'VIN decoder for business')
      if (mediaId) splitContent.media = mediaId
    }

    blocks.push({
      blockType: 'section',
      blockName: sections.business.heading,
      bg: 'muted',
      scene: 'default',
      content: [splitContent],
    })
  }

  // 9. Brand Grid
  if (sections.brandGrid) {
    blocks.push({
      blockType: 'section',
      blockName: sections.brandGrid.heading,
      bg: 'white',
      scene: 'default',
      tag: 'Decode By Brand',
      heading: 'How to Decode other Makes **VIN Number**?',
      headingLevel: sections.brandGrid.headingLevel || 'h3',
      content: [{
        blockType: 'link-card-grid',
        columns: '5',
        tabletColumns: '3',
        mobileColumns: '2',
        items: (sections.brandGrid.brands || []).map(b => ({
          label: b.name,
          href: b.href.startsWith('http') ? new URL(b.href).pathname : b.href,
        })),
      }],
    })
  }

  return blocks
}

// ── Main ──────────────────────────────────────────────────────────

async function main() {
  console.log('\n═══════════════════════════════════════')
  console.log('  SEED VIN DECODER HUB PAGE')
  console.log('═══════════════════════════════════════\n')

  const sections = await scrape()

  if (!dryRun) await login()

  const blocks = await buildBlocks(sections)
  console.log(`  Built ${blocks.length} blocks`)

  if (dryRun) {
    console.log('\n  Blocks:')
    blocks.forEach((b, i) => console.log(`    ${i + 1}. ${b.blockType} — ${b.blockName?.slice(0, 60)}`))
    console.log('\n  (dry run — not saved)')
    return
  }

  const pageData = {
    slug: 'vin-decoder',
    title: 'VIN Decoder – Decode Any Vehicle Identification Number',
    content: blocks,
    _status: 'published',
    meta: {
      title: 'VIN Decoder – Decode Any Vehicle Identification Number',
      description: 'Use our VIN decoder tool to instantly decode any vehicle identification number. Get accurate specs, model year, engine, and history details.',
      metaRobots: 'index, follow',
      canonicalURL: 'https://vehiclehistory.eu/vin-decoder',
    },
  }

  // Check if page exists
  const check = await fetch(
    `${PAYLOAD_URL}/api/pages?where[slug][equals]=vin-decoder&limit=1`,
    { headers: { Authorization: `JWT ${token}` } },
  )
  const existing = await check.json()

  if (existing.docs?.[0]) {
    const id = existing.docs[0].id
    const res = await fetch(`${PAYLOAD_URL}/api/pages/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}` },
      body: JSON.stringify(pageData),
      signal: AbortSignal.timeout(60_000),
    })
    const result = await res.json()
    console.log(result.doc ? `  Updated page (id: ${result.doc.id})` : `  FAILED: ${JSON.stringify(result.errors?.[0]?.message || result.errors).slice(0, 200)}`)
  } else {
    const res = await fetch(`${PAYLOAD_URL}/api/pages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}` },
      body: JSON.stringify(pageData),
      signal: AbortSignal.timeout(60_000),
    })
    const result = await res.json()
    console.log(result.doc ? `  Created page (id: ${result.doc.id})` : `  FAILED: ${JSON.stringify(result.errors?.[0]?.message || result.errors).slice(0, 200)}`)
  }

  console.log('\n═══════════════════════════════════════\n')
}

main().catch(e => { console.error('Fatal:', e.message); process.exit(1) })
