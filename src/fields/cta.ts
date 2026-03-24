import type { Field } from 'payload'

/**
 * Lightweight CTA group — label + href.
 * For simple anchor-style CTAs (e.g. "Check VIN Now!" → "#hero").
 * Use linkField() instead when you need internal/external routing, rel, newTab.
 */
export function ctaGroup(name: string, options?: {
  /** Admin label override */
  label?: string
}): Field {
  const { label } = options || {}

  return {
    name,
    type: 'group',
    label: label || name.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase()),
    fields: [
      {
        type: 'row',
        fields: [
          {
            name: 'label',
            type: 'text',
            localized: true,
            admin: { width: '60%' },
          },
          {
            name: 'href',
            type: 'text',
            admin: { width: '40%' },
          },
        ],
      },
    ],
  }
}
