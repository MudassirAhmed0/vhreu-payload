import type { Block } from 'payload'
import { iconField } from '../fields/icon'
import { ctasField } from '../fields/cta'

/**
 * Steps — inner block for Section.
 * Numbered step-by-step process (e.g. "How It Works").
 * Parent Section provides header, background, padding.
 */
export const StepsBlock: Block = {
  slug: 'steps',
  labels: { singular: 'Steps', plural: 'Steps' },
  fields: [
    {
      name: 'style',
      type: 'select',
      defaultValue: 'icons',
      label: 'Step Style',
      options: [
        { label: 'Icons', value: 'icons' },
        { label: 'Numbers', value: 'numbers' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'titleElement',
      type: 'select',
      defaultValue: 'h3',
      label: 'Title Element',
      options: [
        { label: 'H3', value: 'h3' },
        { label: 'H4', value: 'h4' },
        { label: 'Span (no heading)', value: 'span' },
      ],
      admin: { position: 'sidebar' },
    },

    // ── Steps ──
    {
      name: 'steps',
      type: 'array',
      required: true,
      minRows: 2,
      maxRows: 7,
      admin: { initCollapsed: false },
      fields: [
        {
          name: 'title',
          type: 'text',
          localized: true,
          admin: { placeholder: 'Step heading (optional)' },
        },
        {
          name: 'description',
          type: 'text',
          required: true,
          localized: true,
        },
        iconField('icon'),
      ],
    },

    {
      name: 'bottomText',
      type: 'richText',
      label: 'Bottom Text',
      localized: true,
    },

    // ── CTAs below steps ──
    ctasField(),
  ],
}
