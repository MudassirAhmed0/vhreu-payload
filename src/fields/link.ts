import type { Field } from 'payload'

/**
 * Reusable link field group with SEO attributes.
 * Use everywhere a link appears — CTAs, nav, footer, blocks.
 *
 * Fields: label, linkType (internal/external), page, url,
 *         newTab, rel (dofollow/nofollow/sponsored/ugc), icon
 */
export function linkField(options?: {
  /** Include label field. Default true. */
  label?: boolean
  /** Include icon field. Default false. */
  icon?: boolean
  /** Include style field. Default false. */
  style?: boolean
  /** Localize label. Default true. */
  localized?: boolean
}): Field {
  const { label = true, icon = false, style = false, localized = true } = options || {}

  const fields: Field[] = []

  if (label) {
    fields.push({
      name: 'label',
      type: 'text',
      required: true,
      localized,
      admin: { width: '50%' },
    })
  }

  fields.push(
    {
      name: 'linkType',
      type: 'select',
      defaultValue: 'external',
      options: [
        { label: 'Internal Page', value: 'internal' },
        { label: 'External URL', value: 'external' },
      ],
      admin: { width: '50%' },
    },
    {
      name: 'page',
      type: 'relationship',
      relationTo: 'pages',
      admin: {
        condition: (_, { linkType }) => linkType === 'internal',
        width: '50%',
      },
    },
    {
      name: 'url',
      type: 'text',
      admin: {
        condition: (_, { linkType }) => linkType !== 'internal',
        width: '50%',
        description: 'Full URL including https://',
      },
    },
    {
      name: 'newTab',
      type: 'checkbox',
      label: 'Open in new tab',
      defaultValue: false,
      admin: { width: '25%' },
    },
    {
      name: 'rel',
      type: 'select',
      label: 'Link Rel',
      defaultValue: 'none',
      options: [
        { label: 'Default (dofollow)', value: 'none' },
        { label: 'nofollow', value: 'nofollow' },
        { label: 'sponsored', value: 'sponsored' },
        { label: 'ugc', value: 'ugc' },
        { label: 'nofollow noopener', value: 'nofollow noopener' },
      ],
      admin: { width: '25%' },
    },
  )

  if (style) {
    fields.push({
      name: 'style',
      type: 'select',
      defaultValue: 'primary',
      options: [
        { label: 'Primary', value: 'primary' },
        { label: 'Secondary', value: 'secondary' },
        { label: 'Ghost', value: 'ghost' },
      ],
      admin: { width: '25%' },
    })
  }

  if (icon) {
    fields.push({
      name: 'icon',
      type: 'text',
      admin: {
        description: 'Lucide icon name (optional)',
        width: '25%',
      },
    })
  }

  return {
    name: 'link',
    type: 'group',
    fields,
  }
}

/**
 * Array of links — for nav, footer, helper links, etc.
 */
export function linksArrayField(
  name: string,
  options?: Parameters<typeof linkField>[0] & { maxRows?: number; label?: string },
): Field {
  const { maxRows, label: arrayLabel, ...linkOptions } = options || {}
  return {
    name,
    type: 'array',
    label: arrayLabel,
    maxRows,
    fields: linkField(linkOptions).type === 'group'
      ? (linkField(linkOptions) as { fields: Field[] }).fields
      : [],
  }
}
