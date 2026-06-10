import { describe, it, expect } from 'vitest'
import { resolveCrossLinks } from '../../src/lib/service-links'

const pages = [
  { id: '1', slug: 'a', title: 'A' }, { id: '2', slug: 'b', title: 'B' }, { id: '3', slug: 'c', title: 'C' },
] as any

describe('resolveCrossLinks', () => {
  it('returns explicit links when provided', () => {
    const out = resolveCrossLinks({ id: '1', slug: 'a', crossLinks: [pages[1]] } as any, pages)
    expect(out.map((p) => p.slug)).toEqual(['b'])
  })
  it('auto-fills with other published pages (excluding self) when empty, max 3', () => {
    const out = resolveCrossLinks({ id: '1', slug: 'a', crossLinks: [] } as any, pages)
    expect(out.map((p) => p.slug)).toEqual(['b', 'c'])
  })

  // --- new cases ---

  it('drops explicit link whose id is not in allPublished', () => {
    // id '99' is not in pages, so it should be filtered out; falls back to auto-fill
    const out = resolveCrossLinks(
      { id: '1', slug: 'a', crossLinks: [{ id: '99', slug: 'ghost', title: 'Ghost' }] } as any,
      pages,
    )
    // explicit list is empty after filtering → auto-fill (excluding self '1')
    expect(out.map((p) => p.slug)).toEqual(['b', 'c'])
  })

  it('drops explicit self-link', () => {
    // Explicit link to itself (id '1') should be excluded
    const out = resolveCrossLinks(
      { id: '1', slug: 'a', crossLinks: [pages[0], pages[1]] } as any,
      pages,
    )
    // pages[0] is self → excluded; only pages[1] remains
    expect(out.map((p) => p.slug)).toEqual(['b'])
  })

  it('caps explicit list to max (default 3) when more than 3 entries', () => {
    const manyPages = [
      { id: '1', slug: 'a', title: 'A' },
      { id: '2', slug: 'b', title: 'B' },
      { id: '3', slug: 'c', title: 'C' },
      { id: '4', slug: 'd', title: 'D' },
      { id: '5', slug: 'e', title: 'E' },
      { id: '6', slug: 'f', title: 'F' },
    ] as any
    // crossLinks references 5 published pages (not self)
    const out = resolveCrossLinks(
      { id: '1', slug: 'a', crossLinks: [manyPages[1], manyPages[2], manyPages[3], manyPages[4], manyPages[5]] } as any,
      manyPages,
    )
    expect(out.length).toBe(3)
    expect(out.map((p: any) => p.slug)).toEqual(['b', 'c', 'd'])
  })

  it('auto-fill with 5+ pages returns exactly 3 (excluding self)', () => {
    const manyPages = [
      { id: '1', slug: 'a', title: 'A' },
      { id: '2', slug: 'b', title: 'B' },
      { id: '3', slug: 'c', title: 'C' },
      { id: '4', slug: 'd', title: 'D' },
      { id: '5', slug: 'e', title: 'E' },
    ] as any
    const out = resolveCrossLinks({ id: '1', slug: 'a', crossLinks: [] } as any, manyPages)
    expect(out.length).toBe(3)
    expect(out.map((p: any) => p.slug)).toEqual(['b', 'c', 'd'])
  })

  it('resolves a primitive id that is present in allPublished', () => {
    // crossLinks entry is a primitive id string, not an object
    const out = resolveCrossLinks(
      { id: '1', slug: 'a', crossLinks: ['3'] } as any,
      pages,
    )
    expect(out.map((p) => p.slug)).toEqual(['c'])
  })
})
