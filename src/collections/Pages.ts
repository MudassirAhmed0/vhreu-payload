import type { CollectionConfig } from 'payload'
import { slugField } from '../fields/slug'
import { revalidatePage } from '../hooks/revalidate'
import { PageHeroBlock } from '../blocks/PageHero'
import { SectionBlock } from '../blocks/Section'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  versions: {
    drafts: true,
  },
  hooks: {
    afterChange: [revalidatePage],
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
      admin: { position: 'sidebar' },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'content',
              type: 'blocks',
              localized: true,
              blocks: [PageHeroBlock, SectionBlock],
            },
          ],
        },
        {
          label: 'Exit Popup',
          fields: [
            {
              name: 'exitPopup',
              type: 'group',
              fields: [
                { name: 'enabled', type: 'checkbox', defaultValue: false },
                {
                  name: 'title',
                  type: 'text',
                  localized: true,
                  admin: { condition: (_, { enabled }) => enabled },
                },
                {
                  name: 'subtitle',
                  type: 'text',
                  localized: true,
                  admin: { condition: (_, { enabled }) => enabled },
                },
                {
                  name: 'description',
                  type: 'textarea',
                  localized: true,
                  admin: { condition: (_, { enabled }) => enabled },
                },
                {
                  name: 'ctaText',
                  type: 'text',
                  localized: true,
                  admin: { condition: (_, { enabled }) => enabled },
                },
                {
                  name: 'offerImage',
                  type: 'upload',
                  relationTo: 'media',
                  admin: { condition: (_, { enabled }) => enabled },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
