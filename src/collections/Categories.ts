import type { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'label',
    group: 'Blog',
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: 'label', type: 'text', required: true },
    { name: 'value', type: 'text', required: true, unique: true },
  ],
}
