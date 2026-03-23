import type { CollectionConfig } from 'payload'
import { slugField } from '../fields/slug'
import { revalidatePost } from '../hooks/revalidate'

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: { singular: 'Post', plural: 'Posts' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'author', 'publishedAt', 'status'],
    group: 'Blog',
  },
  access: {
    read: () => true,
  },
  versions: {
    drafts: true,
  },
  hooks: {
    afterChange: [revalidatePost],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    slugField,
    {
      name: 'publishedAt',
      type: 'date',
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly' } },
    },
    {
      name: 'readTime',
      type: 'number',
      admin: { position: 'sidebar', description: 'Minutes' },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Info',
          fields: [
            {
              name: 'author',
              type: 'relationship',
              relationTo: 'authors',
              required: true,
            },
            {
              name: 'categories',
              type: 'relationship',
              relationTo: 'categories',
              hasMany: true,
            },
            {
              name: 'featuredImage',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'excerpt',
              type: 'textarea',
              required: true,
              localized: true,
            },
          ],
        },
        {
          label: 'Content',
          fields: [
            {
              name: 'content',
              type: 'richText',
              localized: true,
            },
          ],
        },
        {
          label: 'Related Posts',
          fields: [
            {
              name: 'relatedMode',
              type: 'select',
              defaultValue: 'dynamic',
              options: [
                { label: 'Dynamic (auto)', value: 'dynamic' },
                { label: 'Manual', value: 'manual' },
              ],
            },
            {
              name: 'relatedPosts',
              type: 'relationship',
              relationTo: 'posts',
              hasMany: true,
              admin: {
                condition: (_, { relatedMode }) => relatedMode === 'manual',
              },
            },
          ],
        },
      ],
    },
  ],
}
