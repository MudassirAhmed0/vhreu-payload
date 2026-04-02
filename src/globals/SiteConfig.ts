import type { GlobalConfig } from 'payload'
import { linkField } from '../fields/link'
import { revalidateGlobal } from '../hooks/revalidate'

export const SiteConfig: GlobalConfig = {
  slug: 'site-config',
  label: 'Site Config',
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateGlobal],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'General',
          fields: [
            { name: 'siteName', type: 'text', defaultValue: 'Vehicle History Europe' },
            { name: 'siteUrl', type: 'text', defaultValue: 'https://vehiclehistory.eu' },
            { name: 'contactEmail', type: 'text' },
            { name: 'contactPhone', type: 'text' },
            { name: 'favicon', type: 'upload', relationTo: 'media' },
            {
              name: 'socialLinks',
              type: 'array',
              fields: [
                { name: 'platform', type: 'text', required: true },
                { name: 'url', type: 'text', required: true },
              ],
            },
          ],
        },
        {
          label: 'Header',
          fields: [
            {
              name: 'navLinks',
              type: 'array',
              fields: [
                { name: 'label', type: 'text', required: true, localized: true },
                {
                  name: 'navType',
                  type: 'select',
                  defaultValue: 'link',
                  options: [
                    { label: 'Single Link', value: 'link' },
                    { label: 'Dropdown', value: 'dropdown' },
                  ],
                },
                {
                  ...linkField({ label: false }),
                  admin: { condition: (_, { navType }) => navType === 'link' },
                } as import('payload').Field,
                {
                  name: 'children',
                  type: 'array',
                  admin: { condition: (_, { navType }) => navType === 'dropdown' },
                  fields: [
                    linkField({ icon: true }),
                    { name: 'description', type: 'text', localized: true },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Footer',
          fields: [
            {
              name: 'footerGroups',
              type: 'array',
              fields: [
                { name: 'heading', type: 'text', required: true, localized: true },
                {
                  name: 'links',
                  type: 'array',
                  fields: linkField().type === 'group'
                    ? (linkField() as { fields: import('payload').Field[] }).fields
                    : [],
                },
              ],
            },
          ],
        },
        {
          label: 'Announcement',
          fields: [
            {
              name: 'announcement',
              type: 'group',
              fields: [
                { name: 'enabled', type: 'checkbox', defaultValue: false },
                {
                  name: 'text',
                  type: 'text',
                  localized: true,
                  admin: { condition: (_, { enabled }) => enabled },
                },
                {
                  name: 'ctaText',
                  type: 'text',
                  localized: true,
                  admin: { condition: (_, { enabled }) => enabled },
                },
                {
                  name: 'ctaUrl',
                  type: 'text',
                  admin: { condition: (_, { enabled }) => enabled },
                },
                {
                  name: 'backgroundColor',
                  type: 'text',
                  defaultValue: '#FFCC00',
                  admin: { condition: (_, { enabled }) => enabled },
                },
              ],
            },
          ],
        },
        {
          label: 'Exit Popup',
          fields: [
            {
              name: 'exitPopup',
              type: 'group',
              label: 'Report Popup (default)',
              admin: { description: 'Shows on all pages except window sticker pages' },
              fields: [
                { name: 'enabled', type: 'checkbox', defaultValue: false },
                {
                  name: 'title',
                  type: 'text',
                  localized: true,
                  admin: { condition: (_, { enabled }) => enabled, description: 'Small text above headline' },
                },
                {
                  name: 'subtitle',
                  type: 'text',
                  localized: true,
                  admin: { condition: (_, { enabled }) => enabled, description: 'Large headline (e.g. "15% OFF")' },
                },
                {
                  name: 'description',
                  type: 'textarea',
                  localized: true,
                  admin: { condition: (_, { enabled }) => enabled },
                },
                {
                  name: 'ctaText',
                  type: 'text',
                  localized: true,
                  admin: { condition: (_, { enabled }) => enabled },
                },
                {
                  name: 'offerImage',
                  type: 'upload',
                  relationTo: 'media',
                  admin: { condition: (_, { enabled }) => enabled },
                },
              ],
            },
            {
              name: 'stickerExitPopup',
              type: 'group',
              label: 'Sticker Popup (window sticker pages)',
              admin: { description: 'Shows only on /window-sticker/* pages' },
              fields: [
                { name: 'enabled', type: 'checkbox', defaultValue: false },
                {
                  name: 'title',
                  type: 'text',
                  localized: true,
                  admin: { condition: (_, { enabled }) => enabled },
                },
                {
                  name: 'subtitle',
                  type: 'text',
                  localized: true,
                  admin: { condition: (_, { enabled }) => enabled, description: 'Large headline (e.g. "15% OFF")' },
                },
                {
                  name: 'description',
                  type: 'textarea',
                  localized: true,
                  admin: { condition: (_, { enabled }) => enabled },
                },
                {
                  name: 'ctaText',
                  type: 'text',
                  localized: true,
                  admin: { condition: (_, { enabled }) => enabled },
                },
                {
                  name: 'offerImage',
                  type: 'upload',
                  relationTo: 'media',
                  admin: { condition: (_, { enabled }) => enabled },
                },
              ],
            },
          ],
        },
        {
          label: 'Languages',
          fields: [
            {
              name: 'languages',
              type: 'array',
              fields: [
                { name: 'code', type: 'text', required: true },
                { name: 'label', type: 'text', required: true },
                { name: 'flag', type: 'text', admin: { description: 'Flag emoji' } },
                { name: 'enabled', type: 'checkbox', defaultValue: true },
              ],
            },
          ],
        },
      ],
    },
  ],
}
