import type { CollectionConfig } from 'payload'
import { slugField } from '../fields/slug'
import { revalidatePage } from '../hooks/revalidate'
import { PageHeroBlock } from '../blocks/PageHero'
import { SectionBlock } from '../blocks/Section'
import { CtaBannerBlock } from '../blocks/CtaBanner'
import { ContactFormBlock } from '../blocks/ContactForm'
import { LegalContentBlock } from '../blocks/LegalContent'
import { RefundFormBlock } from '../blocks/RefundForm'

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
              blocks: [PageHeroBlock, SectionBlock, CtaBannerBlock, ContactFormBlock, RefundFormBlock, LegalContentBlock],
              admin: {
                components: {
                  RowLabel: '@/components/BlockRowLabel',
                },
              },
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
