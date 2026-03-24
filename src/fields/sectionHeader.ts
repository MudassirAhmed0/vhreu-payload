import type { Field } from 'payload'

/**
 * Shared section header fields — tag, heading, highlight, subtitle.
 * Spread into any block that uses SectionWrapper-style headers.
 *
 * All fields are optional and localized.
 */
export function sectionHeaderFields(options?: {
  /** Make heading required. Default false. */
  headingRequired?: boolean
}): Field[] {
  const { headingRequired = false } = options || {}

  return [
    {
      type: 'row',
      fields: [
        {
          name: 'tag',
          type: 'text',
          localized: true,
          admin: { width: '40%', description: 'Small label above heading' },
        },
        {
          name: 'heading',
          type: 'text',
          required: headingRequired,
          localized: true,
          admin: { width: '60%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'highlight',
          type: 'text',
          localized: true,
          admin: { width: '50%', description: 'Bold gradient portion of heading' },
        },
        {
          name: 'subtitle',
          type: 'textarea',
          localized: true,
          admin: { width: '50%' },
        },
      ],
    },
  ]
}
