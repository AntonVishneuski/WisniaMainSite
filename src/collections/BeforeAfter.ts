import type { CollectionConfig } from 'payload'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'

export const BeforeAfter: CollectionConfig = {
  slug: 'beforeAfter',
  hooks: {
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete],
  },
  access: { read: () => true },
  admin: { group: 'Treść', useAsTitle: 'caption', defaultColumns: ['caption', 'order'] },
  fields: [
    { name: 'beforeImage', type: 'upload', relationTo: 'media', required: true },
    { name: 'afterImage', type: 'upload', relationTo: 'media', required: true },
    { name: 'caption', type: 'text', localized: true },
    { name: 'order', type: 'number', defaultValue: 0 },
  ],
}
