#!/usr/bin/env node
/**
 * Scrape + seed a single blog post from the live WordPress site.
 * Converts WordPress HTML to Payload Lexical richText.
 *
 * Usage:
 *   node seed-blog-post.mjs --slug vin-cloning
 *   node seed-blog-post.mjs --slug vin-cloning --dry-run
 */

import * as cheerio from 'cheerio'

const PAYLOAD_URL = process.env.PAYLOAD_URL || 'http://localhost:3001'
const EMAIL = 'lame@lame.com'
const PASSWORD = 'lame@lame.com'
const LIVE_BASE = 'https://vehiclehistory.eu'
let token = null

const args = process.argv.slice(2)
const slug = args.includes('--slug') ? args[args.indexOf('--slug') + 1] : null
const dryRun = args.includes('--dry-run')

if (!slug) { console.error('Usage: node seed-blog-post.mjs --slug <slug>'); process.exit(1) }

// ── Helpers ───────────────────────────────────────────────────────

function clean(s) { return (s || '').replace(/\s+/g, ' ').trim() }

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
  if (!url || url.includes('data:image')) return null
  const res = await fetch(url)
  if (!res.ok) { console.error(`    Download failed: ${res.status} ${url.slice(0, 80)}`); return null }
  const buffer = Buffer.from(await res.arrayBuffer())
  let filename = url.split('/').pop().split('?')[0]
  // Handle extensionless URLs (e.g. Gravatar)
  const contentType = res.headers.get('content-type') || ''
  if (!filename.includes('.') && contentType.includes('image/')) {
    const extMap = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp', 'image/gif': '.gif' }
    const ext = extMap[contentType.split(';')[0]] || '.jpg'
    filename = (alt || 'image').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40) + ext
  }

  const check = await fetch(
    `${PAYLOAD_URL}/api/media?where[filename][equals]=${encodeURIComponent(filename)}&limit=1`,
    { headers: { Authorization: `JWT ${token}` } },
  )
  const existing = await check.json()
  if (existing.docs?.[0]?.id) return existing.docs[0]

  const ext = filename.split('.').pop()?.toLowerCase() || 'bin'
  const mimeTypes = { svg: 'image/svg+xml', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp', gif: 'image/gif' }
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
  return result.doc || null
}

// ── HTML → Lexical converter ──────────────────────────────────────

function htmlToLexical($, el) {
  const children = []

  function processInline(node) {
    const results = []
    $(node).contents().each((_, child) => {
      if (child.type === 'text') {
        const text = child.data
        if (text && text.trim()) {
          results.push({ type: 'text', text, format: 0, version: 1, detail: 0, mode: 'normal', style: '' })
        }
        return
      }

      const $child = $(child)
      const tag = child.tagName?.toLowerCase()

      if (tag === 'strong' || tag === 'b') {
        const innerNodes = processInline(child)
        innerNodes.forEach(n => { n.format = (n.format || 0) | 1 })
        results.push(...innerNodes)
      } else if (tag === 'em' || tag === 'i') {
        const innerNodes = processInline(child)
        innerNodes.forEach(n => { n.format = (n.format || 0) | 2 })
        results.push(...innerNodes)
      } else if (tag === 'a') {
        const href = $child.attr('href') || ''
        if (!href || href === '#') { results.push(...processInline(child)); return }
        const linkChildren = processInline(child)
        if (linkChildren.length === 0) return
        const newTab = $child.attr('target') === '_blank'
        results.push({
          type: 'link',
          version: 1,
          fields: { url: href, newTab },
          children: linkChildren,
        })
      } else if (tag === 'br') {
        results.push({ type: 'linebreak', version: 1 })
      } else {
        // Recurse into unknown inline elements (span, etc)
        results.push(...processInline(child))
      }
    })
    return results
  }

  function processBlock(node) {
    const $node = $(node)
    const tag = node.tagName?.toLowerCase()

    // Skip script, style, noscript, nav, footer
    if (['script', 'style', 'noscript', 'nav', 'footer', 'form'].includes(tag)) return

    // Headings
    if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)) {
      const text = clean($node.text())
      if (text.length < 2) return
      const inlineChildren = processInline(node)
      if (inlineChildren.length === 0) return
      children.push({
        type: 'heading',
        tag,
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
        children: inlineChildren,
      })
      return
    }

    // Paragraph
    if (tag === 'p') {
      const text = clean($node.text())
      if (text.length < 2) return
      // Skip "RELATED:" links
      if (/^(RELATED|Related|READ ALSO|Read Also|READ MORE|Read More)\s*:/i.test(text)) return
      const inlineChildren = processInline(node)
      if (inlineChildren.length === 0) return
      children.push({
        type: 'paragraph',
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
        textFormat: 0,
        textStyle: '',
        children: inlineChildren,
      })
      return
    }

    // Lists
    if (tag === 'ul' || tag === 'ol') {
      const listItems = []
      $node.children('li').each((_, li) => {
        const inlineChildren = processInline(li)
        if (inlineChildren.length === 0) return
        listItems.push({
          type: 'listitem',
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
          value: 1,
          children: inlineChildren,
        })
      })
      if (listItems.length === 0) return
      children.push({
        type: 'list',
        listType: tag === 'ol' ? 'number' : 'bullet',
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
        tag,
        start: 1,
        children: listItems,
      })
      return
    }

    // Blockquote
    if (tag === 'blockquote') {
      const inlineChildren = processInline(node)
      if (inlineChildren.length === 0) return
      children.push({
        type: 'quote',
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
        children: inlineChildren,
      })
      return
    }

    // Image
    if (tag === 'img') {
      // Skip tiny icons, placeholders, lazy SVGs
      const src = $node.attr('data-lazy-src') || $node.attr('data-src') || $node.attr('src') || ''
      if (!src || src.includes('data:image') || src.includes('gravatar')) return
      const alt = $node.attr('alt') || ''
      // Store as a paragraph with image marker — will be converted to upload node during seeding
      children.push({ type: '_image', src, alt })
      return
    }

    // Figure (wraps img)
    if (tag === 'figure') {
      const img = $node.find('img').first()
      if (img.length) {
        const src = img.attr('data-lazy-src') || img.attr('data-src') || img.attr('src') || ''
        if (src && !src.includes('data:image')) {
          const alt = img.attr('alt') || ''
          const caption = clean($node.find('figcaption').text())
          children.push({ type: '_image', src, alt, caption })
        }
      }
      return
    }

    // Details/summary (FAQ accordion)
    if (tag === 'details') {
      const summary = clean($node.find('summary').text())
      const content = clean($node.clone().find('summary').remove().end().text())
      if (summary && content) {
        children.push({ type: '_faq', question: summary, answer: content })
      }
      return
    }

    // Div / section / article — recurse into children
    if (['div', 'section', 'article', 'main', 'aside', 'span'].includes(tag)) {
      $node.children().each((_, child) => processBlock(child))
      return
    }
  }

  $(el).children().each((_, child) => processBlock(child))

  return {
    root: {
      type: 'root',
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
      children,
    },
  }
}

// ── Scrape ────────────────────────────────────────────────────────

async function scrapePost() {
  const url = `${LIVE_BASE}/blog/${slug}`
  console.log(`  Fetching ${url}...`)
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const html = await res.text()
  const $ = cheerio.load(html)

  // Title
  const title = clean($('h1').first().text())
  console.log(`  Title: ${title}`)

  // Meta
  const metaDesc = $('meta[name="description"]').attr('content')?.trim() || null
  const metaTitle = $('title').text()?.trim() || title

  // Published date
  const publishedAt = $('meta[property="article:published_time"]').attr('content')
    || $('time[datetime]').attr('datetime')
    || null

  // Modified date
  const modifiedAt = $('meta[property="article:modified_time"]').attr('content') || null

  // Author
  const authorName = clean($('.author-name, .elementor-author-box__name, [rel="author"]').first().text()) || 'Adewale Peter'
  const authorBio = clean($('.elementor-author-box__bio').first().text()) || null
  const authorAvatar = $('.elementor-author-box img').first().attr('data-lazy-src')
    || $('.elementor-author-box img').first().attr('src')
    || null
  const authorSocials = {}
  $('.elementor-author-box a').each((_, el) => {
    const href = $(el).attr('href') || ''
    if (href.includes('facebook.com')) authorSocials.facebook = href
    if (href.includes('twitter.com') || href.includes('x.com')) authorSocials.x = href
    if (href.includes('linkedin.com')) authorSocials.linkedin = href
  })

  // Category
  const categories = []
  $('meta[property="article:tag"]').each((_, el) => {
    const tag = $(el).attr('content')?.trim()
    if (tag) categories.push(tag)
  })
  // Fallback: check category links
  if (categories.length === 0) {
    $('a[rel="category tag"], .cat-links a').each((_, el) => {
      const cat = clean($(el).text())
      if (cat.length > 1) categories.push(cat)
    })
  }

  // Featured image
  const featuredImg = $('meta[property="og:image"]').attr('content')
    || $('article img, .post-thumbnail img').first().attr('data-lazy-src')
    || $('article img, .post-thumbnail img').first().attr('src')
    || null

  // Content — find the article body
  let contentEl = $('article .entry-content, .elementor-widget-theme-post-content .elementor-widget-container, article .post-content').first()
  if (!contentEl.length) contentEl = $('article').first()
  if (!contentEl.length) contentEl = $('.entry-content').first()

  // Convert HTML to Lexical
  const lexicalContent = contentEl.length ? htmlToLexical($, contentEl) : null

  // Extract images that need uploading
  const images = []
  if (lexicalContent) {
    lexicalContent.root.children = lexicalContent.root.children.filter(node => {
      if (node.type === '_image') {
        images.push(node)
        return false // remove from content for now
      }
      return true
    })
  }

  // Extract FAQ items
  const faqItems = []
  if (lexicalContent) {
    lexicalContent.root.children = lexicalContent.root.children.filter(node => {
      if (node.type === '_faq') {
        faqItems.push(node)
        return false
      }
      return true
    })
  }

  // Excerpt from meta or first paragraph
  let excerpt = metaDesc
  if (!excerpt && lexicalContent?.root?.children) {
    const firstP = lexicalContent.root.children.find(n => n.type === 'paragraph')
    if (firstP) {
      excerpt = firstP.children?.map(c => c.text || '').join('').slice(0, 200)
    }
  }

  // Estimated read time
  const wordCount = clean(contentEl.text()).split(/\s+/).length
  const readTime = Math.max(1, Math.ceil(wordCount / 200))

  return {
    title,
    slug,
    metaTitle,
    metaDesc,
    publishedAt,
    modifiedAt,
    authorName,
    authorBio,
    authorAvatar,
    authorSocials,
    categories,
    featuredImg,
    excerpt,
    readTime,
    wordCount,
    content: lexicalContent,
    images,
    faqItems,
  }
}

// ── Seed ──────────────────────────────────────────────────────────

async function ensureAuthor({ name, bio, avatar, socials }) {
  const authorSlug = name.toLowerCase().replace(/\s+/g, '-')
  const check = await fetch(
    `${PAYLOAD_URL}/api/authors?where[slug][equals]=${authorSlug}&limit=1`,
    { headers: { Authorization: `JWT ${token}` } },
  )
  const data = await check.json()
  if (data.docs?.[0]?.id) {
    // Update existing author with bio/socials if missing
    const existing = data.docs[0]
    const needsUpdate = (bio && !existing.bio) || (socials && !existing.socials?.x)
    if (needsUpdate) {
      const updateData = {}
      if (bio && !existing.bio) updateData.bio = bio
      if (socials && Object.keys(socials).length > 0) updateData.socials = socials
      await fetch(`${PAYLOAD_URL}/api/authors/${existing.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}` },
        body: JSON.stringify(updateData),
      })
    }
    return existing.id
  }

  // Upload avatar if available
  let imageId = null
  if (avatar && !avatar.includes('data:image')) {
    const media = await uploadMedia(avatar, `${name} avatar`)
    imageId = media?.id || null
  }

  const authorData = {
    name,
    slug: authorSlug,
    role: 'Automotive Writer',
    email: `${authorSlug}@vehiclehistory.eu`,
    bio: bio || undefined,
    image: imageId || undefined,
    socials: socials && Object.keys(socials).length > 0 ? socials : undefined,
    _status: 'published',
  }

  const create = await fetch(`${PAYLOAD_URL}/api/authors`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}` },
    body: JSON.stringify(authorData),
  })
  const result = await create.json()
  return result.doc?.id || null
}

async function ensureCategory(label) {
  const value = label.toLowerCase().replace(/\s+/g, '-')
  const check = await fetch(
    `${PAYLOAD_URL}/api/categories?where[value][equals]=${encodeURIComponent(value)}&limit=1`,
    { headers: { Authorization: `JWT ${token}` } },
  )
  const data = await check.json()
  if (data.docs?.[0]?.id) return data.docs[0].id

  const create = await fetch(`${PAYLOAD_URL}/api/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}` },
    body: JSON.stringify({ label, value }),
  })
  const result = await create.json()
  return result.doc?.id || null
}

async function seedPost(postData) {
  // Ensure author
  const authorId = await ensureAuthor({
    name: postData.authorName,
    bio: postData.authorBio,
    avatar: postData.authorAvatar,
    socials: postData.authorSocials,
  })
  console.log(`  Author: ${postData.authorName} (id: ${authorId})`)

  // Ensure categories
  const categoryIds = []
  for (const cat of postData.categories) {
    const catId = await ensureCategory(cat)
    if (catId) categoryIds.push(catId)
  }
  console.log(`  Categories: ${postData.categories.join(', ')} (${categoryIds.length} ids)`)

  // Upload featured image
  let featuredImageId = null
  if (postData.featuredImg) {
    const media = await uploadMedia(postData.featuredImg, postData.title)
    featuredImageId = media?.id || null
    console.log(`  Featured image: ${featuredImageId ? 'uploaded' : 'FAILED'}`)
  }

  // Upload inline images and convert to upload nodes in content
  for (const img of postData.images) {
    const src = img.src.startsWith('http') ? img.src : `${LIVE_BASE}${img.src}`
    const media = await uploadMedia(src, img.alt || '')
    if (media) {
      // Insert upload node back into content at the right position
      postData.content.root.children.push({
        type: 'upload',
        version: 1,
        fields: {},
        value: { id: media.id },
        relationTo: 'media',
      })
    }
  }

  // Build post payload
  const payload = {
    title: postData.title,
    slug: postData.slug,
    publishedAt: postData.publishedAt || new Date().toISOString(),
    readTime: postData.readTime,
    excerpt: postData.excerpt,
    content: postData.content,
    author: authorId,
    categories: categoryIds,
    featuredImage: featuredImageId,
    _status: 'published',
    meta: {
      title: postData.metaTitle,
      description: postData.metaDesc,
    },
  }

  // Check if exists
  const check = await fetch(
    `${PAYLOAD_URL}/api/posts?where[slug][equals]=${postData.slug}&limit=1`,
    { headers: { Authorization: `JWT ${token}` } },
  )
  const existing = await check.json()

  if (existing.docs?.[0]) {
    const res = await fetch(`${PAYLOAD_URL}/api/posts/${existing.docs[0].id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}` },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(60_000),
    })
    const result = await res.json()
    if (result.doc) console.log(`  Updated post (id: ${result.doc.id})`)
    else console.log(`  FAILED:`, JSON.stringify(result.errors?.[0]?.message || result.errors).slice(0, 200))
  } else {
    const res = await fetch(`${PAYLOAD_URL}/api/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}` },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(60_000),
    })
    const result = await res.json()
    if (result.doc) console.log(`  Created post (id: ${result.doc.id})`)
    else console.log(`  FAILED:`, JSON.stringify(result.errors?.[0]?.message || result.errors).slice(0, 200))
  }
}

// ── Main ──────────────────────────────────────────────────────────

async function main() {
  console.log('\n═══════════════════════════════════════')
  console.log('  SEED BLOG POST')
  console.log('═══════════════════════════════════════\n')

  const postData = await scrapePost()

  console.log(`  Words: ${postData.wordCount} | Read time: ${postData.readTime} min`)
  console.log(`  Images: ${postData.images.length} inline | Featured: ${postData.featuredImg ? 'yes' : 'no'}`)
  console.log(`  FAQ items: ${postData.faqItems.length}`)
  console.log(`  Content nodes: ${postData.content?.root?.children?.length || 0}`)

  if (dryRun) {
    console.log('\n  Content preview:')
    postData.content?.root?.children?.slice(0, 10).forEach((n, i) => {
      if (n.type === 'heading') console.log(`    ${i}. <${n.tag}> ${n.children?.map(c => c.text || '').join('').slice(0, 60)}`)
      else if (n.type === 'paragraph') console.log(`    ${i}. <p> ${n.children?.map(c => c.text || '').join('').slice(0, 60)}`)
      else if (n.type === 'list') console.log(`    ${i}. <${n.tag}> ${n.children?.length} items`)
      else console.log(`    ${i}. ${n.type}`)
    })
    console.log('\n  (dry run — not saved)')
    return
  }

  await login()
  await seedPost(postData)

  console.log('\n═══════════════════════════════════════\n')
}

main().catch(e => { console.error('Fatal:', e.message); process.exit(1) })
