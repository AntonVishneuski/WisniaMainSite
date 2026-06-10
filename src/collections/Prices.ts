import type { CollectionConfig } from 'payload'

export const Prices: CollectionConfig = {
  slug: 'prices',
  access: { read: () => true },
  admin: { group: 'Treść', useAsTitle: 'name', defaultColumns: ['name', 'tab', 'category', 'price', 'order'] },
  fields: [
    { name: 'tab', type: 'select', required: true, options: [
      { label: 'Kosmetologia', value: 'kosmetologia' },
      { label: 'Laser', value: 'laser' },
      { label: 'Ciało', value: 'cialo' },
      { label: 'Pakiety', value: 'pakiety' },
    ] },
    { name: 'category', type: 'text', localized: true },
    { name: 'categorySubtitle', type: 'text', localized: true },
    { name: 'name', type: 'text', localized: true, required: true },
    { name: 'subline', type: 'text', localized: true },
    { name: 'price', type: 'text', localized: true },
    { name: 'priceWas', type: 'text', localized: true },
    { name: 'isPackage', type: 'checkbox', defaultValue: false },
    { name: 'isGift', type: 'checkbox', defaultValue: false },
    { name: 'note', type: 'richText', localized: true },
    { name: 'bookingUrl', type: 'text' },
    { name: 'order', type: 'number', defaultValue: 0 },
  ],
}
