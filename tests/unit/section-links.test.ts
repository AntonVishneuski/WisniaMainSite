import { describe, it, expect } from 'vitest'
import { homePath, sectionHref } from '@/lib/section-links'

describe('homePath', () => {
  it('pl home is /', () => expect(homePath('pl')).toBe('/'))
  it('ru home is /ru', () => expect(homePath('ru')).toBe('/ru'))
})

describe('sectionHref', () => {
  it('on the home page: bare same-page anchor (smooth in-page scroll, no reload)', () => {
    expect(sectionHref('#cennik', 'pl', true)).toBe('#cennik')
    expect(sectionHref('#o-nas', 'ru', true)).toBe('#o-nas')
  })

  it('the bug: from a non-home pl page the link points at the home section, not a dead in-page anchor', () => {
    expect(sectionHref('#cennik', 'pl', false)).toBe('/#cennik')
    expect(sectionHref('#o-nas', 'pl', false)).toBe('/#o-nas')
    expect(sectionHref('#kontakt', 'pl', false)).toBe('/#kontakt')
    expect(sectionHref('#efekty', 'pl', false)).toBe('/#efekty')
  })

  it('non-home ru pages keep the /ru prefix', () => {
    expect(sectionHref('#cennik', 'ru', false)).toBe('/ru#cennik')
    expect(sectionHref('#kontakt', 'ru', false)).toBe('/ru#kontakt')
  })

  it('never produces a double slash for the default (pl) locale', () => {
    for (const hash of ['#cennik', '#efekty', '#o-nas', '#kontakt']) {
      expect(sectionHref(hash, 'pl', false)).not.toContain('//')
    }
  })
})
