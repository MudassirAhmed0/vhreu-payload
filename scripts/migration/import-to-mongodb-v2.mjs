#!/usr/bin/env node
/**
 * Import exported SQLite data into MongoDB directly.
 * Uses MongoDB driver for media (bypasses API file upload requirement).
 * Uses Payload API for everything else.
 */

import { readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { MongoClient } from 'mongodb'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PAYLOAD_URL = process.env.PAYLOAD_URL || 'http://localhost:3001'
const MONGO_URL = process.env.DATABASE_URL || 'mongodb://ep-admin:6eYlYQoItQQJkU8I1A@207.244.237.242:27017/vehicle-databases-dev?authSource=admin'
const EMAIL = 'lame@lame.com'
const PASSWORD = 'lame@lame.com'
let token = null

const data = JSON.parse(readFileSync(join(__dirname, 'sqlite-export.json'), 'utf8'))

// Old SQLite ID → new MongoDB ID mapping
const idMap = {}

async function login() {
  try {
    const res = await fetch(`${PAYLOAD_URL}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
    })
    const result = await res.json()
    if (result.token) { token = result.token; return }
  } catch {}

  const res = await fetch(`${PAYLOAD_URL}/api/users/first-register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  })
  const result = await res.json()
  token = result.token
}

function remapIds(obj) {
  if (!obj || typeof obj !== 'object') return obj
  if (Array.isArray(obj)) return obj.map(remapIds)

  const result = {}
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'number' && idMap[value]) {
      result[key] = idMap[value]
    } else if (typeof value === 'object' && value !== null) {
      result[key] = remapIds(value)
    } else {
      result[key] = value
    }
  }
  return result
}

async function createDoc(collection, doc) {
  const { id, createdAt, updatedAt, globalType, ...rest } = doc
  // Remap all integer IDs to MongoDB ObjectIDs
  const remapped = remapIds(rest)
  remapped._status = remapped._status || 'published'

  const res = await fetch(`${PAYLOAD_URL}/api/${collection}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}` },
    body: JSON.stringify(remapped),
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

async function main() {
  console.log('\n═══════════════════════════════════════')
  console.log('  IMPORT TO MONGODB (v2)')
  console.log('═══════════════════════════════════════\n')

  // Step 1: Insert media directly into MongoDB
  console.log('  Step 1: Inserting media into MongoDB directly...')
  const client = new MongoClient(MONGO_URL)
  await client.connect()
  const dbName = new URL(MONGO_URL).pathname.slice(1).split('?')[0]
  const db = client.db(dbName)

  const mediaDocs = data.media || []
  const mediaCol = db.collection('media')

  // Clear existing media
  await mediaCol.deleteMany({})

  let mediaOk = 0
  for (const doc of mediaDocs) {
    const oldId = doc.id
    const { id, ...rest } = doc
    try {
      const result = await mediaCol.insertOne({
        ...rest,
        createdAt: new Date(rest.createdAt),
        updatedAt: new Date(rest.updatedAt),
      })
      idMap[oldId] = result.insertedId.toString()
      mediaOk++
    } catch (err) {
      console.log(`    Failed: ${doc.filename || doc.alt}: ${err.message.slice(0, 80)}`)
    }
  }
  console.log(`  Media: ${mediaOk}/${mediaDocs.length} inserted\n`)

  await client.close()

  // Step 2: Use API for everything else
  await login()
  console.log('  Authenticated.\n')

  // First clear existing data (except users and media)
  const clearOrder = ['posts', 'content-pages', 'pages', 'authors', 'categories', 'content-groups', 'redirects']
  for (const col of clearOrder) {
    try {
      const res = await fetch(`${PAYLOAD_URL}/api/${col}?limit=1`, { headers: { Authorization: `JWT ${token}` } })
      const d = await res.json()
      if (d.totalDocs > 0) {
        // Delete all
        const all = await fetch(`${PAYLOAD_URL}/api/${col}?limit=500&depth=0`, { headers: { Authorization: `JWT ${token}` } })
        const allData = await all.json()
        for (const doc of allData.docs) {
          await fetch(`${PAYLOAD_URL}/api/${col}/${doc.id}`, { method: 'DELETE', headers: { Authorization: `JWT ${token}` } })
        }
        console.log(`  Cleared ${allData.docs.length} ${col}`)
      }
    } catch {}
  }
  console.log()

  // Import order: dependencies first
  const importOrder = [
    { col: 'categories', data: data.categories || [] },
    { col: 'authors', data: data.authors || [] },
    { col: 'content-groups', data: data['content-groups'] || [] },
    { col: 'pages', data: data.pages || [] },
    { col: 'posts', data: data.posts || [] },
    { col: 'content-pages', data: data['content-pages'] || [] },
    { col: 'redirects', data: data.redirects || [] },
  ]

  for (const { col, data: docs } of importOrder) {
    if (docs.length === 0) { console.log(`  ${col.padEnd(20)} 0 docs (skip)`); continue }

    process.stdout.write(`  ${col.padEnd(20)}`)
    let success = 0, failed = 0
    const errors = []

    for (const doc of docs) {
      const oldId = doc.id
      const result = await createDoc(col, doc)
      if (result.error) {
        failed++
        if (errors.length < 5) errors.push({ slug: doc.slug || doc.name || doc.label || '?', error: result.error })
      } else {
        success++
        if (result.id && oldId) idMap[oldId] = result.id
      }
    }

    console.log(`${success} ok / ${failed} fail (of ${docs.length})`)
    errors.forEach(e => console.log(`    - ${e.slug}: ${e.error.slice(0, 100)}`))
  }

  // Globals
  console.log()
  for (const key of Object.keys(data)) {
    if (!key.startsWith('global_')) continue
    const slug = key.replace('global_', '')
    process.stdout.write(`  ${slug.padEnd(20)}`)
    const doc = data[key]
    const { id, createdAt, updatedAt, globalType, ...rest } = doc
    const remapped = remapIds(rest)
    const res = await fetch(`${PAYLOAD_URL}/api/globals/${slug}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}` },
      body: JSON.stringify(remapped),
    })
    const result = await res.json()
    console.log(result.result ? 'OK' : 'FAILED')
  }

  console.log('\n═══════════════════════════════════════\n')
}

main().catch(e => { console.error('Fatal:', e.message); process.exit(1) })
