#!/usr/bin/env node
/**
 * Seed header nav + footer groups into SiteConfig global.
 */

const PAYLOAD_URL = process.env.PAYLOAD_URL || 'http://localhost:3001'
const EMAIL = 'lame@lame.com'
const PASSWORD = 'lame@lame.com'

async function login() {
  const res = await fetch(`${PAYLOAD_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  })
  return (await res.json()).token
}

async function main() {
  const token = await login()
  console.log('Authenticated.\n')

  const data = {
    siteName: 'Vehicle History Europe',
    siteUrl: 'https://vehiclehistory.eu',
    contactEmail: 'support@vehiclehistory.com',
    contactPhone: '+(866)-300-0554',

    // ── Header nav ──
    navLinks: [
      { label: 'Home', navType: 'link', link: { linkType: 'external', url: '/' } },
      { label: 'Pricing', navType: 'link', link: { linkType: 'external', url: '/pricing' } },
      { label: 'Sample Reports', navType: 'link', link: { linkType: 'external', url: '/sample-report' } },
      { label: 'Window Sticker', navType: 'link', link: { linkType: 'external', url: '/window-sticker' } },
      { label: 'Contact Us', navType: 'link', link: { linkType: 'external', url: '/contact-us' } },
    ],

    // ── Footer groups ──
    footerGroups: [
      {
        heading: 'Company',
        links: [
          { label: 'Pricing', linkType: 'external', url: '/pricing' },
          { label: 'Sample Reports', linkType: 'external', url: '/sample-report' },
          { label: 'Window Sticker', linkType: 'external', url: '/window-sticker' },
          { label: 'Contact Us', linkType: 'external', url: '/contact-us' },
          { label: 'Blog', linkType: 'external', url: '/blog' },
          { label: 'Login / Sign Up', linkType: 'external', url: '/members/login' },
        ],
      },
      {
        heading: 'Sample Reports',
        links: [
          { label: '2015 Toyota Corolla', linkType: 'external', url: '/sample-report' },
          { label: '2005 Renault Clio', linkType: 'external', url: '/sample-report' },
          { label: '2017 Vauxhall Astra', linkType: 'external', url: '/sample-report' },
        ],
      },
      {
        heading: 'Decoder By Make',
        links: [
          { label: 'Ford VIN Decoder', linkType: 'external', url: '/vin-decoder' },
          { label: 'Audi VIN Decoder', linkType: 'external', url: '/vin-decoder/audi' },
          { label: 'Nissan VIN Decoder', linkType: 'external', url: '/vin-decoder' },
          { label: 'Fiat VIN Decoder', linkType: 'external', url: '/vin-decoder/fiat' },
        ],
      },
      {
        heading: 'Quick Links',
        links: [
          { label: 'Window Sticker', linkType: 'external', url: '/window-sticker' },
          { label: 'Privacy Policy', linkType: 'external', url: '/privacy-policy' },
          { label: 'Terms and Conditions', linkType: 'external', url: '/terms-of-service' },
          { label: 'FAQs', linkType: 'external', url: '/frequently-asked-questions' },
        ],
      },
    ],

    // ── Languages ──
    languages: [
      { code: 'EN', label: 'English', flag: '🇺🇸', enabled: true },
      { code: 'DE', label: 'German', flag: '🇩🇪', enabled: true },
      { code: 'UK', label: 'Ukrainian', flag: '🇺🇦', enabled: true },
      { code: 'PL', label: 'Polish', flag: '🇵🇱', enabled: true },
      { code: 'IT', label: 'Italian', flag: '🇮🇹', enabled: true },
      { code: 'RU', label: 'Russian', flag: '🇷🇺', enabled: true },
      { code: 'FR', label: 'French', flag: '🇫🇷', enabled: true },
      { code: 'ES', label: 'Spanish', flag: '🇪🇸', enabled: true },
    ],
  }

  const res = await fetch(`${PAYLOAD_URL}/api/globals/site-config`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}` },
    body: JSON.stringify(data),
  })

  const result = await res.json()
  if (result.errors) {
    console.error('Error:', JSON.stringify(result.errors, null, 2).slice(0, 500))
  } else {
    console.log('SiteConfig seeded:')
    console.log(`  Nav links: ${data.navLinks.length}`)
    console.log(`  Footer groups: ${data.footerGroups.length}`)
    console.log(`  Languages: ${data.languages.length}`)
  }
}

main().catch(err => { console.error(err); process.exit(1) })
