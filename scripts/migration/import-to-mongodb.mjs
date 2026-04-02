#!/usr/bin/env node
/**
 * Import exported SQLite data into MongoDB Payload instance.
 * Reads sqlite-export.json and creates all docs via API.
 *
 * Run AFTER Payload is started with MongoDB adapter.
 *
 * Usage:
 *   node import-to-mongodb.mjs
 */

import { readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PAYLOAD_URL = process.env.PAYLOAD_URL || 'http://localhost:3001'
const EMAIL = 'lame@lame.com'
const PASSWORD = 'lame@lame.com'
let token = null

const data = JSON.parse(readFileSync(join(__dirname, 'sqlite-export.json'), 'utf8'))

async function login() {
  // First try existing user
  try {
    const res = await fetch(`${PAYLOAD_URL}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
    })
    const result = await res.json()
    if (result.token) { token = result.token; return }
  } catch {}

  // Create first user if needed
  const res = await fetch(`${PAYLOAD_URL}/api/users/first-register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  })
  const result = await res.json()
  token = result.token
}

async function createDoc(collection, doc) {
  // Strip internal fields
  const { id, createdAt, updatedAt, globalType, ...rest } = doc
  const payload = { ...rest, _status: rest._status || 'published' }

  const res = await fetch(`${PAYLOAD_URL}/api/${collection}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}` },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(30_000),
  })

  try {
    const result = await res.json()
    if (result.errors) return { error: result.errors[0]?.message || JSON.stringify(result.errors[0]).slice(0, 150) }
    return { id: result.doc?.id }
  } catch {
    return { id: 'timeout' }
  }
}

async function updateGlobal(slug, doc) {
  const { id, createdAt, updatedAt, globalType, ...rest } = doc
  const res = await fetch(`${PAYLOAD_URL}/api/globals/${slug}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}` },
    body: JSON.stringify(rest),
  })
  const result = await res.json()
  return result.result ? 'OK' : 'FAILED'
}

async function main() {
  console.log('\n═══════════════════════════════════════')
  console.log('  IMPORT TO MONGODB')
  console.log('═══════════════════════════════════════\n')

  await login()
  console.log('  Authenticated.\n')

  // Import order matters — dependencies first
  const importOrder = [
    'categories',
    'authors',
    'content-groups',
    'media',        // media records (files already in S3, just need DB refs)
    'pages',
    'posts',
    'content-pages',
    'redirects',
  ]

  // Track old ID → new ID mappings for relationships
  const idMap = {}

  for (const col of importOrder) {
    const docs = data[col] || []
    if (docs.length === 0) { console.log(`  ${col.padEnd(20)} 0 docs (skip)`); continue }

    process.stdout.write(`  ${col.padEnd(20)}`)
    let success = 0, failed = 0
    const errors = []

    for (const doc of docs) {
      // Remap relationship IDs for posts
      if (col === 'posts') {
        if (doc.author && idMap[`authors_${doc.author}`]) {
          doc.author = idMap[`authors_${doc.author}`]
        }
        if (doc.categories && Array.isArray(doc.categories)) {
          doc.categories = doc.categories.map(c => idMap[`categories_${c}`] || c)
        }
        if (doc.featuredImage && idMap[`media_${doc.featuredImage}`]) {
          doc.featuredImage = idMap[`media_${doc.featuredImage}`]
        }
      }

      // Remap for pages
      if (col === 'pages') {
        if (doc.featuredArticle && idMap[`posts_${doc.featuredArticle}`]) {
          doc.featuredArticle = idMap[`posts_${doc.featuredArticle}`]
        }
        if (doc.popularArticles && Array.isArray(doc.popularArticles)) {
          doc.popularArticles = doc.popularArticles.map(p => idMap[`posts_${p}`] || p)
        }
      }

      // Remap for content-pages
      if (col === 'content-pages') {
        if (doc.group && idMap[`content-groups_${doc.group}`]) {
          doc.group = idMap[`content-groups_${doc.group}`]
        }
      }

      const result = await createDoc(col, doc)
      if (result.error) {
        failed++
        errors.push({ slug: doc.slug || doc.name || doc.email || '?', error: result.error })
      } else {
        success++
        // Store ID mapping
        if (result.id && doc.id) {
          idMap[`${col}_${doc.id}`] = result.id
        }
      }
    }

    console.log(`${success} ok / ${failed} fail (of ${docs.length})`)
    if (errors.length > 0 && errors.length <= 5) {
      errors.forEach(e => console.log(`    - ${e.slug}: ${e.error.slice(0, 100)}`))
    } else if (errors.length > 5) {
      console.log(`    (${errors.length} errors, showing first 3)`)
      errors.slice(0, 3).forEach(e => console.log(`    - ${e.slug}: ${e.error.slice(0, 100)}`))
    }
  }

  // Globals
  console.log()
  for (const key of Object.keys(data)) {
    if (!key.startsWith('global_')) continue
    const slug = key.replace('global_', '')
    process.stdout.write(`  ${slug.padEnd(20)}`)
    const result = await updateGlobal(slug, data[key])
    console.log(result)
  }

  console.log('\n═══════════════════════════════════════\n')
}

main().catch(e => { console.error('Fatal:', e.message); process.exit(1) })
