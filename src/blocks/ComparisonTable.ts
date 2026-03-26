import type { Block } from 'payload'

/**
 * ComparisonTable — inner block for Section.
 * Flexible data table: first row = header, every cell is rich text or check/x.
 * Column widths optional — responsive horizontal scroll by default.
 */
export const ComparisonTableBlock: Block = {
  slug: 'comparison-table',
  labels: { singular: 'Comparison Table', plural: 'Comparison Tables' },
  fields: [
    // ── Sidebar settings ──
    {
      name: 'stickyFirstColumn',
      type: 'checkbox',
      label: 'Sticky First Column',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Pin first column on mobile scroll',
      },
    },
    {
      name: 'highlightColumn',
      type: 'number',
      label: 'Highlight Column',
      admin: {
        position: 'sidebar',
        description: 'Column index to highlight (1-based). Leave empty for none.',
      },
    },

    // ── Column widths (optional) ──
    {
      name: 'columnWidths',
      type: 'array',
      label: 'Column Widths',
      labels: { singular: 'Column Width', plural: 'Column Widths' },
      admin: {
        description: 'Optional — one entry per column. Leave empty for equal-width.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'mobile',
              type: 'text',
              label: 'Mobile',
              admin: {
                placeholder: '150px, 40%, auto',
                width: '50%',
              },
            },
            {
              name: 'desktop',
              type: 'text',
              label: 'Desktop',
              admin: {
                placeholder: '200px, 50%, auto',
                width: '50%',
              },
            },
          ],
        },
      ],
    },

    // ── Rows — first row is always the header ──
    {
      name: 'rows',
      type: 'array',
      required: true,
      minRows: 2,
      label: 'Rows',
      admin: {
        description: 'First row becomes the table header',
        initCollapsed: false,
      },
      fields: [
        {
          name: 'cells',
          type: 'array',
          label: 'Cells',
          minRows: 2,
          admin: { initCollapsed: false },
          fields: [
            {
              name: 'type',
              type: 'select',
              defaultValue: 'richtext',
              required: true,
              options: [
                { label: 'Rich Text', value: 'richtext' },
                { label: '✓ Check', value: 'check' },
                { label: '✗ X', value: 'x' },
              ],
              admin: { width: '30%' },
            },
            {
              name: 'content',
              type: 'richText',
              localized: true,
              admin: {
                condition: (_, siblingData) => siblingData.type === 'richtext',
              },
            },
          ],
        },
      ],
    },
  ],
}
