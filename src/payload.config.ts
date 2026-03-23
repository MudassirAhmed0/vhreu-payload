import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor, LinkFeature, UploadFeature } from '@payloadcms/richtext-lexical'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Authors } from './collections/Authors'
import { Categories } from './collections/Categories'
import { Countries } from './collections/Countries'
import { CarMakes } from './collections/CarMakes'
import { SiteConfig } from './globals/SiteConfig'
import { revalidateRedirects } from './hooks/revalidate'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },

  collections: [
    Users,
    Media,
    Pages,
    Posts,
    Authors,
    Categories,
    Countries,
    CarMakes,
  ],

  globals: [SiteConfig],

  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      LinkFeature({
        enabledCollections: ['pages'],
        fields: ({ defaultFields }) => [
          ...defaultFields,
          {
            name: 'rel',
            type: 'select',
            label: 'Link Rel',
            defaultValue: 'none',
            options: [
              { label: 'Default (dofollow)', value: 'none' },
              { label: 'nofollow', value: 'nofollow' },
              { label: 'sponsored', value: 'sponsored' },
              { label: 'ugc', value: 'ugc' },
              { label: 'nofollow noopener', value: 'nofollow noopener' },
            ],
            admin: { width: '50%' },
          },
        ],
      }),
      UploadFeature({ collections: { media: { fields: [] } } }),
    ],
  }),

  localization: {
    defaultLocale: 'en',
    fallback: true,
    locales: [
      { label: 'English', code: 'en' },
      { label: 'German', code: 'de' },
      { label: 'Ukrainian', code: 'uk' },
      { label: 'Polish', code: 'pl' },
      { label: 'Italian', code: 'it' },
      { label: 'Russian', code: 'ru' },
      { label: 'French', code: 'fr' },
      { label: 'Spanish', code: 'es' },
    ],
  },

  secret: process.env.PAYLOAD_SECRET || '',

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URL || '',
    },
  }),

  sharp,

  plugins: [
    seoPlugin({
      collections: ['pages', 'posts', 'countries', 'car-makes'],
      uploadsCollection: 'media',
      fields: ({ defaultFields }) => [
        ...defaultFields,
        {
          name: 'metaRobots',
          type: 'select',
          label: 'Meta Robots',
          options: [
            { label: 'Index, Follow', value: 'index, follow' },
            { label: 'Noindex, Follow', value: 'noindex, follow' },
            { label: 'Index, Nofollow', value: 'index, nofollow' },
            { label: 'Noindex, Nofollow', value: 'noindex, nofollow' },
          ],
          defaultValue: 'index, follow',
        },
        {
          name: 'canonicalURL',
          type: 'text',
          label: 'Canonical URL',
        },
        {
          name: 'structuredData',
          type: 'json',
          label: 'Structured Data (JSON-LD)',
        },
        {
          name: 'keywords',
          type: 'text',
          label: 'Keywords',
          admin: {
            description: 'Comma-separated keywords for search engines.',
          },
        },
      ],
    }),
    redirectsPlugin({
      collections: ['pages', 'posts'],
      overrides: {
        hooks: {
          afterChange: [revalidateRedirects],
        },
      },
    }),
  ],
})
