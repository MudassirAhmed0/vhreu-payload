import type { Block } from 'payload'

export const PageHeroBlock: Block = {
  slug: 'page-hero',
  labels: { singular: 'Page Hero', plural: 'Page Heroes' },
  imageURL: '/api/media/file/hero-block-preview.png',
  fields: [
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'centered',
      required: true,
      options: [
        { label: 'Centered', value: 'centered' },
        { label: 'Split (text left, image right)', value: 'split' },
        { label: 'Stacked', value: 'stacked' },
      ],
    },
    {
      name: 'dark',
      type: 'checkbox',
      defaultValue: true,
      label: 'Dark Background',
      admin: { position: 'sidebar' },
    },
    {
      name: 'fullHeight',
      type: 'checkbox',
      defaultValue: true,
      label: 'Full Viewport Height',
      admin: { position: 'sidebar' },
    },
    {
      name: 'glow',
      type: 'checkbox',
      defaultValue: true,
      label: 'Glow Effect',
      admin: { position: 'sidebar' },
    },
    {
      name: 'showVinForm',
      type: 'checkbox',
      defaultValue: false,
      label: 'Show VIN Search Form',
      admin: { position: 'sidebar' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'tag',
          type: 'text',
          localized: true,
          admin: { width: '50%', description: 'Small label above heading (e.g. "Trusted by 50,000+ Buyers")' },
        },
      ],
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      admin: { description: 'Main heading text' },
    },
    {
      name: 'highlight',
      type: 'text',
      localized: true,
      admin: { description: 'Bold gradient portion of heading' },
    },
    {
      name: 'subtitle',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'bullets',
      type: 'array',
      label: 'Trust Badges',
      maxRows: 6,
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
          localized: true,
        },
      ],
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Right-side image for split variant (580×660 recommended)',
        condition: (_, { variant }) => variant === 'split',
      },
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Optional background image' },
    },
    {
      name: 'helperLinks',
      type: 'array',
      label: 'Helper Links',
      maxRows: 4,
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
              localized: true,
              admin: { width: '50%' },
            },
            {
              name: 'href',
              type: 'text',
              required: true,
              admin: { width: '50%' },
            },
          ],
        },
        {
          name: 'style',
          type: 'select',
          defaultValue: 'primary',
          options: [
            { label: 'Primary', value: 'primary' },
            { label: 'Secondary', value: 'secondary' },
          ],
        },
        {
          name: 'icon',
          type: 'text',
          admin: { description: 'Lucide icon name (optional)' },
        },
      ],
    },
  ],
}
