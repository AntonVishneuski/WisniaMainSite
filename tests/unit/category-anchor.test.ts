import { describe, it, expect } from 'vitest'
import { categorySlug, categoryAnchor } from '@/lib/category-anchor'

describe('categorySlug', () => {
  it('slugs a Polish category keeping diacritics, stable', () => {
    expect(categorySlug('Depilacja laserowa dla mężczyzn')).toBe('depilacja-laserowa-dla-mężczyzn')
    expect(categorySlug('Depilacja laserowa dla kobiet')).toBe('depilacja-laserowa-dla-kobiet')
  })

  it('keeps Cyrillic letters for Russian categories', () => {
    expect(categorySlug('Лазерная эпиляция для мужчин')).toBe('лазерная-эпиляция-для-мужчин')
  })

  it("men's and women's categories produce DIFFERENT slugs (the bug: both went to women's)", () => {
    expect(categorySlug('Depilacja laserowa dla mężczyzn')).not.toBe(
      categorySlug('Depilacja laserowa dla kobiet'),
    )
  })

  it('collapses punctuation/spaces to single dashes and trims', () => {
    expect(categorySlug('  RF-lifting twarzy i ciała  ')).toBe('rf-lifting-twarzy-i-ciała')
  })

  it('categoryAnchor prefixes with cat-', () => {
    expect(categoryAnchor('Depilacja laserowa dla mężczyzn')).toBe('cat-depilacja-laserowa-dla-mężczyzn')
  })
})
