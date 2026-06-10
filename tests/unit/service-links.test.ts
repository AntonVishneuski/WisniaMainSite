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
})
