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
