import type { Block } from 'payload'
import { ctasField } from '../fields/cta'

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
      ],
      admin: { position: 'sidebar' },
    },

    // ── Body text ──
    {
      name: 'description',
      type: 'richText',
      localized: true,
    },

    // ── Media ──
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Right-side image (recommended 600×500 or larger)',
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

    // ── CTAs ──
    ctasField(),
  ],
}
