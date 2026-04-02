import type { Block } from 'payload'
import { iconField } from '../fields/icon'

/**
 * AudienceTabs — inner block for Section.
 * Renders audience-segmented content as tabbed panels.
 * All panels are in the DOM for bot readability — tabs toggle visibility.
 *
 * Example: "Why Do You Need a Window Sticker Lookup?"
 * → Buyers | Sellers & Dealers | Enthusiasts tabs
 */
export const AudienceTabsBlock: Block = {
  slug: 'audience-tabs',
  labels: { singular: 'Audience Tabs', plural: 'Audience Tabs' },
  fields: [
    {
      name: 'panels',
      type: 'array',
      label: 'Audience Panels',
      minRows: 2,
      maxRows: 5,
      admin: { initCollapsed: false },
      fields: [
        // ── Icon ──
        iconField('icon'),

        // ── Title + element ──
        {
          type: 'row',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              localized: true,
              admin: { width: '75%' },
            },
            {
              name: 'titleElement',
              type: 'select',

              defaultValue: 'h3',
              label: 'Element',
              options: [
                { label: 'H2', value: 'h2' },
                { label: 'H3', value: 'h3' },
                { label: 'H4', value: 'h4' },
                { label: 'H5', value: 'h5' },
                { label: 'Span (no heading)', value: 'span' },
              ],
              admin: { width: '25%' },
            },
          ],
        },

        // ── Intro paragraph ──
        {
          name: 'description',
          type: 'richText',
          localized: true,
          label: 'Intro Text',
        },

        // ── Benefits ──
        {
          name: 'benefits',
          type: 'array',
          label: 'Benefits',
          minRows: 1,
          maxRows: 6,
          admin: { initCollapsed: false },
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                  localized: true,
                  admin: { width: '75%' },
                },
                {
                  name: 'titleElement',
                  type: 'select',

                  defaultValue: 'h4',
                  label: 'Element',
                  options: [
                    { label: 'H3', value: 'h3' },
                    { label: 'H4', value: 'h4' },
                    { label: 'H5', value: 'h5' },
                    { label: 'P (bold)', value: 'p' },
                    { label: 'Span (no heading)', value: 'span' },
                  ],
                  admin: { width: '25%' },
                },
              ],
            },
            {
              name: 'description',
              type: 'richText',
              localized: true,
            },
          ],
        },
      ],
    },
  ],
}
