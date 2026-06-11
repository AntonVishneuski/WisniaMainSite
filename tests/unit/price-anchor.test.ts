import { describe, it, expect } from 'vitest'
import { resolvePriceAnchor } from '../../src/lib/price-anchor'

describe('resolvePriceAnchor', () => {
  it('maps the #pakiety in-page anchor to the home cennik pakiety tab (pl)', () => {
    expect(resolvePriceAnchor('#pakiety', '/')).toBe('/#tab-pakiety')
  })

  it('keeps the locale prefix for the ru home', () => {
    expect(resolvePriceAnchor('#pakiety', '/ru')).toBe('/ru#tab-pakiety')
  })

  it('maps every price tab fragment to its tab button id', () => {
    expect(resolvePriceAnchor('#laser', '/')).toBe('/#tab-laser')
    expect(resolvePriceAnchor('#kosmetologia', '/')).toBe('/#tab-kosmetologia')
    expect(resolvePriceAnchor('#cialo', '/')).toBe('/#tab-cialo')
  })

  it('leaves a non-tab fragment on the home page as-is', () => {
    expect(resolvePriceAnchor('#cennik', '/')).toBe('/#cennik')
  })

  it('passes absolute and external links through unchanged', () => {
    expect(resolvePriceAnchor('/uslugi', '/')).toBe('/uslugi')
    expect(resolvePriceAnchor('https://booksy.com/x', '/')).toBe('https://booksy.com/x')
  })

  it('returns undefined for empty/missing links', () => {
    expect(resolvePriceAnchor(null, '/')).toBeUndefined()
    expect(resolvePriceAnchor(undefined, '/')).toBeUndefined()
    expect(resolvePriceAnchor('   ', '/')).toBeUndefined()
  })
})
