import type { CollectionConfig } from 'payload'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'

export const MediaVideos: CollectionConfig = {
  slug: 'media-videos',
  labels: { singular: 'Video', plural: 'Video' },
  hooks: {
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete],
  },
  access: {
    read: () => true,
  },
  admin: {
    group: 'Treść',
    useAsTitle: 'title',
    components: {
      actions: [
        '/src/components/admin/BulkDeleteAction',
        '/src/components/admin/BulkRenameAction',
      ],
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
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
