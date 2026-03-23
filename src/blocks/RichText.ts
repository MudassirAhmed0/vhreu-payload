import type { Block } from 'payload'

export const RichTextBlock: Block = {
  slug: 'rich-text',
  labels: { singular: 'Rich Text', plural: 'Rich Text' },
  fields: [
    {
      name: 'content',
      type: 'richText',
      localized: true,
    },
  ],
}
