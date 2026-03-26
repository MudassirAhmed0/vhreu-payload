import type { Block } from 'payload'

/**
 * CtaBanner — inner block for Section.
 * Call-to-action with heading, subtitle, and either a link button or VIN input.
 * Parent Section provides background, padding, and scene.
 */
export const CtaBannerBlock: Block = {
  slug: 'cta-banner',
  labels: { singular: 'CTA Banner', plural: 'CTA Banners' },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description: 'Use **double asterisks** for gradient highlight',
      },
    },
    {
      name: 'subtitle',
      type: 'textarea',
      localized: true,
    },

    // ── Mode ──
    {
      name: 'mode',
      type: 'select',
      defaultValue: 'link',
      label: 'CTA Type',
      options: [
        { label: 'Link Button', value: 'link' },
        { label: 'VIN Input', value: 'vin-input' },
      ],
      admin: { position: 'sidebar' },
    },

    // ── Link mode fields ──
    {
      type: 'row',
      admin: {
        condition: (_, siblingData) => siblingData.mode !== 'vin-input',
      },
      fields: [
        {
          name: 'ctaLabel',
          type: 'text',
          localized: true,
          admin: { width: '50%', placeholder: 'Check Now' },
        },
        {
          name: 'ctaHref',
          type: 'text',
          admin: { width: '50%', placeholder: '#hero or /pricing' },
        },
      ],
    },

    // ── VIN input mode fields ──
    {
      name: 'vinButtonText',
      type: 'text',
      localized: true,
      admin: {
        placeholder: 'Search VIN',
        condition: (_, siblingData) => siblingData.mode === 'vin-input',
      },
    },
  ],
}
