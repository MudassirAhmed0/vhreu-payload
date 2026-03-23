import type { CollectionConfig } from 'payload'
import { slugField } from '../fields/slug'
import { PageHeroBlock } from '../blocks/PageHero'
import { RichTextBlock } from '../blocks/RichText'
import { FAQsBlock } from '../blocks/FAQs'

export const Countries: CollectionConfig = {
  slug: 'countries',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'code', 'slug', 'status'],
    group: 'Coverage',
  },
  access: {
    read: () => true,
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
    },
    slugField,
    {
      name: 'code',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
        description: 'ISO 3166-1 alpha-2 (e.g. DE, FR, PL)',
      },
    },
    {
      name: 'flag',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'Flag emoji (e.g. 🇩🇪)',
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'content',
      type: 'blocks',
      localized: true,
      blocks: [PageHeroBlock, RichTextBlock, FAQsBlock],
    },
  ],
}
