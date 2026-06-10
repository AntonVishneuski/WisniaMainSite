const DEFAULT_WHATSAPP = '48453270435'
const DEFAULT_PHONE = '+48 453 270 435'
const DEFAULT_BOOKSY = 'https://wisniabeauty.booksy.com/a'
const DEFAULT_INSTAGRAM = 'wisnia_beauty_studio'

export type ContactSettings = {
  phone?: string | null
  whatsapp?: string | null
  booksyUrl?: string | null
  instagram?: string | null
} | null | undefined

export function igHandle(raw?: string | null): string {
  return (raw ?? DEFAULT_INSTAGRAM)
    .trim()
    .replace(/^@/, '')
    .replace(/^https?:\/\/(www\.)?instagram\.com\//i, '')
    .replace(/\/+$/, '')
}

export function contactLinks(settings: ContactSettings) {
  const phoneDigits = (settings?.phone ?? DEFAULT_PHONE).replace(/\D/g, '')
  const handle = igHandle(settings?.instagram)
  return {
    booksyHref: settings?.booksyUrl || DEFAULT_BOOKSY,
    waHref: `https://wa.me/${(settings?.whatsapp ?? DEFAULT_WHATSAPP).replace(/\D/g, '')}`,
    phoneHref: `tel:+${phoneDigits}`,
    phoneDisplay: settings?.phone ?? DEFAULT_PHONE,
    instagramHref: `https://instagram.com/${handle}`,
    instagramHandle: `@${handle}`,
  }
}
