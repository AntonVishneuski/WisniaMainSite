import type { GlobalConfig } from 'payload'

export const Settings: GlobalConfig = {
  slug: 'settings',
  access: { read: () => true },
  admin: { group: 'Ustawienia' },
  fields: [
    { type: 'collapsible', label: 'Kontakt (NAP)', fields: [
      { name: 'address', type: 'text', localized: true },
      { name: 'addressNote', type: 'text', localized: true },
      { name: 'phone', type: 'text' },
      { name: 'whatsapp', type: 'text', admin: { description: 'np. 48453270435' } },
      { name: 'instagram', type: 'text', admin: { description: 'Handle bez @ lub pełny URL — oba zadziałają (np. wisnia_beauty_studio)' } },
      { name: 'hours', type: 'text', localized: true },
      { name: 'mapEmbedUrl', type: 'text' },
    ] },
    { type: 'collapsible', label: 'Linki / oceny', fields: [
      { name: 'booksyUrl', type: 'text', defaultValue: 'https://wisniabeauty.booksy.com/a' },
      { name: 'googleRating', type: 'text', defaultValue: '5,0' },
      { name: 'booksyRating', type: 'text', defaultValue: '4,9' },
      { name: 'reviewsCount', type: 'number' },
    ] },
    { type: 'collapsible', label: 'Analityka / domena', fields: [
      { name: 'siteUrl', type: 'text', admin: { description: 'np. https://wisniabeauty.pl' } },
      { name: 'gtmId', type: 'text', admin: { description: 'GTM-XXXXXXX' } },
      { name: 'ga4Id', type: 'text' },
      { name: 'searchConsoleToken', type: 'text' },
      { name: 'defaultOgImage', type: 'upload', relationTo: 'media' },
      { name: 'geoLat', type: 'text' },
      { name: 'geoLng', type: 'text' },
    ] },
  ],
}
