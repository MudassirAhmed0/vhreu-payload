import type { GlobalConfig } from 'payload'
import { revalidateGlobal } from '../hooks/revalidate'

export const PricingConfig: GlobalConfig = {
  slug: 'pricing-config',
  label: 'Pricing',
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateGlobal],
  },
  fields: [
    {
      name: 'plans',
      type: 'array',
      required: true,
      fields: [
        { name: 'id', type: 'text', required: true, admin: { description: 'e.g. VHREU1' } },
        { name: 'name', type: 'text', required: true, localized: true },
        { name: 'reports', type: 'number', required: true },
        { name: 'price', type: 'number', required: true },
        { name: 'savings', type: 'number', admin: { description: 'Discount % (null for base plan)' } },
        { name: 'isFeatured', type: 'checkbox', defaultValue: false },
        {
          name: 'features',
          type: 'array',
          fields: [
            { name: 'text', type: 'text', required: true, localized: true },
          ],
        },
      ],
    },
  ],
}
