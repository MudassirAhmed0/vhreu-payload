import type { Field } from 'payload'

/**
 * Shared section header fields — tag, heading, headingLevel, description.
 * Spread into any block that uses SectionWrapper-style headers.
 *
 * Heading supports **marker** syntax for gradient highlights:
 *   "Why You Should Run a **European VIN Check**"
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
      name: 'tag',
      type: 'text',
      localized: true,
      admin: { description: 'Small label above heading' },
    },
    {
      name: 'heading',
      type: 'text',
      required: headingRequired,
      localized: true,
      admin: {
        description: 'Wrap text in **double asterisks** to highlight. Example: Why You Should Run a **European VIN Check**',
      },
    },
    {
      name: 'headingLevel',
      type: 'select',
      defaultValue: 'h2',
      options: [
        { label: 'H2', value: 'h2' },
        { label: 'H3', value: 'h3' },
        { label: 'H4', value: 'h4' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'description',
      type: 'richText',
      localized: true,
    },
  ]
}
