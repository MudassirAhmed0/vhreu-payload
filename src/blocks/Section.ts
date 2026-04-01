import type { Block } from 'payload'
import { sectionHeaderFields } from '../fields/sectionHeader'
import { ctasField } from '../fields/cta'
import { FAQsBlock } from './FAQs'
import { RichTextBlock } from './RichText'
import { CardGridBlock } from './CardGrid'
import { SplitContentBlock } from './SplitContent'
import { PillGridBlock } from './PillGrid'
import { LinkCardGridBlock } from './LinkCardGrid'
import { StepsBlock } from './Steps'
import { ComparisonTableBlock } from './ComparisonTable'
import { SampleReportGridBlock } from './SampleReportGrid'

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
    // ── Main visual setting ──
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
          admin: { width: '50%' },
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
          admin: { width: '50%' },
        },
      ],
    },

    // ── Secondary settings in sidebar ──
    {
      name: 'sectionId',
      type: 'text',
      label: 'Anchor ID',
      admin: {
        position: 'sidebar',
        description: 'e.g. "hero" for #hero links',
      },
    },
    {
      name: 'narrow',
      type: 'checkbox',
      label: 'Narrow Layout',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Constrain width for focused content like FAQ',
      },
    },

    // ── Section header — leave empty when inner block has its own ──
    ...sectionHeaderFields(),

    // ── Content ──
    {
      name: 'content',
      type: 'blocks',
      label: 'Content',
      maxRows: 1,
      blocks: [
        // Inner blocks — add new ones here as they're built
        CardGridBlock,
        FAQsBlock,
        RichTextBlock,
        SplitContentBlock,
        PillGridBlock,
        LinkCardGridBlock,
        StepsBlock,
        ComparisonTableBlock,
        SampleReportGridBlock,
      ],
    },

    // ── Bottom text (rich text below the inner block) ──
    {
      name: 'bottomText',
      type: 'richText',
      label: 'Bottom Text',
      localized: true,
      admin: {
        description: 'Optional rich text below the content block (e.g. closing paragraph)',
      },
    },

    // ── CTAs (below everything) ──
    ctasField(),
  ],
}
