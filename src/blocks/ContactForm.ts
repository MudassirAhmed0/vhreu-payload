import type { Block } from 'payload'

export const ContactFormBlock: Block = {
  slug: 'contact-form',
  labels: { singular: 'Contact Form', plural: 'Contact Forms' },
  fields: [
    {
      name: 'heading',
      type: 'text',
      localized: true,
      admin: { description: 'Section heading above the form' },
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      admin: { description: 'Text below the heading, above the form' },
    },
    {
      name: 'notificationEmail',
      type: 'email',
      admin: {
        position: 'sidebar',
        description: 'Where form submissions are sent',
      },
    },
    {
      name: 'bg',
      type: 'select',
      defaultValue: 'white',
      options: [
        { label: 'White', value: 'white' },
        { label: 'Muted', value: 'muted' },
        { label: 'Dark', value: 'dark' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
}
