import type { Block } from 'payload'

export const RefundFormBlock: Block = {
  slug: 'refund-form',
  labels: { singular: 'Refund Form', plural: 'Refund Forms' },
  fields: [
    {
      name: 'heading',
      type: 'text',
      localized: true,
      admin: { description: 'Override the default heading' },
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
    },
  ],
}
