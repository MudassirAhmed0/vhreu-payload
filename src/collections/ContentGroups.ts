import type { CollectionConfig } from 'payload'
import { slugField } from '../fields/slug'

export const ContentGroups: CollectionConfig = {
  slug: 'content-groups',
  labels: { singular: 'Content Group', plural: 'Content Groups' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug'],
    group: 'Content',
  },
  access: {
    read: () => true,
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
      name: 'description',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'Internal note — not shown on the site.',
      },
    },
  ],
}
