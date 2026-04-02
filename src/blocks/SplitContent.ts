import type { Block } from 'payload'
import { ctasField } from '../fields/cta'
import { iconField } from '../fields/icon'

/**
 * SplitContent — inner block for Section.
 * Two-column layout: text + media.
 *
 * Text side: tag, heading (**marker** for gradient highlight),
 * description (richText), and optional CTAs.
 * Media side: image upload.
 *
 * The parent Section provides bg, scene, and SectionWrapper.
 */
export const SplitContentBlock: Block = {
  slug: 'split-content',
  labels: { singular: 'Split Content', plural: 'Split Contents' },
  fields: [
    // ── Tag ──
    {
      name: 'tag',
      type: 'text',
      localized: true,
      admin: { description: 'Small label above heading (e.g. "Why VIN Check")' },
    },

    // ── Heading + level ──
    {
      name: 'heading',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description:
          'Wrap text in **double asterisks** for gradient highlight on new line. Example: Save Money and Avoid **Costly Mistakes**',
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
        { label: 'Span (no heading)', value: 'span' },
      ],
      admin: { position: 'sidebar' },
    },

    // ── Content type ──
    {
      name: 'contentType',
      type: 'select',
      defaultValue: 'richtext',
      options: [
        { label: 'Rich Text', value: 'richtext' },
        { label: 'Card Grid', value: 'cards' },
      ],
      admin: { position: 'sidebar' },
    },

    // ── Body text ──
    {
      name: 'description',
      type: 'richText',
      localized: true,
    },

    // ── Card Grid (when contentType === 'cards') ──
    {
      name: 'cardColumns',
      type: 'select',
      defaultValue: '2',
      options: [
        { label: '1 Column', value: '1' },
        { label: '2 Columns', value: '2' },
      ],
      admin: {
        position: 'sidebar',
        condition: (_, siblingData) => siblingData.contentType === 'cards',
      },
    },
    {
      name: 'cards',
      type: 'array',
      label: 'Cards',
      maxRows: 8,
      admin: {
        initCollapsed: true,
        condition: (_, siblingData) => siblingData.contentType === 'cards',
      },
      fields: [
        iconField(),
        {
          type: 'row',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              localized: true,
              admin: { width: '50%' },
            },
            {
              name: 'titleElement',
              type: 'select',
              defaultValue: 'h4',
              options: [
                { label: 'H3', value: 'h3' },
                { label: 'H4', value: 'h4' },
              ],
              admin: { width: '25%' },
            },
            {
              name: 'colSpan',
              type: 'select',
              defaultValue: '1',
              label: 'Column Span',
              options: [
                { label: '1', value: '1' },
                { label: '2 (full row)', value: '2' },
              ],
              admin: { width: '25%' },
            },
          ],
        },
        {
          name: 'cardDescription',
          label: 'Description',
          type: 'richText',
          localized: true,
        },
      ],
    },

    // ── Media ──
    {
      name: 'mediaType',
      type: 'select',
      defaultValue: 'image',
      label: 'Media Type',
      options: [
        { label: 'Image', value: 'image' },
        { label: 'VIN Structure Widget', value: 'vin-structure' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Right-side image (recommended 600×500 or larger)',
        condition: (_, siblingData) => !siblingData.mediaType || siblingData.mediaType === 'image',
      },
    },

    // ── Layout ──
    {
      name: 'reverse',
      type: 'checkbox',
      label: 'Reverse Layout',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Media on left, text on right',
      },
    },

    // ── Icon List (only for richtext contentType) ──
    {
      name: 'listItems',
      type: 'array',
      label: 'Icon List',
      maxRows: 8,
      admin: {
        initCollapsed: true,
        condition: (_, siblingData) => !siblingData.contentType || siblingData.contentType === 'richtext',
      },
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
              name: 'variant',
              type: 'select',
              defaultValue: 'neutral',
              options: [
                { label: 'Success (green)', value: 'success' },
                { label: 'Danger (red)', value: 'danger' },
                { label: 'Neutral', value: 'neutral' },
                { label: 'Muted', value: 'muted' },
              ],
              admin: { width: '30%' },
            },
          ],
        },
      ],
    },

    // ── CTAs ──
    ctasField(),
  ],
}
