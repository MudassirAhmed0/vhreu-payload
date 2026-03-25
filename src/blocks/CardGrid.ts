import type { Block } from 'payload'
import { iconField } from '../fields/icon'
import { ctasField } from '../fields/cta'

/**
 * CardGrid — inner block for Section.
 * Renders a responsive grid of cards with optional CTAs.
 *
 * Cards are unified: layout + content type.
 * - Layout: stacked (icon above), inline (icon beside title), centered
 * - Content: description (rich text) or checklist
 * - Optional: icon, stat number, accent color
 * - Callout is separate — it's a horizontal banner, not a card.
 */
export const CardGridBlock: Block = {
  slug: 'card-grid',
  labels: { singular: 'Card Grid', plural: 'Card Grids' },
  fields: [
    {
      name: 'columns',
      type: 'select',
      defaultValue: '3',
      label: 'Desktop Columns',
      options: [
        { label: '2', value: '2' },
        { label: '3', value: '3' },
        { label: '4', value: '4' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'tabletColumns',
      type: 'select',
      defaultValue: '2',
      label: 'Tablet Columns',
      options: [
        { label: '1', value: '1' },
        { label: '2', value: '2' },
        { label: '3', value: '3' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'mobileColumns',
      type: 'select',
      defaultValue: '1',
      label: 'Mobile Columns',
      options: [
        { label: '1', value: '1' },
        { label: '2', value: '2' },
      ],
      admin: { position: 'sidebar' },
    },

    // ── Cards ──
    {
      name: 'cards',
      type: 'array',
      label: 'Cards',
      minRows: 1,
      maxRows: 12,
      admin: { initCollapsed: false },
      fields: [
        // ── Card type: feature (unified) or callout (banner) ──
        {
          name: 'cardType',
          type: 'select',
          defaultValue: 'feature',
          required: true,
          label: 'Type',
          options: [
            { label: 'Feature Card', value: 'feature' },
            { label: 'Callout Banner', value: 'callout' },
          ],
        },

        // ── Column span (applies to all card types) ──
        {
          name: 'colSpan',
          type: 'select',
          defaultValue: '1',
          label: 'Column Span',
          options: [
            { label: '1', value: '1' },
            { label: '2', value: '2' },
            { label: '3', value: '3' },
            { label: '4', value: '4' },
            { label: 'Full Row', value: 'full' },
          ],
          admin: { width: '50%' },
        },

        // ═══════════════════════════════════════
        // FEATURE CARD fields
        // ═══════════════════════════════════════

        // ── Style + Layout (how it looks) ──
        {
          type: 'row',
          admin: {
            condition: (_, siblingData) => siblingData.cardType !== 'callout',
          },
          fields: [
            {
              name: 'style',
              type: 'select',
              defaultValue: 'none',
              label: 'Style',
              options: [
                { label: 'None', value: 'none' },
                { label: 'Icon', value: 'icon' },
                { label: 'Stat', value: 'stat' },
              ],
              admin: { width: '50%' },
            },
            {
              name: 'layout',
              type: 'select',
              defaultValue: 'stacked',
              label: 'Layout',
              options: [
                { label: 'Stacked', value: 'stacked' },
                { label: 'Inline', value: 'inline' },
                { label: 'Centered', value: 'centered' },
              ],
              admin: { width: '50%' },
            },
          ],
        },

        // ── Icon (when style = icon) ──
        {
          ...iconField('icon'),
          admin: {
            condition: (_, siblingData) =>
              siblingData.cardType !== 'callout' && siblingData.style === 'icon',
          },
        } as import('payload').Field,

        // ── Stat number + color (when style = stat) ──
        {
          type: 'row',
          admin: {
            condition: (_, siblingData) =>
              siblingData.cardType !== 'callout' && siblingData.style === 'stat',
          },
          fields: [
            {
              name: 'stat',
              type: 'text',
              label: 'Stat Number',
              admin: {
                placeholder: '30% or $4,200',
                width: '60%',
              },
            },
            {
              name: 'statColor',
              type: 'select',
              defaultValue: 'primary',
              label: 'Color',
              options: [
                { label: 'Primary', value: 'primary' },
                { label: 'Success', value: 'success' },
                { label: 'Danger', value: 'danger' },
                { label: 'Info', value: 'info' },
                { label: 'Warning', value: 'warning' },
                { label: 'Purple', value: 'purple' },
              ],
              admin: { width: '40%' },
            },
          ],
        },

        // ── Title + element ──
        {
          type: 'row',
          admin: {
            condition: (_, siblingData) => siblingData.cardType !== 'callout',
          },
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
                { label: 'h3', value: 'h3' },
                { label: 'h4', value: 'h4' },
                { label: 'h5', value: 'h5' },
                { label: 'p', value: 'p' },
              ],
              admin: { width: '25%' },
            },
          ],
        },

        // ── Content: description or icon list ──
        {
          name: 'contentType',
          type: 'select',
          defaultValue: 'description',
          label: 'Content Type',
          options: [
            { label: 'Description', value: 'description' },
            { label: 'Icon List', value: 'list' },
          ],
          admin: {
            condition: (_, siblingData) => siblingData.cardType !== 'callout',
          },
        },

        // Description (rich text)
        {
          name: 'description',
          type: 'richText',
          localized: true,
          admin: {
            condition: (_, siblingData) =>
              siblingData.cardType !== 'callout' && siblingData.contentType !== 'list',
          },
        },

        // Icon List settings
        {
          type: 'row',
          admin: {
            condition: (_, siblingData) =>
              siblingData.cardType !== 'callout' && siblingData.contentType === 'list',
          },
          fields: [
            {
              ...iconField('listIcon'),
            } as import('payload').Field,
            {
              name: 'listVariant',
              type: 'select',
              defaultValue: 'success',
              label: 'List Color',
              options: [
                { label: 'Success (primary)', value: 'success' },
                { label: 'Danger (red)', value: 'danger' },
                { label: 'Neutral', value: 'neutral' },
                { label: 'Muted', value: 'muted' },
              ],
            },
            {
              name: 'listItemStyle',
              type: 'select',
              defaultValue: 'flat',
              label: 'Item Style',
              options: [
                { label: 'Flat', value: 'flat' },
                { label: 'Card', value: 'card' },
              ],
            },
          ],
        },

        // Icon List items
        {
          name: 'items',
          type: 'array',
          label: 'List Items',
          admin: {
            initCollapsed: false,
            condition: (_, siblingData) =>
              siblingData.cardType !== 'callout' && siblingData.contentType === 'list',
          },
          fields: [
            {
              name: 'content',
              type: 'richText',
              required: true,
              localized: true,
            },
          ],
        },

        // ═══════════════════════════════════════
        // CALLOUT BANNER fields
        // ═══════════════════════════════════════
        {
          name: 'calloutStat',
          type: 'text',
          label: 'Stat',
          admin: {
            placeholder: '30% or $4,200',
            condition: (_, siblingData) => siblingData.cardType === 'callout',
          },
        },
        {
          type: 'row',
          admin: {
            condition: (_, siblingData) => siblingData.cardType === 'callout',
          },
          fields: [
            {
              name: 'calloutTitle',
              type: 'text',
              localized: true,
              label: 'Title',
              admin: { width: '75%' },
            },
            {
              name: 'calloutTitleElement',
              type: 'select',
              defaultValue: 'p',
              label: 'Element',
              options: [
                { label: 'h3', value: 'h3' },
                { label: 'h4', value: 'h4' },
                { label: 'h5', value: 'h5' },
                { label: 'p', value: 'p' },
              ],
              admin: { width: '25%' },
            },
          ],
        },
        {
          name: 'calloutDescription',
          type: 'richText',
          localized: true,
          label: 'Description',
          admin: {
            condition: (_, siblingData) => siblingData.cardType === 'callout',
          },
        },
      ],
    },

    // ── CTAs ──
    ctasField(),
  ],
}
