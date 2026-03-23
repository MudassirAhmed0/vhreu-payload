import type { GlobalConfig } from 'payload'
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
                  name: 'linkType',
                  type: 'select',
                  defaultValue: 'link',
                  options: [
                    { label: 'Single Link', value: 'link' },
                    { label: 'Dropdown', value: 'dropdown' },
                  ],
                },
                {
                  name: 'url',
                  type: 'text',
                  admin: { condition: (_, { linkType }) => linkType === 'link' },
                },
                {
                  name: 'children',
                  type: 'array',
                  admin: { condition: (_, { linkType }) => linkType === 'dropdown' },
                  fields: [
                    { name: 'label', type: 'text', required: true, localized: true },
                    { name: 'url', type: 'text', required: true },
                    { name: 'description', type: 'text', localized: true },
                    { name: 'icon', type: 'text', admin: { description: 'Lucide icon name' } },
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
                  fields: [
                    { name: 'label', type: 'text', required: true, localized: true },
                    { name: 'url', type: 'text', required: true },
                  ],
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
