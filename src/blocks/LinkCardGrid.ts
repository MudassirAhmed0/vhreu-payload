import type { Block } from 'payload'

/**
 * LinkCardGrid — inner block for Section.
 * Responsive grid of rectangular cards.
 * Used for car makes, brand decoders, category navigation.
 *
 * Items with href render as links with hover effects.
 * Items without href render as static display cards.
 */
export const LinkCardGridBlock: Block = {
  slug: 'link-card-grid',
  labels: { singular: 'Link Card Grid', plural: 'Link Card Grids' },
  fields: [
    // ── Responsive columns — sidebar ──
    {
      name: 'columns',
      type: 'select',
      defaultValue: '5',
      label: 'Desktop Columns',
      options: [
        { label: '2', value: '2' },
        { label: '3', value: '3' },
        { label: '4', value: '4' },
        { label: '5', value: '5' },
        { label: '6', value: '6' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'tabletColumns',
      type: 'select',
      defaultValue: '3',
      label: 'Tablet Columns',
      options: [
        { label: '1', value: '1' },
        { label: '2', value: '2' },
        { label: '3', value: '3' },
        { label: '4', value: '4' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'mobileColumns',
      type: 'select',
      defaultValue: '2',
      label: 'Mobile Columns',
      options: [
        { label: '1', value: '1' },
        { label: '2', value: '2' },
        { label: '3', value: '3' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'size',
      type: 'select',
      defaultValue: 'regular',
      label: 'Card Size',
      options: [
        { label: 'Small', value: 'small' },
        { label: 'Regular', value: 'regular' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'items',
      type: 'array',
      label: 'Cards',
      minRows: 1,
      maxRows: 30,
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
              admin: { width: '50%', placeholder: 'BMW' },
            },
            {
              name: 'href',
              type: 'text',
              admin: {
                width: '50%',
                placeholder: '/vin-decoder/bmw',
                description: 'Leave empty for non-clickable display card',
              },
            },
          ],
        },
      ],
    },
  ],
}
