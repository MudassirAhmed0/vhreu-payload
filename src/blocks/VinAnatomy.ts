import type { Block } from 'payload'

/**
 * VIN Anatomy — inner block for Section.
 * Visual breakdown of a 17-digit VIN: color-coded character display
 * + segment explanation cards.
 * Parent Section provides header, background, padding.
 */
export const VinAnatomyBlock: Block = {
  slug: 'vin-anatomy',
  labels: { singular: 'VIN Anatomy', plural: 'VIN Anatomy' },
  fields: [
    {
      name: 'sampleVin',
      type: 'text',
      required: true,
      label: 'Sample VIN',
      admin: {
        placeholder: 'WAUZZZ8V5KA012345',
        description: '17-character Vehicle Identification Number',
      },
    },
    {
      name: 'titleElement',
      type: 'select',
      defaultValue: 'h3',
      label: 'Segment Title Element',
      options: [
        { label: 'H3', value: 'h3' },
        { label: 'H4', value: 'h4' },
        { label: 'Span (no heading)', value: 'span' },
      ],
      admin: {
        position: 'sidebar',
        description: 'HTML element for each segment title',
      },
    },
    {
      name: 'segments',
      type: 'array',
      required: true,
      minRows: 3,
      maxRows: 10,
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
              admin: { width: '30%', placeholder: 'WMI' },
            },
            {
              name: 'fullName',
              type: 'text',
              required: true,
              localized: true,
              admin: { width: '50%', placeholder: 'World Manufacturer Identifier' },
            },
            {
              name: 'digits',
              type: 'text',
              admin: { width: '20%', placeholder: '1-3', description: 'Leave empty for group headers (e.g. VIS)' },
            },
          ],
        },
        {
          name: 'description',
          type: 'richText',
          required: true,
          localized: true,
        },
      ],
    },
  ],
}
