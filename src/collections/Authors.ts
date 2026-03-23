import type { CollectionConfig } from 'payload'

export const Authors: CollectionConfig = {
  slug: 'authors',
  admin: {
    useAsTitle: 'name',
    group: 'Blog',
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'role', type: 'text', required: true },
    { name: 'bio', type: 'textarea' },
    { name: 'email', type: 'text', required: true },
    { name: 'image', type: 'upload', relationTo: 'media' },
    {
      name: 'socials',
      type: 'group',
      fields: [
        { name: 'x', type: 'text', label: 'X / Twitter' },
        { name: 'linkedin', type: 'text' },
        { name: 'facebook', type: 'text' },
        { name: 'website', type: 'text' },
      ],
    },
  ],
}
