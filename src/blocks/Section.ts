import type { Block } from 'payload'
import { sectionHeaderFields } from '../fields/sectionHeader'
import { FAQsBlock } from './FAQs'
import { RichTextBlock } from './RichText'

/**
 * Section — the universal section container.
 * Every content section on the site is a Section block.
 * Provides background, optional centered header, and nested content block.
 *
 * Inner blocks are added here as they're built.
 */
export const SectionBlock: Block = {
  slug: 'section',
  labels: { singular: 'Section', plural: 'Sections' },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'bg',
          type: 'select',
          defaultValue: 'white',
          label: 'Background',
          options: [
            { label: 'White', value: 'white' },
            { label: 'Muted (cream)', value: 'muted' },
            { label: 'Dark (navy)', value: 'dark' },
          ],
          admin: { width: '30%' },
        },
        {
          name: 'scene',
          type: 'select',
          label: 'Decorative Scene',
          options: [
            { label: 'Default', value: 'default' },
            { label: 'Glow', value: 'glow' },
            { label: 'Rings', value: 'rings' },
            { label: 'Grid', value: 'grid' },
            { label: 'Waves', value: 'waves' },
            { label: 'Split', value: 'split' },
            { label: 'Edge', value: 'edge' },
            { label: 'Minimal', value: 'minimal' },
          ],
          admin: { width: '30%' },
        },
        {
          name: 'sectionId',
          type: 'text',
          label: 'Anchor ID',
          admin: { width: '20%', description: 'e.g. "hero" for #hero links' },
        },
        {
          name: 'narrow',
          type: 'checkbox',
          label: 'Narrow (max-w-3xl)',
          defaultValue: false,
          admin: { width: '20%' },
        },
      ],
    },
    // Section header — leave empty when inner block has its own header (e.g. SplitContent)
    ...sectionHeaderFields(),
    {
      name: 'content',
      type: 'blocks',
      label: 'Content',
      maxRows: 1,
      blocks: [
        // Inner blocks — add new ones here as they're built
        FAQsBlock,
        RichTextBlock,
      ],
    },
  ],
}
