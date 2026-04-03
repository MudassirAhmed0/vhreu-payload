import type { Block } from 'payload'

/**
 * SampleReportGrid — inner block for Section.
 * Displays sample vehicle report cards with specs.
 */
export const SampleReportGridBlock: Block = {
  slug: 'sample-report-grid',
  labels: { singular: 'Sample Report Grid', plural: 'Sample Report Grids' },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'yearElement',
          type: 'select',
          label: 'Year Element',
          defaultValue: 'span',
          options: [
            { label: 'H2', value: 'h2' },
            { label: 'H3', value: 'h3' },
            { label: 'H4', value: 'h4' },
            { label: 'Span (no heading)', value: 'span' },
          ],
          admin: { width: '50%', description: 'HTML element for the year (e.g. 2006)' },
        },
        {
          name: 'nameElement',
          type: 'select',
          label: 'Name Element',
          defaultValue: 'h3',
          options: [
            { label: 'H2', value: 'h2' },
            { label: 'H3', value: 'h3' },
            { label: 'H4', value: 'h4' },
            { label: 'Span (no heading)', value: 'span' },
          ],
          admin: { width: '50%', description: 'HTML element for the make + model (e.g. Toyota Corolla)' },
        },
      ],
    },
    {
      name: 'reports',
      type: 'array',
      label: 'Sample Reports',
      minRows: 1,
      maxRows: 6,
      admin: { initCollapsed: false },
      fields: [
        {
          name: 'reportImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Report Preview Image',
        },
        {
          type: 'row',
          fields: [
            {
              name: 'year',
              type: 'number',
              required: true,
              admin: { width: '20%' },
            },
            {
              name: 'make',
              type: 'text',
              required: true,
              admin: { width: '40%', placeholder: 'Toyota' },
            },
            {
              name: 'model',
              type: 'text',
              required: true,
              admin: { width: '40%', placeholder: 'Corolla Verso' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'vin',
              type: 'text',
              required: true,
              admin: { width: '50%', placeholder: 'NMTER16RX0R073590' },
            },
            {
              name: 'bodyStyle',
              type: 'text',
              required: true,
              admin: { width: '50%', placeholder: '4 Doors Minivan' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'engine',
              type: 'text',
              required: true,
              admin: { width: '50%', placeholder: '1.8L L4 DOHC AWD' },
            },
            {
              name: 'country',
              type: 'text',
              required: true,
              admin: { width: '50%', placeholder: 'Turkey' },
            },
          ],
        },
        {
          name: 'href',
          type: 'text',
          label: 'Report Link',
          admin: { placeholder: '/report/vin/NMTER16RX0R073590' },
        },
      ],
    },
  ],
}
