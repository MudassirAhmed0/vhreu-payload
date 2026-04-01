import type { Block } from 'payload'

export const ContactFormBlock: Block = {
  slug: 'contact-form',
  labels: { singular: 'Contact Form', plural: 'Contact Forms' },
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
      admin: { position: 'sidebar' },
    },
    {
      name: 'notificationEmail',
      type: 'email',
      label: 'Notification Email',
      admin: {
        position: 'sidebar',
        description: 'Email to notify when form is submitted',
      },
    },
    {
      name: 'heading',
      type: 'text',
      localized: true,
      admin: { description: 'Override the default "Get in Touch" heading' },
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
    },
  ],
}
