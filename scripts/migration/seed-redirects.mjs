#!/usr/bin/env node
/**
 * Seed 301 redirects from WordPress migration into Payload CMS redirects collection.
 *
 * Usage:
 *   node seed-redirects.mjs              # seed all
 *   node seed-redirects.mjs --dry-run    # preview
 */

const PAYLOAD_URL = process.env.PAYLOAD_URL || 'http://localhost:3030'
const EMAIL = 'lame@lame.com'
const PASSWORD = 'lame@lame.com'
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

async function getExistingRedirects() {
  const res = await fetch(`${PAYLOAD_URL}/api/redirects?limit=500`, {
    headers: { Authorization: `JWT ${token}` },
  })
  const data = await res.json()
  return new Set((data.docs || []).map(d => d.from))
}

async function createRedirect(from, to) {
  const res = await fetch(`${PAYLOAD_URL}/api/redirects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}` },
    body: JSON.stringify({
      from,
      to: { type: 'custom', url: to },
    }),
  })
  const data = await res.json()
  if (data.errors) {
    console.error(`    Error for ${from}:`, data.errors[0]?.message || JSON.stringify(data.errors).slice(0, 200))
    return false
  }
  return true
}

// ── All redirects from WordPress migration ──

const REDIRECTS = [
  // Trailing slash locale redirects
  ['/de/', '/de'],
  ['/es/', '/es'],
  ['/fr/', '/fr'],
  ['/it/', '/it'],
  ['/pl/', '/pl'],
  ['/ru/', '/ru'],
  ['/uk/', '/uk'],

  // Misc
  ['/testing', '/'],
  ['/lookup/vin-check', '/vin-check'],
  ['/vincheck', '/vin-check'],

  // VIN Check country redirects (old flat URLs → new nested)
  ['/albania-vin-check', '/vin-check/albania'],
  ['/vin-check-albania', '/vin-check/albania'],
  ['/andorra-vin-check', '/vin-check/andorra'],
  ['/vin-check-andorra', '/vin-check/andorra'],
  ['/austria-vin-check', '/vin-check/austria'],
  ['/vin-check-austria', '/vin-check/austria'],
  ['/belarus-vin-check', '/vin-check/belarus'],
  ['/vin-check-belarus', '/vin-check/belarus'],
  ['/vin-check-belgium', '/vin-check/belgium'],
  ['/belgium-vin-check', '/vin-check/belgium'],
  ['/bosnia-hertzegovina-vin-check', '/vin-check/bosnia-hertzegovina'],
  ['/vin-check-bosnia-hertzegovina', '/vin-check/bosnia-hertzegovina'],
  ['/bulgaria-vin-check', '/vin-check/bulgaria'],
  ['/vin-check-bulgaria', '/vin-check/bulgaria'],
  ['/croatia-vin-check', '/vin-check/croatia'],
  ['/vin-check-croatia', '/vin-check/croatia'],
  ['/czech-republic-vin-check', '/vin-check/czech-republic'],
  ['/vin-check-czech-republic', '/vin-check/czech-republic'],
  ['/denmark-vin-check', '/vin-check/denmark'],
  ['/vin-check-denmark', '/vin-check/denmark'],
  ['/estonia-vin-check', '/vin-check/estonia'],
  ['/vin-check-estonia', '/vin-check/estonia'],
  ['/finland-vin-check', '/vin-check/finland'],
  ['/vin-check-finland', '/vin-check/finland'],
  ['/france-vin-check', '/vin-check/france'],
  ['/vin-check-france', '/vin-check/france'],
  ['/germany-vin-check', '/vin-check/germany'],
  ['/vin-check-germany', '/vin-check/germany'],
  ['/greece-vin-check', '/vin-check/greece'],
  ['/vin-check-greece', '/vin-check/greece'],
  ['/holy-see-vin-check', '/vin-check/holy-see'],
  ['/vin-check-holy-see', '/vin-check/holy-see'],
  ['/hungary-vin-check', '/vin-check/hungary'],
  ['/vin-check-hungary', '/vin-check/hungary'],
  ['/iceland-vin-check', '/vin-check/iceland'],
  ['/vin-check-iceland', '/vin-check/iceland'],
  ['/ireland-vin-check', '/vin-check/ireland'],
  ['/vin-check-ireland', '/vin-check/ireland'],
  ['/italy-vin-check', '/vin-check/italy'],
  ['/vin-check-italy', '/vin-check/italy'],
  ['/latvia-vin-check', '/vin-check/latvia'],
  ['/vin-check-latvia', '/vin-check/latvia'],
  ['/liechtenstein-vin-check', '/vin-check/liechtenstein'],
  ['/vin-check-liechtenstein', '/vin-check/liechtenstein'],
  ['/lithuania-vin-check', '/vin-check/lithuania'],
  ['/vin-check-lithuania', '/vin-check/lithuania'],
  ['/luxembourg-vin-check', '/vin-check/luxembourg'],
  ['/vin-check-luxembourg', '/vin-check/luxembourg'],
  ['/malta-vin-check', '/vin-check/malta'],
  ['/vin-check-malta', '/vin-check/malta'],
  ['/moldova-vin-check', '/vin-check/moldova'],
  ['/vin-check-moldova', '/vin-check/moldova'],
  ['/monaco-vin-check', '/vin-check/monaco'],
  ['/vin-check-monaco', '/vin-check/monaco'],
  ['/montenegro-vin-check', '/vin-check/montenegro'],
  ['/vin-check-montenegro', '/vin-check/montenegro'],
  ['/netherlands-vin-check', '/vin-check/netherlands'],
  ['/vin-check-netherlands', '/vin-check/netherlands'],
  ['/north-macedonia-vin-check', '/vin-check/north-macedonia'],
  ['/vin-check-north-macedonia', '/vin-check/north-macedonia'],
  ['/norway-vin-check', '/vin-check/norway'],
  ['/vin-check-norway', '/vin-check/norway'],
  ['/poland-vin-check', '/vin-check/poland'],
  ['/vin-check-poland', '/vin-check/poland'],
  ['/portugal-vin-check', '/vin-check/portugal'],
  ['/vin-check-portugal', '/vin-check/portugal'],
  ['/romania-vin-check', '/vin-check/romania'],
  ['/vin-check-romania', '/vin-check/romania'],
  ['/russia-vin-check', '/vin-check/russia'],
  ['/vin-check-russia', '/vin-check/russia'],
  ['/san-marino-vin-check', '/vin-check/san-marino'],
  ['/vin-check-san-marino', '/vin-check/san-marino'],
  ['/serbia-vin-check', '/vin-check/serbia'],
  ['/vin-check-serbia', '/vin-check/serbia'],
  ['/slovakia-vin-check', '/vin-check/slovakia'],
  ['/vin-check-slovakia', '/vin-check/slovakia'],
  ['/slovenia-vin-check', '/vin-check/slovenia'],
  ['/vin-check-slovenia', '/vin-check/slovenia'],
  ['/spain-vin-check', '/vin-check/spain'],
  ['/vin-check-spain', '/vin-check/spain'],
  ['/sweden-vin-check', '/vin-check/sweden'],
  ['/vin-check-sweden', '/vin-check/sweden'],
  ['/switzerland-vin-check', '/vin-check/switzerland'],
  ['/vin-check-switzerland', '/vin-check/switzerland'],
  ['/ukraine-vin-check', '/vin-check/ukraine'],
  ['/vin-check-ukraine', '/vin-check/ukraine'],
  ['/united-kingdom-vin-check', '/vin-check/united-kingdom'],
  ['/vin-check-united-kingdom', '/vin-check/united-kingdom'],

  // VIN Decoder brand redirects
  ['/nissan', '/vin-decoder'],
  ['/ford', '/vin-decoder'],
  ['/vin-decoder-2', '/vin-decoder'],
  ['/acura-vin-check', '/vin-decoder/acura'],
  ['/vin-decoder/acura-vin', '/vin-decoder/acura'],
  ['/acura-vin', '/vin-decoder/acura'],
  ['/acura', '/vin-decoder/acura'],
  ['/acura-vin-decoder', '/vin-decoder/acura'],
  ['/vin-decoder__trashed/acura', '/vin-decoder/acura'],
  ['/vin-decoder__trashed/alfa-romeo', '/vin-decoder/alfa-romeo'],
  ['/alfa-romeo-4', '/vin-decoder/alfa-romeo'],
  ['/vin-decoder/alfa-romeo-vin', '/vin-decoder/alfa-romeo'],
  ['/alfa-romeo-vin', '/vin-decoder/alfa-romeo'],
  ['/alfa-romeo', '/vin-decoder/alfa-romeo'],
  ['/alfa-romeo-vin-decoder', '/vin-decoder/alfa-romeo'],
  ['/audi', '/vin-decoder/audi'],
  ['/vin-decoder__trashed/audi', '/vin-decoder/audi'],
  ['/audi-2', '/vin-decoder/audi'],
  ['/vin-decoder/audi-vin', '/vin-decoder/audi'],
  ['/audi-vin', '/vin-decoder/audi'],
  ['/audi-vin-decoder', '/vin-decoder/audi'],
  ['/vin-decoder__trashed/bmw', '/vin-decoder/bmw'],
  ['/bmw/vin-decoder', '/vin-decoder/bmw'],
  ['/vin-decoder/bmw-vin', '/vin-decoder/bmw'],
  ['/bmw-vin', '/vin-decoder/bmw'],
  ['/bmw', '/vin-decoder/bmw'],
  ['/bmw-vin-decoder', '/vin-decoder/bmw'],
  ['/citroen', '/vin-decoder/citroen'],
  ['/vin-decoder__trashed/citroen', '/vin-decoder/citroen'],
  ['/citroen-vin-decoder', '/vin-decoder/citroen'],
  ['/vin-decoder/citroen-vin', '/vin-decoder/citroen'],
  ['/citroen-vin', '/vin-decoder/citroen'],
  ['/vin-decoder/fiat-vin', '/vin-decoder/fiat'],
  ['/fiat', '/vin-decoder/fiat'],
  ['/fiat-vin', '/vin-decoder/fiat'],
  ['/vin-decoder__trashed/fiat-vin', '/vin-decoder/fiat'],
  ['/fiat-vin-decoder', '/vin-decoder/fiat'],
  ['/vin-decoder__trashed/fiat', '/vin-decoder/fiat'],
  ['/jaguar', '/vin-decoder/jaguar'],
  ['/vin-decoder__trashed/jaguar', '/vin-decoder/jaguar'],
  ['/vin-decoder/jaguar-vin', '/vin-decoder/jaguar'],
  ['/jaguar-vin', '/vin-decoder/jaguar'],
  ['/jaguar-vin-decoder', '/vin-decoder/jaguar'],
  ['/land-rover', '/vin-decoder/land-rover'],
  ['/vin-decoder__trashed/land-rover', '/vin-decoder/land-rover'],
  ['/vin-decoder/land-rover-vin', '/vin-decoder/land-rover'],
  ['/land-rover-vin', '/vin-decoder/land-rover'],
  ['/land-rover-vin-decoder', '/vin-decoder/land-rover'],
  ['/mercedes-benz', '/vin-decoder/mercedes-benz'],
  ['/vin-decoder__trashed/mercedes-benz', '/vin-decoder/mercedes-benz'],
  ['/vin-decoder/mercedes-benz-vin', '/vin-decoder/mercedes-benz'],
  ['/mercedes-benz-vin', '/vin-decoder/mercedes-benz'],
  ['/mercedes-benz-vin-decoder', '/vin-decoder/mercedes-benz'],
  ['/mini', '/vin-decoder/mini'],
  ['/vin-decoder__trashed/mini', '/vin-decoder/mini'],
  ['/mini-vin-decoder', '/vin-decoder/mini'],
  ['/vin-decoder/mini-vin', '/vin-decoder/mini'],
  ['/mini-vin', '/vin-decoder/mini'],
  ['/peugeot', '/vin-decoder/peugeot'],
  ['/vin-decoder__trashed/peugeot', '/vin-decoder/peugeot'],
  ['/peugeot-vin-decoder', '/vin-decoder/peugeot'],
  ['/vin-decoder/peugeot-vin', '/vin-decoder/peugeot'],
  ['/peugeot-vin', '/vin-decoder/peugeot'],
  ['/porsche', '/vin-decoder/porsche'],
  ['/porsche3', '/vin-decoder/porsche'],
  ['/vin-decoder__trashed/porsche', '/vin-decoder/porsche'],
  ['/vin-decoder/porsche-2', '/vin-decoder/porsche'],
  ['/porsche-vin-decoder', '/vin-decoder/porsche'],
  ['/vin-decoder/porsche-vin', '/vin-decoder/porsche'],
  ['/porsche-vin', '/vin-decoder/porsche'],
  ['/renault', '/vin-decoder/renault'],
  ['/vin-decoder__trashed/renault', '/vin-decoder/renault'],
  ['/renault-vin-decoder', '/vin-decoder/renault'],
  ['/vin-decoder/renault-vin', '/vin-decoder/renault'],
  ['/renault-vin', '/vin-decoder/renault'],
  ['/saab', '/vin-decoder/saab'],
  ['/vin-decoder__trashed/saab', '/vin-decoder/saab'],
  ['/vin-decoder/saab-vin', '/vin-decoder/saab'],
  ['/saab-vin', '/vin-decoder/saab'],
  ['/saab-vin-decoder', '/vin-decoder/saab'],
  ['/volkswagen', '/vin-decoder/volkswagen'],
  ['/vin-decoder__trashed/volkswagen', '/vin-decoder/volkswagen'],
  ['/vin-decoder/volkswagen-vin', '/vin-decoder/volkswagen'],
  ['/volkswagen-vin', '/vin-decoder/volkswagen'],
  ['/volkswagen-vin-decoder', '/vin-decoder/volkswagen'],
  ['/volvo', '/vin-decoder/volvo'],
  ['/vin-decoder__trashed/volvo', '/vin-decoder/volvo'],
  ['/vin-decoder/volvo-vin', '/vin-decoder/volvo'],
  ['/volvo-vin', '/vin-decoder/volvo'],
  ['/volvo-vin-decoder', '/vin-decoder/volvo'],

  // Window sticker
  ['/window-sticker-lookup', '/window-sticker'],

  // Blog redirects (old root URLs → /blog/ prefix)
  ['/how-to-check-bmw-chassis-number-explained-for-beginners-2', '/blog/how-to-check-bmw-chassis-number-explained-for-beginners'],
  ['/citroen-vin-check-free-why-its-important-and-where-to-do-it', '/blog/citroen-vin-check-free-why-its-important-and-where-to-do-it'],
  ['/why-a-hyundai-vin-check-is-crucial-before-you-buy-a-used-car-in-europe', '/blog/why-a-hyundai-vin-check-is-crucial-before-you-buy-a-used-car-in-europe'],
  ['/best-citroen-car', '/blog/best-citroen-car'],
  ['/best-family-suv-2024', '/blog/best-family-suv-2024'],
  ['/best-hybrid-cars-in-ireland', '/blog/best-hybrid-cars-in-ireland'],
  ['/best-peugeot-car', '/blog/best-peugeot-car'],
  ['/best-used-electric-cars', '/blog/best-used-electric-cars'],
  ['/best-vauxhall-car', '/blog/best-vauxhall-car'],
  ['/body-control-module', '/blog/body-control-module'],
  ['/buying-a-car-that-was-in-an-accident', '/blog/buying-a-car-that-was-in-an-accident'],
  ['/car-dashboard-symbols-and-meanings', '/blog/car-dashboard-symbols-and-meanings'],
  ['/cheapest-electric-car-ireland', '/blog/cheapest-electric-car-ireland'],
  ['/electrifying-savings-finding-the-cheapest-electric-car-in-ireland', '/blog/electrifying-savings-finding-the-cheapest-electric-car-in-ireland'],
  ['/european-car-check-tools-7-essential-resources-for-every-european-car-owner', '/blog/european-car-check-tools-7-essential-resources-for-every-european-car-owner'],
  ['/how-many-cars-in-europe', '/blog/how-many-cars-in-europe'],
  ['/how-much-does-it-cost-to-charge-an-electric-car-in-ireland', '/blog/how-much-does-it-cost-to-charge-an-electric-car-in-ireland'],
  ['/how-much-over-the-speed-limit-are-you-allowed-in-ireland', '/blog/how-much-over-the-speed-limit-are-you-allowed-in-ireland'],
  ['/how-to-check-bmw-chassis-number-explained-for-beginners', '/blog/how-to-check-bmw-chassis-number-explained-for-beginners'],
  ['/how-to-check-engine-size-by-vin-number', '/blog/how-to-check-engine-size-by-vin-number'],
  ['/how-to-check-equipment-by-vin-number', '/blog/how-to-check-equipment-by-vin-number'],
  ['/how-to-check-how-many-owners-a-car-has-had', '/blog/how-to-check-how-many-owners-a-car-has-had'],
  ['/how-to-find-service-history-of-a-car', '/blog/how-to-find-service-history-of-a-car'],
  ['/how-to-jump-start-a-car-a-comprehensive-guide', '/blog/how-to-jump-start-a-car-a-comprehensive-guide'],
  ['/most-popular-car-in-poland', '/blog/most-popular-car-in-poland'],
  ['/signs-of-flood-damage-car', '/blog/signs-of-flood-damage-car'],
  ['/the-check-engine-light-on-car-what-does-it-mean', '/blog/the-check-engine-light-on-car-what-does-it-mean'],
  ['/the-truth-about-volvo-performance', '/blog/the-truth-about-volvo-performance'],
  ['/tips-for-securing-your-vehicle-at-night', '/blog/tips-for-securing-your-vehicle-at-night'],
  ['/top-european-car-brands', '/blog/top-european-car-brands'],
  ['/vin-cloning', '/blog/vin-cloning'],
  ['/what-is-a-gt-car', '/blog/what-is-a-gt-car'],
  ['/what-is-considered-bad-gas-mileage', '/blog/what-is-considered-bad-gas-mileage'],
  ['/what-is-good-fuel-economy-for-a-car', '/blog/what-is-good-fuel-economy-for-a-car'],
  ['/what-is-the-best-site-to-check-the-vin-number', '/blog/what-is-the-best-site-to-check-the-vin-number'],
  ['/what-is-the-best-used-suv-to-buy-in', '/blog/what-is-the-best-used-suv-to-buy-in'],
  ['/what-is-vin-etching', '/blog/what-is-vin-etching'],
  ['/where-to-find-vin-number-on-car', '/blog/where-to-find-vin-number-on-car'],
  ['/why-a-mileage-check-is-crucial-when-buying-a-used-car', '/blog/why-a-mileage-check-is-crucial-when-buying-a-used-car'],
  ['/blog/how-to-check-bmw-chassis-number-explained-for-beginners-2', '/blog/how-to-check-bmw-chassis-number-explained-for-beginners'],
]

// ── CLI ──

const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')

async function main() {
  console.log('\n═══════════════════════════════════════')
  console.log('  SEED REDIRECTS')
  console.log('═══════════════════════════════════════\n')
  console.log(`Total redirects: ${REDIRECTS.length}\n`)

  if (dryRun) {
    REDIRECTS.forEach(([from, to]) => console.log(`  ${from} → ${to}`))
    console.log(`\n  Dry run — ${REDIRECTS.length} redirects would be created`)
    return
  }

  await login()
  console.log('Authenticated.\n')

  const existing = await getExistingRedirects()
  console.log(`Existing redirects in Payload: ${existing.size}\n`)

  let created = 0, skipped = 0, failed = 0

  for (const [from, to] of REDIRECTS) {
    if (existing.has(from)) {
      skipped++
      continue
    }

    const ok = await createRedirect(from, to)
    if (ok) {
      created++
    } else {
      failed++
    }
  }

  console.log(`\n═══════════════════════════════════════`)
  console.log(`  Created: ${created}  Skipped: ${skipped}  Failed: ${failed}`)
  console.log(`═══════════════════════════════════════\n`)
}

main().catch(err => { console.error('Fatal:', err.message); process.exit(1) })
