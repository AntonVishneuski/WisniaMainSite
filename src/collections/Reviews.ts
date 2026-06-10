import type { CollectionConfig } from 'payload'

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  access: { read: () => true },
  admin: { group: 'Treść', useAsTitle: 'author', defaultColumns: ['author', 'source', 'rating', 'order'] },
  fields: [
    { name: 'quote', type: 'textarea', localized: true, required: true },
    { name: 'author', type: 'text', required: true },
    { name: 'initial', type: 'text', maxLength: 1 },
    { name: 'avatarColor', type: 'text', defaultValue: '#8B1A3A' },
    { name: 'rating', type: 'number', min: 1, max: 5, defaultValue: 5 },
    { name: 'source', type: 'select', defaultValue: 'Google', options: [
      { label: 'Google', value: 'Google' }, { label: 'Booksy', value: 'Booksy' },
    ] },
    { name: 'date', type: 'text', localized: true },
    { name: 'order', type: 'number', defaultValue: 0 },
  ],
}
