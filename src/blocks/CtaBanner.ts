import type { Block } from 'payload'

/**
 * CtaBanner — top-level CTA block.
 * Full-bleed or contained call-to-action with heading, description, and link or VIN input.
 * Renders its own background — NOT an inner block of Section.
 */
export const CtaBannerBlock: Block = {
  slug: 'cta-banner',
  labels: { singular: 'CTA Banner', plural: 'CTA Banners' },
  fields: [
    // ── Sidebar settings ──
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'full',
      label: 'Layout',
      options: [
        { label: 'Full Width', value: 'full' },
        { label: 'Contained', value: 'contained' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'dark',
      type: 'checkbox',
      defaultValue: true,
      label: 'Dark Background',
      admin: { position: 'sidebar' },
    },
    {
      name: 'scene',
      type: 'select',
      label: 'Scene',
      options: [
        { label: 'None', value: 'none' },
        { label: 'Glow', value: 'glow' },
      ],
      admin: {
        position: 'sidebar',
        condition: (_, siblingData) => siblingData.layout !== 'contained',
      },
    },
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

    // ── Tag ──
    {
      name: 'tag',
      type: 'text',
      localized: true,
      admin: { description: 'Small label above heading' },
    },

    // ── Heading + level ──
    {
      type: 'row',
      fields: [
        {
          name: 'heading',
          type: 'text',
          required: true,
          localized: true,
          admin: {
            width: '75%',
            description: 'Use **double asterisks** for gradient highlight',
          },
        },
        {
          name: 'headingLevel',
          type: 'select',
          defaultValue: 'h2',
          label: 'Element',
          options: [
            { label: 'H2', value: 'h2' },
            { label: 'H3', value: 'h3' },
            { label: 'H4', value: 'h4' },
          ],
          admin: { width: '25%' },
        },
      ],
    },

    // ── Description (rich text) ──
    {
      name: 'description',
      type: 'richText',
      localized: true,
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
