#!/usr/bin/env node
/**
 * Export all data from SQLite Payload instance via API.
 * Saves to sqlite-export.json for import into MongoDB.
 */

import { writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PAYLOAD_URL = process.env.PAYLOAD_URL || 'http://localhost:3001'
const EMAIL = 'lame@lame.com'
const PASSWORD = 'lame@lame.com'

async function main() {
  console.log('\n═══════════════════════════════════════')
  console.log('  EXPORT SQLITE DATA')
  console.log('═══════════════════════════════════════\n')

  // Login
  const login = await fetch(`${PAYLOAD_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  })
  const { token } = await login.json()

  const exported = {}

  // Collections to export
  const collections = [
    'users',
    'media',
    'pages',
    'posts',
    'authors',
    'categories',
    'content-groups',
    'content-pages',
    'redirects',
  ]

  for (const col of collections) {
    process.stdout.write(`  ${col.padEnd(20)}`)
    try {
      const res = await fetch(`${PAYLOAD_URL}/api/${col}?limit=500&depth=0`, {
        headers: { Authorization: `JWT ${token}` },
      })
      const data = await res.json()
      exported[col] = data.docs || []
      console.log(`${exported[col].length} docs`)
    } catch (err) {
      console.log(`FAILED: ${err.message}`)
      exported[col] = []
    }
  }

  // Globals
  const globals = ['site-config']
  for (const g of globals) {
    process.stdout.write(`  ${g.padEnd(20)}`)
    try {
      const res = await fetch(`${PAYLOAD_URL}/api/globals/${g}`, {
        headers: { Authorization: `JWT ${token}` },
      })
      exported[`global_${g}`] = await res.json()
      console.log('OK')
    } catch (err) {
      console.log(`FAILED: ${err.message}`)
    }
  }

  const outFile = join(__dirname, 'sqlite-export.json')
  writeFileSync(outFile, JSON.stringify(exported, null, 2))

  console.log(`\n  Saved to ${outFile}`)
  console.log(`  Total: ${Object.values(exported).reduce((s, v) => s + (Array.isArray(v) ? v.length : 1), 0)} items`)
  console.log('\n═══════════════════════════════════════\n')
}

main().catch(e => { console.error('Fatal:', e.message); process.exit(1) })
