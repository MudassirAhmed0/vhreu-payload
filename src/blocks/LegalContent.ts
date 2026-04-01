import type { Block } from 'payload'

/**
 * LegalContent — top-level block for legal pages.
 * Privacy policy, terms of service, refund policy, etc.
 * Renders with legal-specific typography and container width.
 */
export const LegalContentBlock: Block = {
  slug: 'legal-content',
  labels: { singular: 'Legal Content', plural: 'Legal Contents' },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description: 'Page heading (h1)',
      },
    },
    {
      name: 'lastUpdated',
      type: 'date',
      label: 'Last Updated',
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayOnly' },
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      localized: true,
    },
  ],
}
