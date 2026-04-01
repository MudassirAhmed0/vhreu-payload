import type { CollectionAfterChangeHook, GlobalAfterChangeHook } from 'payload'

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000'
const REVALIDATION_SECRET = process.env.REVALIDATION_SECRET || ''

async function revalidateFrontend(tags: string[], paths: string[] = []) {
  try {
    await fetch(`${FRONTEND_URL}/api/revalidate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${REVALIDATION_SECRET}`,
      },
      body: JSON.stringify({ tags, paths }),
    })
  } catch (err) {
    // Frontend may not be running in dev — fail silently
  }
}

export const revalidatePage: CollectionAfterChangeHook = async ({ doc }) => {
  const url = doc.url || doc.slug || ''
  await revalidateFrontend(['pages', `page_${url}`], [url === '/home-page' ? '/' : `/${url}`])
  return doc
}

export const revalidatePost: CollectionAfterChangeHook = async ({ doc }) => {
  await revalidateFrontend(['posts', `post_${doc.slug}`], [`/blog/${doc.slug}`, '/blog'])
  return doc
}

export const revalidateGlobal: GlobalAfterChangeHook = async ({ doc, global }) => {
  await revalidateFrontend([global.slug, 'site'], ['/', '/sitemap.xml'])
  return doc
}

export const revalidateRedirects: CollectionAfterChangeHook = async ({ doc }) => {
  await revalidateFrontend(['redirects'])
  return doc
}
