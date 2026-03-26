import type { Block } from 'payload'

/**
 * PillGrid — inner block for Section.
 * Flex-wrapped grid of link pills.
 * Used for country lists, tag clouds, category links.
 */
export const PillGridBlock: Block = {
  slug: 'pill-grid',
  labels: { singular: 'Pill Grid', plural: 'Pill Grids' },
  fields: [
    {
      name: 'items',
      type: 'array',
      label: 'Pills',
      minRows: 1,
      maxRows: 60,
      admin: { initCollapsed: false },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
              localized: true,
              admin: { width: '50%', placeholder: 'Germany' },
            },
            {
              name: 'href',
              type: 'text',
              required: true,
              admin: { width: '50%', placeholder: '/vin-check/germany' },
            },
          ],
        },
      ],
    },
  ],
}
