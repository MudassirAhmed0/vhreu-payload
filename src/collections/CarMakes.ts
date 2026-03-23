import type { CollectionConfig } from 'payload'
import { slugField } from '../fields/slug'

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
      type: 'richText',
      localized: true,
      admin: {
        description: 'SEO content for the /vin-decoder/[make] page',
      },
    },
  ],
}
