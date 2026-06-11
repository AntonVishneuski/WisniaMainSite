import type { CollectionConfig } from 'payload'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'

export const Authors: CollectionConfig = {
  slug: 'authors',
  access: { read: () => true },
  admin: { group: 'Treść', useAsTitle: 'name', defaultColumns: ['name', 'jobTitle'] },
  hooks: { afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] },
  fields: [
    { name: 'name', type: 'text', localized: true, required: true },
    { name: 'jobTitle', type: 'text', localized: true },
    { name: 'credentials', type: 'text', localized: true },
    { name: 'photo', type: 'upload', relationTo: 'media' },
    { name: 'bio', type: 'textarea', localized: true },
  ],
}
