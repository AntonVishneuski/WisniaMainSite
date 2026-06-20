import type { CollectionConfig } from 'payload'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'

export const ServicePages: CollectionConfig = {
  slug: 'servicePages',
  access: {
    read: ({ req }) => (req.user ? true : { status: { equals: 'published' } }),
  },
  admin: { group: 'Treść', useAsTitle: 'title', defaultColumns: ['title', 'slug', 'status', 'order'] },
  hooks: { afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] },
  fields: [
    { name: 'title', type: 'text', localized: true, required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true,
      admin: { description: 'Polski slug, wspólny dla obu języków, np. depilacja-laserowa-warszawa' } },
    { name: 'status', type: 'select', defaultValue: 'draft', options: [
      { label: 'Szkic', value: 'draft' }, { label: 'Opublikowana', value: 'published' } ] },
    { name: 'order', type: 'number', defaultValue: 0 },
    { type: 'collapsible', label: 'SEO', fields: [
      { name: 'metaTitle', type: 'text', localized: true },
      { name: 'metaDescription', type: 'textarea', localized: true },
      { name: 'ogImage', type: 'upload', relationTo: 'media' },
      { name: 'serviceName', type: 'text', localized: true },
      { name: 'serviceDescription', type: 'textarea', localized: true },
    ] },
    { type: 'collapsible', label: 'Hero', fields: [
      { name: 'heroImage', type: 'upload', relationTo: 'media',
        admin: { description: 'Zdjęcie hero. Jeśli ustawione jest też video — służy jako poster/zapas.' } },
      { name: 'heroVideo', type: 'upload', relationTo: 'media-videos',
        admin: { description: 'Opcjonalnie. Jeśli ustawione — w hero odtwarza się video (bez dźwięku, w pętli); zdjęcie służy jako poster i zapas.' } },
      { name: 'heading', type: 'text', localized: true },
      { name: 'intro', type: 'textarea', localized: true },
      { name: 'priceFrom', type: 'text', localized: true,
        admin: { description: 'Opcjonalna cena „od” obok CTA w hero, np. „od 550 zł” / „от 550 zł”' } },
    ] },
    { name: 'about', type: 'richText', localized: true },
    { name: 'forWhom', type: 'richText', localized: true },
    { name: 'steps', type: 'array', labels: { singular: 'Krok', plural: 'Kroki' }, fields: [
      { name: 'title', type: 'text', localized: true },
      { name: 'text', type: 'textarea', localized: true },
    ] },
    { name: 'results', type: 'richText', localized: true },
    { name: 'faq', type: 'array', labels: { singular: 'Pytanie (FAQ)', plural: 'FAQ' },
      admin: { description: 'Najczęstsze pytania — renderowane jako akordeon i jako FAQPage schema (rich snippet w Google).' },
      fields: [
        { name: 'question', type: 'text', localized: true, required: true },
        { name: 'answer', type: 'textarea', localized: true, required: true },
      ] },
    { name: 'priceHeading', type: 'text', localized: true },
    { name: 'priceItems', type: 'relationship', relationTo: 'prices', hasMany: true },
    { type: 'group', name: 'packagePromo', fields: [
      { name: 'enabled', type: 'checkbox', defaultValue: false },
      { name: 'badge', type: 'text', defaultValue: '-15%' },
      { name: 'title', type: 'text', localized: true },
      { name: 'desc', type: 'text', localized: true },
      { name: 'nowPrice', type: 'text', localized: true },
      { name: 'wasPrice', type: 'text', localized: true },
      { name: 'link', type: 'text', defaultValue: '#pakiety',
        validate: (value: string | null | undefined) => {
          if (!value || value.trim() === '') return true
          if (/^(#|\/|https?:|tel:|mailto:)/i.test(value.trim())) return true
          return 'Link must start with #, /, https://, http://, tel:, or mailto:'
        },
      },
    ] },
    { name: 'reviews', type: 'array', fields: [
      { name: 'quote', type: 'textarea', localized: true, required: true },
      { name: 'author', type: 'text', required: true },
      { name: 'initial', type: 'text', maxLength: 1 },
      { name: 'avatarColor', type: 'text', defaultValue: '#8B1A3A' },
      { name: 'rating', type: 'number', min: 1, max: 5, defaultValue: 5 },
      { name: 'source', type: 'select', defaultValue: 'Google', options: [
        { label: 'Google', value: 'Google' }, { label: 'Booksy', value: 'Booksy' } ] },
      { name: 'date', type: 'text', localized: true },
    ] },
    { name: 'beforeAfter', type: 'array', fields: [
      { name: 'beforeImage', type: 'upload', relationTo: 'media', required: true },
      { name: 'afterImage', type: 'upload', relationTo: 'media', required: true },
      { name: 'caption', type: 'text', localized: true },
    ] },
    { name: 'gallery', type: 'array', labels: { singular: 'Zdjęcie', plural: 'Zdjęcia' }, fields: [
      { name: 'image', type: 'upload', relationTo: 'media', required: true },
      { name: 'caption', type: 'text', localized: true },
    ] },
    { name: 'crossLinks', type: 'relationship', relationTo: 'servicePages', hasMany: true },
  ],
}
