import type { Block } from 'payload'

export const FAQsBlock: Block = {
  slug: 'faqs',
  labels: { singular: 'FAQs', plural: 'FAQs' },
  fields: [
    {
      name: 'questionElement',
      type: 'select',
      defaultValue: 'h3',
      options: [
        { label: 'H3', value: 'h3' },
        { label: 'H4', value: 'h4' },
        { label: 'H5', value: 'h5' },
        { label: 'Span (no heading)', value: 'span' },
      ],
      admin: { position: 'sidebar', description: 'HTML element for each question' },
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'question',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'answer',
          type: 'richText',
          required: true,
          localized: true,
        },
      ],
    },
  ],
}
