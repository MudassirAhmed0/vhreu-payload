import type { Block } from 'payload'

/**
 * Pricing — inner block for Section.
 * Fetches plans from CWA backend at runtime.
 * No plan data stored in Payload — just display config.
 */
export const PricingBlock: Block = {
  slug: 'pricing',
  labels: { singular: 'Pricing', plural: 'Pricing' },
  fields: [
    {
      name: 'showSubscriptions',
      type: 'checkbox',
      label: 'Show Subscription Plans',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    {
      name: 'featuredPlanCode',
      type: 'text',
      label: 'Featured Plan Code',
      admin: {
        position: 'sidebar',
        description: 'Plan code to highlight as "Popular" (e.g. AUH5)',
      },
    },
    {
      name: 'columns',
      type: 'select',
      defaultValue: '3',
      label: 'Desktop Columns',
      options: [
        { label: '2', value: '2' },
        { label: '3', value: '3' },
        { label: '4', value: '4' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
}
