import type { Block } from 'payload'
import { linksArrayField } from '../fields/link'
import { iconField } from '../fields/icon'

export const PageHeroBlock: Block = {
  slug: 'page-hero',
  labels: { singular: 'Page Hero', plural: 'Page Heroes' },
  imageURL: '/api/media/file/hero-block-preview.png',
  fields: [
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'centered',
      required: true,
      options: [
        { label: 'Centered', value: 'centered' },
        { label: 'Split (text left, image right)', value: 'split' },
        { label: 'Stacked', value: 'stacked' },
      ],
    },
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
      label: 'Form / Right Content',
      options: [
        { label: 'None', value: 'none' },
        { label: 'VIN Search Form', value: 'vin' },
        { label: 'Contact Form', value: 'contact' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Centered/stacked: shows below text. Split: shows on right side.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'tag',
          type: 'text',
          localized: true,
          admin: { width: '40%', description: 'Small label above heading' },
        },
        {
          name: 'tagLevel',
          type: 'select',
          defaultValue: 'span',
          label: 'Tag HTML',
          options: [
            { label: 'span (decorative)', value: 'span' },
            { label: 'h2', value: 'h2' },
            { label: 'h3', value: 'h3' },
            { label: 'h4', value: 'h4' },
            { label: 'p', value: 'p' },
          ],
          admin: { width: '20%' },
        },
      ],
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      admin: { description: 'Main heading text' },
    },
    {
      name: 'highlight',
      type: 'text',
      localized: true,
      admin: { description: 'Bold gradient portion of heading' },
    },
    {
      name: 'subtitle',
      type: 'textarea',
      localized: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'secondaryHeading',
          type: 'text',
          localized: true,
          admin: { width: '60%', description: 'Heading after description, before CTAs (e.g. "We\'ll be happy to assist you!")' },
        },
        {
          name: 'secondaryHeadingLevel',
          type: 'select',
          defaultValue: 'h3',
          label: 'Tag',
          options: [
            { label: 'h2', value: 'h2' },
            { label: 'h3', value: 'h3' },
            { label: 'h4', value: 'h4' },
            { label: 'p', value: 'p' },
          ],
          admin: { width: '20%' },
        },
      ],
    },
    {
      name: 'bullets',
      type: 'array',
      label: 'Trust Badges / Highlights',
      maxRows: 6,
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
              label: 'HTML Tag',
              options: [
                { label: 'span (no SEO)', value: 'span' },
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
    {
      name: 'features',
      type: 'array',
      label: 'Feature Highlights (icon + text below form)',
      maxRows: 8,
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
              admin: { width: '65%' },
            },
            {
              name: 'tag',
              type: 'select',
              defaultValue: 'span',
              label: 'HTML Tag',
              options: [
                { label: 'span (no SEO)', value: 'span' },
                { label: 'h2', value: 'h2' },
                { label: 'h3', value: 'h3' },
                { label: 'h4', value: 'h4' },
                { label: 'h5', value: 'h5' },
                { label: 'p', value: 'p' },
              ],
              admin: { width: '35%' },
            },
          ],
        },
      ],
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Right-side image for split variant (580×660 recommended)',
        condition: (_, { variant }) => variant === 'split',
      },
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Optional background image' },
    },
    linksArrayField('helperLinks', { maxRows: 4, style: true, icon: true, label: 'Helper Links' }),
  ],
}
