import { describe, it, expect } from 'vitest'
import { contactLinks, igHandle } from '@/lib/contact-links'

describe('igHandle', () => {
  it('returns bare handle unchanged', () => {
    expect(igHandle('wisnia_beauty_studio')).toBe('wisnia_beauty_studio')
  })

  it('strips leading @', () => {
    expect(igHandle('@wisnia_beauty_studio')).toBe('wisnia_beauty_studio')
  })

  it('strips full https://instagram.com/ URL', () => {
    expect(igHandle('https://instagram.com/wisnia_beauty_studio')).toBe('wisnia_beauty_studio')
  })

  it('strips full https://www.instagram.com/ URL', () => {
    expect(igHandle('https://www.instagram.com/wisnia_beauty_studio')).toBe('wisnia_beauty_studio')
  })

  it('strips trailing slash', () => {
    expect(igHandle('https://instagram.com/foo/')).toBe('foo')
  })

  it('falls back to default when null', () => {
    expect(igHandle(null)).toBe('wisnia_beauty_studio')
  })
})

describe('contactLinks', () => {
  it('fixes Instagram double-prefix: full URL input → correct href', () => {
    expect(
      contactLinks({ instagram: 'https://instagram.com/foo' }).instagramHref
    ).toBe('https://instagram.com/foo')
  })

  it('Instagram handle includes @ for display', () => {
    expect(
      contactLinks({ instagram: 'foo' }).instagramHandle
    ).toBe('@foo')
  })

  it('normalises phone with spaces for tel: href', () => {
    expect(
      contactLinks({ phone: '+48 453 270 435' }).phoneHref
    ).toBe('tel:+48453270435')
  })

  it('preserves original phone string for display', () => {
    expect(
      contactLinks({ phone: '+48 453 270 435' }).phoneDisplay
    ).toBe('+48 453 270 435')
  })

  it('uses defaults when settings is null', () => {
    const links = contactLinks(null)
    expect(links.phoneHref).toBe('tel:+48453270435')
    expect(links.waHref).toBe('https://wa.me/48453270435')
    expect(links.instagramHref).toBe('https://instagram.com/wisnia_beauty_studio')
    expect(links.booksyHref).toBe('https://wisniabeauty.booksy.com/a')
  })

  it('uses defaults when settings is undefined', () => {
    const links = contactLinks(undefined)
    expect(links.phoneHref).toBe('tel:+48453270435')
  })

  it('uses booksyUrl from settings when provided', () => {
    expect(
      contactLinks({ booksyUrl: 'https://booksy.com/custom' }).booksyHref
    ).toBe('https://booksy.com/custom')
  })

  it('normalises whatsapp digits', () => {
    expect(
      contactLinks({ whatsapp: '+48 453 270 435' }).waHref
    ).toBe('https://wa.me/48453270435')
  })
})
