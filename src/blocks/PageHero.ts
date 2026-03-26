import type { Block } from 'payload'
import { iconField } from '../fields/icon'

export const PageHeroBlock: Block = {
  slug: 'page-hero',
  labels: { singular: 'Page Hero', plural: 'Page Heroes' },
  fields: [
    // ── Layout ──
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'centered',
      required: true,
      options: [
        { label: 'Centered', value: 'centered' },
        { label: 'Split (text left, media right)', value: 'split' },
      ],
    },

    // ── Sidebar settings ──
    {
      name: 'dark',
      type: 'checkbox',
      defaultValue: true,
      label: 'Dark Background',
      admin: { position: 'sidebar' },
    },
    {
      name: 'fullHeight',
      type: 'checkbox',
      defaultValue: true,
      label: 'Full Viewport Height',
      admin: { position: 'sidebar' },
    },
    {
      name: 'glow',
      type: 'checkbox',
      defaultValue: true,
      label: 'Glow Effect',
      admin: { position: 'sidebar' },
    },
    {
      name: 'formType',
      type: 'select',
      defaultValue: 'none',
      label: 'Form',
      options: [
        { label: 'None', value: 'none' },
        { label: 'VIN Search', value: 'vin' },
        { label: 'Contact Form', value: 'contact' },
      ],
      admin: { position: 'sidebar' },
    },

    // ── Tag (optional — collapsible) ──
    {
      type: 'collapsible',
      label: 'Tag (label above heading)',
      admin: { initCollapsed: true },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'tag',
              type: 'text',
              localized: true,
              admin: { width: '70%' },
            },
            {
              name: 'tagLevel',
              type: 'select',
              defaultValue: 'span',
              label: 'Element',
              options: [
                { label: 'span', value: 'span' },
                { label: 'h2', value: 'h2' },
                { label: 'h3', value: 'h3' },
                { label: 'h4', value: 'h4' },
                { label: 'p', value: 'p' },
              ],
              admin: { width: '30%' },
            },
          ],
        },
      ],
    },

    // ── Main content ──
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description: 'Use **double asterisks** to highlight. Example: Check Any European Vehicle\'s **Full History Report**',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
    },

    // ── Secondary heading (optional — collapsible) ──
    {
      type: 'collapsible',
      label: 'Secondary Heading',
      admin: { initCollapsed: true },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'secondaryHeading',
              type: 'text',
              localized: true,
              admin: { width: '70%', description: 'Accent heading before CTAs' },
            },
            {
              name: 'secondaryHeadingLevel',
              type: 'select',
              defaultValue: 'h3',
              label: 'Element',
              options: [
                { label: 'h2', value: 'h2' },
                { label: 'h3', value: 'h3' },
                { label: 'h4', value: 'h4' },
                { label: 'p', value: 'p' },
              ],
              admin: { width: '30%' },
            },
          ],
        },
      ],
    },

    // ── Trust badges ──
    {
      name: 'bullets',
      type: 'array',
      label: 'Trust Badges',
      maxRows: 6,
      admin: { initCollapsed: true },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'text',
              type: 'text',
              required: true,
              localized: true,
              admin: { width: '70%' },
            },
            {
              name: 'tag',
              type: 'select',
              defaultValue: 'span',
              label: 'Element',
              options: [
                { label: 'span', value: 'span' },
                { label: 'h2', value: 'h2' },
                { label: 'h3', value: 'h3' },
                { label: 'h4', value: 'h4' },
                { label: 'h5', value: 'h5' },
                { label: 'p', value: 'p' },
              ],
              admin: { width: '30%' },
            },
          ],
        },
      ],
    },

    // ── Feature highlights ──
    {
      name: 'features',
      type: 'array',
      label: 'Feature Highlights',
      maxRows: 8,
      admin: { initCollapsed: true },
      fields: [
        iconField(),
        {
          type: 'row',
          fields: [
            {
              name: 'text',
              type: 'text',
              required: true,
              localized: true,
              admin: { width: '70%' },
            },
            {
              name: 'tag',
              type: 'select',
              defaultValue: 'span',
              label: 'Element',
              options: [
                { label: 'span', value: 'span' },
                { label: 'h2', value: 'h2' },
                { label: 'h3', value: 'h3' },
                { label: 'h4', value: 'h4' },
                { label: 'h5', value: 'h5' },
                { label: 'p', value: 'p' },
              ],
              admin: { width: '30%' },
            },
          ],
        },
      ],
    },

    // ── Media ──
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Right-side image (580×660 recommended)',
        condition: (_, { variant }) => variant === 'split',
      },
    },

    // ── CTA buttons ──
    {
      name: 'ctas',
      type: 'array',
      label: 'CTA Buttons',
      maxRows: 4,
      admin: { initCollapsed: true },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'label', type: 'text', required: true, localized: true, admin: { width: '40%' } },
            { name: 'href', type: 'text', required: true, admin: { width: '40%' } },
            {
              name: 'style',
              type: 'select',
              defaultValue: 'primary',
              options: [
                { label: 'Primary', value: 'primary' },
                { label: 'Secondary', value: 'secondary' },
              ],
              admin: { width: '20%' },
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
              options: [
                { label: 'Default', value: 'none' },
                { label: 'nofollow', value: 'nofollow' },
                { label: 'sponsored', value: 'sponsored' },
                { label: 'ugc', value: 'ugc' },
              ],
              admin: { width: '40%' },
            },
            { name: 'newTab', type: 'checkbox', label: 'Open in new tab', defaultValue: false, admin: { width: '60%' } },
          ],
        },
      ],
    },

    // ── Helper links ──
    {
      name: 'helperLinks',
      type: 'array',
      label: 'Helper Links',
      maxRows: 4,
      admin: {
        initCollapsed: true,
        condition: (_, siblingData) => {
          if (siblingData.variant === 'split' && siblingData.heroImage) return false
          return true
        },
      },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'label', type: 'text', required: true, localized: true, admin: { width: '35%' } },
            { name: 'href', type: 'text', required: true, admin: { width: '35%' } },
            {
              name: 'style',
              type: 'select',
              defaultValue: 'arrow',
              options: [
                { label: 'Arrow', value: 'arrow' },
                { label: 'Pill', value: 'pill' },
              ],
              admin: { width: '15%' },
            },
            { name: 'icon', type: 'text', admin: { width: '15%', placeholder: 'Lucide icon' } },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'rel',
              type: 'select',
              defaultValue: 'none',
              options: [
                { label: 'Default', value: 'none' },
                { label: 'nofollow', value: 'nofollow' },
                { label: 'sponsored', value: 'sponsored' },
                { label: 'ugc', value: 'ugc' },
              ],
              admin: { width: '40%' },
            },
            { name: 'newTab', type: 'checkbox', label: 'Open in new tab', defaultValue: false, admin: { width: '60%' } },
          ],
        },
      ],
    },
  ],
}
