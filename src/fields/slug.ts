import type { Field } from 'payload'

export const slugField: Field = {
  name: 'slug',
  type: 'text',
  required: true,
  unique: true,
  admin: {
    position: 'sidebar',
    description: 'URL-safe identifier. Auto-generated from title if left empty.',
  },
  hooks: {
    beforeValidate: [
      ({ value, siblingData }) => {
        if (value) return value
        const title = siblingData?.title || siblingData?.name || ''
        return title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '')
      },
    ],
  },
}
