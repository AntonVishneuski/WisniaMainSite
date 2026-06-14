import type { CollectionConfig } from 'payload'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'

export const MediaVideos: CollectionConfig = {
  slug: 'media-videos',
  labels: { singular: 'Wideo', plural: 'Wideo' },
  hooks: {
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete],
  },
  access: {
    read: () => true,
  },
  admin: {
    group: 'Treść',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      localized: true,
    },
  ],
  upload: {
    mimeTypes: ['video/*'],
  },
}
