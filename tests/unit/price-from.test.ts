import { describe, it, expect } from 'vitest'
import { parseMinPrice, formatPriceFrom } from '../../src/lib/price-from'

describe('parseMinPrice', () => {
  it('returns the single numeric value', () => {
    expect(parseMinPrice(['550 zł'])).toBe(550)
  })

  it('returns the minimum across multiple prices', () => {
    expect(parseMinPrice(['900 zł', '550 zł', '750 zł'])).toBe(550)
  })

  it('strips od/от prefix', () => {
    expect(parseMinPrice(['od 650 zł'])).toBe(650)
    expect(parseMinPrice(['от 650 zł'])).toBe(650)
  })

  it('takes the lower bound of a range', () => {
    expect(parseMinPrice(['220-260 zł'])).toBe(220)
  })

  it('handles thousands separated by space', () => {
    expect(parseMinPrice(['1 200 zł'])).toBe(1200)
  })

  it('ignores rows without zł (e.g. "-15%" package badges)', () => {
    expect(parseMinPrice(['-15%', '300 zł'])).toBe(300)
    expect(parseMinPrice(['-15%'])).toBeNull()
  })

  it('returns null for empty / nullish input', () => {
    expect(parseMinPrice([])).toBeNull()
    expect(parseMinPrice([null, undefined, ''])).toBeNull()
  })
})

describe('formatPriceFrom', () => {
  it('formats with Russian prefix', () => {
    expect(formatPriceFrom(550, 'ru')).toBe('от 550 zł')
  })

  it('formats with Polish prefix for pl and any non-ru locale', () => {
    expect(formatPriceFrom(550, 'pl')).toBe('od 550 zł')
  })
})
