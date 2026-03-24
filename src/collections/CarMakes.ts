import type { CollectionConfig } from 'payload'
import { slugField } from '../fields/slug'
import { PageHeroBlock } from '../blocks/PageHero'
import { SectionBlock } from '../blocks/Section'

export const CarMakes: CollectionConfig = {
  slug: 'car-makes',
  labels: { singular: 'Car Make', plural: 'Car Makes' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'status'],
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
    },
    slugField,
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      admin: { position: 'sidebar' },
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
      blocks: [PageHeroBlock, SectionBlock],
    },
  ],
}
