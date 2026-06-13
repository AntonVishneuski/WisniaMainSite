export interface SettingsLocale {
  address: string
  addressNote: string
  phone: string
  whatsapp: string
  instagram: string
  hours: string
  mapEmbedUrl: string
  booksyUrl: string
  googleRating: string
  booksyRating: string
}

export const settings: { pl: SettingsLocale; ru: SettingsLocale } = {
  pl: {
    address: 'ul. Gen. W. Andersa 15, Warszawa',
    addressNote: 'obok LuxMed',
    phone: '+48 453 270 435',
    whatsapp: '48453270435',
    instagram: 'https://instagram.com/wisnia_beauty_studio',
    hours: 'Pon–Sob 8:00–20:00',
    mapEmbedUrl: 'https://www.google.com/maps?q=ul.+Gen.+W.+Andersa+15,+Warszawa&output=embed',
    booksyUrl: 'https://wisniabeauty.booksy.com/a',
    googleRating: '5,0',
    booksyRating: '4,9',
  },
  ru: {
    address: 'ул. Ген. В. Андерса 15, Варшава',
    addressNote: 'рядом с LuxMed',
    phone: '+48 453 270 435',
    whatsapp: '48453270435',
    instagram: 'https://instagram.com/wisnia_beauty_studio',
    hours: 'Пн–Сб 8:00–20:00',
    mapEmbedUrl: 'https://www.google.com/maps?q=ul.+Gen.+W.+Andersa+15,+Warszawa&output=embed',
    booksyUrl: 'https://wisniabeauty.booksy.com/a',
    googleRating: '5,0',
    booksyRating: '4,9',
  },
}
