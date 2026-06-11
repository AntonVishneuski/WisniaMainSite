import type { CollectionConfig } from 'payload'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'

export const CATEGORY_VALUES = [
  'depilacja-laserowa',
  'odmlodzenie-twarzy',
  'czyszczenie-pielegnacja',
  'zabiegi-specjalistyczne',
  'poradniki-faq',
  'sezonowo-trendy',
] as const

export const Posts: CollectionConfig = {
  slug: 'posts',
  access: {
    read: ({ req }) => (req.user ? true : { status: { equals: 'published' } }),
  },
  admin: {
    group: 'Treść',
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'category', 'status', 'publishedAt'],
  },
  hooks: { afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] },
  fields: [
    { name: 'title', type: 'text', localized: true, required: true },
    {
      name: 'slug', type: 'text', required: true, unique: true, index: true,
      admin: { description: 'Polski slug, wspólny dla obu języków, np. depilacja-laserowa-latem' },
    },
    {
      name: 'status', type: 'select', defaultValue: 'draft',
      options: [
        { label: 'Szkic', value: 'draft' },
        { label: 'Opublikowana', value: 'published' },
      ],
    },
    { name: 'publishedAt', type: 'date', admin: { date: { pickerAppearance: 'dayOnly' } } },
    { name: 'lastReviewed', type: 'date', admin: { date: { pickerAppearance: 'dayOnly' } } },
    {
      name: 'category', type: 'select', required: true,
      options: [
        { label: 'Depilacja laserowa', value: 'depilacja-laserowa' },
        { label: 'Odmłodzenie twarzy', value: 'odmlodzenie-twarzy' },
        { label: 'Czyszczenie i pielęgnacja', value: 'czyszczenie-pielegnacja' },
        { label: 'Zabiegi specjalistyczne', value: 'zabiegi-specjalistyczne' },
        { label: 'Poradniki i FAQ', value: 'poradniki-faq' },
        { label: 'Sezonowo i trendy', value: 'sezonowo-trendy' },
      ],
    },
    { name: 'excerpt', type: 'textarea', localized: true },
    { name: 'cover', type: 'upload', relationTo: 'media' },
    { name: 'body', type: 'richText', localized: true, required: true },
    { name: 'author', type: 'relationship', relationTo: 'authors', required: true },
    { name: 'reviewedBy', type: 'relationship', relationTo: 'authors' },
    { name: 'relatedService', type: 'relationship', relationTo: 'servicePages' },
    { name: 'relatedPosts', type: 'relationship', relationTo: 'posts', hasMany: true },
    { type: 'collapsible', label: 'SEO', fields: [
      { name: 'metaTitle', type: 'text', localized: true },
      { name: 'metaDescription', type: 'textarea', localized: true },
      { name: 'ogImage', type: 'upload', relationTo: 'media' },
      { name: 'noindex', type: 'checkbox', defaultValue: false },
    ] },
  ],
}
