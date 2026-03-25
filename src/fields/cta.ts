import type { Field } from 'payload'

/**
 * CTA buttons array — editors add only when needed.
 * Each CTA has label, href, and style (primary/secondary).
 * Returns a single array field. Max 2 buttons by default.
 */
export function ctasField(options?: {
  /** Field name. Default: 'ctas' */
  name?: string
  /** Max CTA buttons. Default: 2 */
  maxRows?: number
}): Field {
  const { name = 'ctas', maxRows = 2 } = options || {}

  return {
    name,
    type: 'array',
    label: 'CTA Buttons',
    maxRows,
    admin: {
      initCollapsed: true,
      description: 'Optional call-to-action buttons below content',
    },
    fields: [
      {
        type: 'row',
        fields: [
          {
            name: 'label',
            type: 'text',
            required: true,
            localized: true,
            admin: { width: '40%', placeholder: 'Check VIN Now!' },
          },
          {
            name: 'href',
            type: 'text',
            required: true,
            admin: { width: '35%', placeholder: '/sample-report or #hero' },
          },
          {
            name: 'style',
            type: 'select',
            defaultValue: 'primary',
            options: [
              { label: 'Primary', value: 'primary' },
              { label: 'Secondary', value: 'secondary' },
            ],
            admin: { width: '25%' },
          },
        ],
      },
      {
        type: 'row',
        fields: [
          {
            name: 'rel',
            type: 'select',
            defaultValue: 'none',
            label: 'Link Rel',
            options: [
              { label: 'Default', value: 'none' },
              { label: 'nofollow', value: 'nofollow' },
              { label: 'sponsored', value: 'sponsored' },
              { label: 'ugc', value: 'ugc' },
            ],
            admin: { width: '40%' },
          },
          {
            name: 'newTab',
            type: 'checkbox',
            label: 'Open in new tab',
            defaultValue: false,
            admin: { width: '60%' },
          },
        ],
      },
    ],
  }
}
