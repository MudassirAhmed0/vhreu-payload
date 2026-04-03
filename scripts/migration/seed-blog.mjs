#!/usr/bin/env node
/**
 * Seeds blog data into Payload CMS: author, categories, and posts.
 * Scraped from vehiclehistory.eu/blog.
 *
 * Usage:
 *   node scripts/seed-blog.mjs
 */

const PAYLOAD_URL = process.env.PAYLOAD_URL || 'http://localhost:3030'
const EMAIL = process.env.PAYLOAD_EMAIL || 'lame@lame.com'
const PASSWORD = process.env.PAYLOAD_PASSWORD || 'lame@lame.com'

let token = null

// ── API helpers ─────────────────────────────────────────────────────

async function login() {
  const res = await fetch(`${PAYLOAD_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  })
  const data = await res.json()
  token = data.token
  return token
}

async function create(collection, data) {
  const res = await fetch(`${PAYLOAD_URL}/api/${collection}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${token}`,
    },
    body: JSON.stringify(data),
    signal: AbortSignal.timeout(60_000),
  })
  const result = await res.json()
  if (result.errors) {
    console.error(`  Error creating ${collection}:`, JSON.stringify(result.errors[0]?.data?.errors || result.errors, null, 2))
    return null
  }
  return result.doc
}

// ── Lexical helpers ─────────────────────────────────────────────────

function p(text) {
  return {
    type: 'paragraph', direction: 'ltr', format: '', indent: 0, version: 1, textFormat: 0, textStyle: '',
    children: [{ type: 'text', text, format: 0, version: 1, detail: 0, mode: 'normal', style: '' }],
  }
}

function h2(text) {
  return {
    type: 'heading', tag: 'h2', direction: 'ltr', format: '', indent: 0, version: 1,
    children: [{ type: 'text', text, format: 0, version: 1, detail: 0, mode: 'normal', style: '' }],
  }
}

function h3(text) {
  return {
    type: 'heading', tag: 'h3', direction: 'ltr', format: '', indent: 0, version: 1,
    children: [{ type: 'text', text, format: 0, version: 1, detail: 0, mode: 'normal', style: '' }],
  }
}

function ul(items) {
  return {
    type: 'list', listType: 'bullet', direction: 'ltr', format: '', indent: 0, version: 1, tag: 'ul', start: 1,
    children: items.map(item => ({
      type: 'listitem', direction: 'ltr', format: '', indent: 0, version: 1, value: 1,
      children: [{ type: 'text', text: item, format: 0, version: 1, detail: 0, mode: 'normal', style: '' }],
    })),
  }
}

function lexical(children) {
  return { root: { type: 'root', direction: 'ltr', format: '', indent: 0, version: 1, children } }
}

// ── Data ────────────────────────────────────────────────────────────

const AUTHOR = {
  name: 'Adewale Peter',
  slug: 'adewale-peter',
  role: 'Automotive Writer',
  bio: 'Adewale is an automotive journalist covering European vehicle markets, VIN checks, and car buying guides.',
  email: 'adewale@vehiclehistory.eu',
}

const CATEGORIES = [
  { label: 'Mileage Check', value: 'mileage-check' },
  { label: 'Buying Guide', value: 'buying-guide' },
  { label: 'Electric Vehicles', value: 'electric-vehicles' },
  { label: 'Car Safety', value: 'car-safety' },
  { label: 'VIN Check', value: 'vin-check' },
  { label: 'Car Brands', value: 'car-brands' },
]

const POSTS = [
  {
    title: 'What is a Good Fuel Economy for a Car? Gas Mileage Guide',
    slug: 'what-is-good-fuel-economy-for-a-car',
    publishedAt: '2024-12-28T00:00:00.000Z',
    readTime: 8,
    excerpt: 'Learn what constitutes good fuel economy across different vehicle types, from compact cars to SUVs and hybrids, plus tips to improve your MPG.',
    categories: ['mileage-check'],
    content: lexical([
      p('Fuel economy, measured in miles per gallon (MPG), significantly influences vehicle purchasing decisions. What constitutes "good" fuel economy varies depending on vehicle type, driving conditions, and your personal needs.'),
      h2('Understanding Fuel Economy'),
      p('City driving produces lower MPG due to frequent stops and idling. Highway driving typically achieves better MPG with consistent speeds. Both environmental impact and budget concerns drive consumer interest in fuel-efficient vehicles.'),
      h2('Benchmarks by Vehicle Type'),
      h3('Compact Cars'),
      p('Typical range is 25-35 MPG. Above 35 MPG is considered efficient for this category.'),
      h3('Sedans and Midsize Cars'),
      p('Expected range is 20-30 MPG. Over 30 MPG is noteworthy for sedans.'),
      h3('SUVs and Trucks'),
      p('Gas models typically achieve 15-25 MPG. Over 25 MPG is exceptional for larger vehicles.'),
      h3('Hybrids and EVs'),
      p('Hybrids typically achieve 50-60+ MPG. EVs are measured in MPGe, with over 100 being typical.'),
      h2('Benefits of Good Fuel Economy'),
      ul([
        'Reduced long-term fuel expenses',
        'Decreased environmental impact',
        'Enhanced resale value',
        'Improved overall vehicle performance',
      ]),
      h2('Factors That Influence Fuel Economy'),
      ul([
        'Engine type and size',
        'Driving habits and style',
        'Vehicle weight and aerodynamics',
        'Maintenance and tire pressure',
        'Fuel type and quality',
      ]),
      h2('Tips to Improve Your Fuel Economy'),
      ul([
        'Keep up with regular engine maintenance',
        'Drive smoothly without rapid acceleration',
        'Reduce unnecessary cargo weight',
        'Plan efficient routes to avoid traffic',
        'Monitor tire pressure regularly',
      ]),
      h2('How to Evaluate Fuel Economy When Buying'),
      p('When purchasing a vehicle, research manufacturer specifications, check vehicle history reports for real-world data, compare reviews from other owners, and always conduct a test drive under normal conditions.'),
    ]),
  },
  {
    title: 'What is Considered Bad Gas Mileage?',
    slug: 'what-is-considered-bad-gas-mileage',
    publishedAt: '2024-12-25T00:00:00.000Z',
    readTime: 6,
    excerpt: 'Find out what qualifies as bad gas mileage, why your car might be burning more fuel than expected, and how to diagnose and fix poor fuel efficiency.',
    categories: ['mileage-check'],
    content: lexical([
      p('Bad gas mileage means your vehicle is consuming more fuel than what is typical for its class. This can result from mechanical issues, poor driving habits, or environmental factors.'),
      h2('What Counts as Bad Mileage?'),
      p('Generally, if your vehicle gets significantly below the EPA estimates for its category, you may have a fuel efficiency problem. For a sedan getting under 20 MPG city or a compact car under 25 MPG, something may be wrong.'),
      h2('Common Causes of Poor Fuel Economy'),
      ul([
        'Underinflated tires increase rolling resistance',
        'Dirty or clogged air filters restrict airflow',
        'Faulty oxygen sensors send wrong data to the engine computer',
        'Aggressive driving with rapid acceleration and braking',
        'Excess weight from unnecessary cargo',
        'Using the wrong grade of motor oil',
      ]),
      h2('How to Diagnose the Problem'),
      p('Start by checking your tire pressure and air filter. If those are fine, consider a diagnostic scan to check for engine codes. A vehicle history report can also reveal past issues that might be affecting current performance.'),
      h2('When to Be Concerned'),
      p('If your fuel economy has dropped by more than 10-15% from its normal range, it is time to investigate. Sudden drops often indicate a mechanical issue that needs attention.'),
    ]),
  },
  {
    title: 'What is the Best Used SUV to Buy?',
    slug: 'what-is-the-best-used-suv-to-buy-in',
    publishedAt: '2024-11-30T00:00:00.000Z',
    readTime: 10,
    excerpt: 'A comprehensive guide to the best used SUVs on the European market, covering reliability, fuel economy, safety, and value for money.',
    categories: ['buying-guide'],
    content: lexical([
      p('Choosing the right used SUV requires balancing reliability, running costs, safety ratings, and your specific needs. The European market offers excellent options across every budget.'),
      h2('Top Picks for Used SUVs in Europe'),
      h3('Volkswagen Tiguan'),
      p('The Tiguan offers a refined interior, strong diesel options, and excellent resale value. Look for 2018+ models with the updated infotainment system.'),
      h3('BMW X3'),
      p('A premium choice with engaging driving dynamics. The xDrive20d offers the best balance of performance and efficiency.'),
      h3('Toyota RAV4'),
      p('Known for bulletproof reliability and low running costs. The hybrid version is particularly popular in European cities.'),
      h3('Volvo XC60'),
      p('Swedish safety meets Scandinavian design. Outstanding safety scores and a comfortable ride make it a family favourite.'),
      h2('What to Check Before Buying'),
      ul([
        'Run a VIN check to verify the vehicle history',
        'Check service records for regular maintenance',
        'Inspect for signs of accident damage',
        'Verify the mileage matches the service history',
        'Test all electronics and safety systems',
      ]),
      h2('Budget Considerations'),
      p('Used SUVs in the 3-5 year old range offer the best value. Depreciation has absorbed the biggest hit, but the vehicle still has modern safety features and warranty coverage in many cases.'),
    ]),
  },
  {
    title: '7 Best Electric Cars to Buy Used in 2024',
    slug: 'best-used-electric-cars',
    publishedAt: '2024-11-27T00:00:00.000Z',
    readTime: 9,
    excerpt: 'The best used electric vehicles available in Europe right now, from affordable city cars to premium long-range options.',
    categories: ['electric-vehicles', 'buying-guide'],
    content: lexical([
      p('The used electric car market in Europe is booming. With rapid depreciation on EVs, you can find excellent deals on vehicles that are just a few years old. Here are our top picks.'),
      h2('1. Volkswagen ID.3'),
      p('The ID.3 offers a practical hatchback form with up to 340 miles of range. Used prices have dropped significantly, making it an excellent value proposition.'),
      h2('2. Tesla Model 3'),
      p('Still the benchmark for range and charging network. Used Model 3s from 2020-2022 offer strong range and the benefit of over-the-air updates.'),
      h2('3. Hyundai Ioniq 5'),
      p('Award-winning design with ultra-fast 800V charging. Early models are now appearing on the used market at attractive prices.'),
      h2('4. Renault Zoe'),
      p('The most affordable entry point into used EVs. Perfect for city driving with a range of around 240 miles on newer models.'),
      h2('5. BMW iX3'),
      p('For those wanting a premium SUV with zero emissions. Offers 285 miles of range and BMW driving dynamics.'),
      h2('6. Peugeot e-208'),
      p('A stylish supermini with punchy performance and around 210 miles of range. Great for European city driving.'),
      h2('7. Kia EV6'),
      p('Shares the Ioniq 5 platform but with sportier styling. The 800V architecture means 10-80% charging in just 18 minutes.'),
      h2('What to Check When Buying a Used EV'),
      ul([
        'Battery health report — look for above 90% capacity',
        'Charging history and habits',
        'Software version and update status',
        'Warranty remaining on battery pack',
        'Run a VIN check for accident history',
      ]),
    ]),
  },
  {
    title: 'Best Family SUVs for 2024',
    slug: 'best-family-suv-2024',
    publishedAt: '2024-11-24T00:00:00.000Z',
    readTime: 8,
    excerpt: 'Looking for the perfect family SUV? We compare the top options for safety, space, practicality, and running costs across Europe.',
    categories: ['buying-guide'],
    content: lexical([
      p('A family SUV needs to tick many boxes: safety, space, reliability, comfort, and reasonable running costs. Here are the best options for European families in 2024.'),
      h2('Volvo XC90'),
      p('The XC90 remains the gold standard for family safety. Seven seats, a refined interior, and some of the most advanced safety systems available.'),
      h2('Skoda Kodiaq'),
      p('The value champion. The Kodiaq offers more space than many premium rivals at a fraction of the price, with the backing of VW Group engineering.'),
      h2('Hyundai Tucson'),
      p('Bold styling, a comprehensive warranty, and strong hybrid options make the Tucson a compelling all-rounder for families.'),
      h2('Key Features to Prioritise'),
      ul([
        'ISOFIX points for child seats',
        'Five-star Euro NCAP safety rating',
        'Generous boot space (minimum 500 litres)',
        'Rear parking sensors and camera',
        'Apple CarPlay and Android Auto',
      ]),
      h2('Running Costs Comparison'),
      p('Consider total cost of ownership, not just the purchase price. Insurance group, fuel costs, road tax, and depreciation all affect how much your SUV really costs to own.'),
    ]),
  },
  {
    title: 'Signs of Flood Damage in a Car',
    slug: 'signs-of-flood-damage-car',
    publishedAt: '2024-11-21T00:00:00.000Z',
    readTime: 7,
    excerpt: 'Learn how to spot a flood-damaged car before you buy. These warning signs could save you thousands of euros in repairs.',
    categories: ['car-safety', 'buying-guide'],
    content: lexical([
      p('Flood-damaged vehicles are a serious risk in the used car market, especially cars imported into Europe from regions prone to natural disasters. These vehicles can have hidden electrical and mechanical issues that cost thousands to repair.'),
      h2('Why Flood-Damaged Cars Are Dangerous'),
      p('Water can penetrate virtually every system in a modern car — from the engine and transmission to electronic control modules, airbag systems, and wiring harnesses. Even after drying out, corrosion continues silently.'),
      h2('Warning Signs to Watch For'),
      h3('Interior Indicators'),
      ul([
        'Musty or mouldy smell inside the cabin',
        'Water stains or tide marks on seats and door panels',
        'Fogging inside headlights or tail lights',
        'Sand or silt in hidden areas under seats and in the boot',
        'Mismatched or unusually new carpet and upholstery',
      ]),
      h3('Mechanical Red Flags'),
      ul([
        'Rust on components that should not be rusty',
        'Electrical gremlins — flickering lights, random warning messages',
        'Difficulty starting or rough idle',
        'Corroded wiring connectors under the bonnet',
        'Oil that appears milky (water contamination)',
      ]),
      h2('How to Protect Yourself'),
      p('Always run a comprehensive VIN check before purchasing any used vehicle. A vehicle history report will reveal flood damage titles, insurance total loss records, and import history that could indicate a flood-damaged car.'),
      h2('What a VIN Check Reveals'),
      ul([
        'Salvage or flood damage title history',
        'Insurance total loss records',
        'Import origin and history',
        'Odometer discrepancy alerts',
        'Previous accident reports',
      ]),
    ]),
  },
]

// ── Main ────────────────────────────────────────────────────────────

async function main() {
  console.log('Connecting to Payload...')
  await login()
  console.log('Authenticated.\n')

  // Create author
  console.log('Creating author...')
  const author = await create('authors', AUTHOR)
  if (!author) { console.error('Failed to create author'); return }
  console.log(`  Author: ${author.name} (id=${author.id})\n`)

  // Create categories
  console.log('Creating categories...')
  const catMap = {}
  for (const cat of CATEGORIES) {
    const created = await create('categories', cat)
    if (created) {
      catMap[cat.value] = created.id
      console.log(`  ${created.label} (id=${created.id})`)
    }
  }
  console.log()

  // Create posts
  console.log('Creating posts...')
  for (const post of POSTS) {
    const categoryIds = post.categories.map(v => catMap[v]).filter(Boolean)
    const postData = {
      title: post.title,
      slug: post.slug,
      publishedAt: post.publishedAt,
      readTime: post.readTime,
      excerpt: post.excerpt,
      author: author.id,
      categories: categoryIds,
      content: post.content,
      _status: 'published',
    }
    console.log(`  ${post.slug}...`)
    const created = await create('posts', postData)
    if (created) {
      console.log(`    Created (id=${created.id})`)
    } else {
      console.log(`    FAILED`)
    }
  }

  console.log('\nDone.')
}

main().catch(err => {
  console.error('Fatal:', err.message)
  process.exit(1)
})
