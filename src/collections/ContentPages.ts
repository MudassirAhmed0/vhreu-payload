import type { CollectionConfig } from 'payload'
import { slugField } from '../fields/slug'
import { PageHeroBlock } from '../blocks/PageHero'
import { SectionBlock } from '../blocks/Section'
import { CtaBannerBlock } from '../blocks/CtaBanner'

export const ContentPages: CollectionConfig = {
  slug: 'content-pages',
  dbName: 'cp',
  labels: { singular: 'Content Page', plural: 'Content Pages' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'group', 'slug', 'status', 'updatedAt'],
    group: 'Content',
    listSearchableFields: ['name', 'slug'],
  },
  access: {
    read: () => true,
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          localized: true,
          admin: { width: '50%' },
        },
        {
          name: 'group',
          type: 'relationship',
          relationTo: 'content-groups',
          required: true,
          admin: { width: '50%' },
        },
      ],
    },
    slugField,
    // ── Sidebar ──
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
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Logo / Icon',
      admin: { position: 'sidebar' },
    },
    // ── Content ──
    {
      name: 'content',
      type: 'blocks',
      localized: true,
      blocks: [PageHeroBlock, SectionBlock, CtaBannerBlock],
      admin: {
        components: {
          RowLabel: '@/components/BlockRowLabel',
        },
      },
    },
  ],
}
