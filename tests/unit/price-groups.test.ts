import { describe, it, expect } from 'vitest'
import { groupPrices } from '../../src/lib/price-groups'

const rows = [
  { id: '1', tab: 'kosmetologia', category: 'Oczyszczanie', name: 'Wodorowe', price: '250 zł', order: 0 },
  { id: '2', tab: 'kosmetologia', category: 'Oczyszczanie', name: 'Kombinowane', price: '350 zł', order: 1 },
  { id: '3', tab: 'kosmetologia', category: 'Peelingi', categorySubtitle: 'po 300 zł', name: 'Medyczne', price: '300 zł', order: 2 },
  { id: '4', tab: 'laser', category: 'Kobiety', name: 'Pachy', price: '110 zł', order: 0 },
] as any

describe('groupPrices', () => {
  it('groups rows by tab then category preserving order', () => {
    const out = groupPrices(rows)
    expect(out.kosmetologia.map((c) => c.category)).toEqual(['Oczyszczanie', 'Peelingi'])
    expect(out.kosmetologia[0].rows).toHaveLength(2)
    expect(out.kosmetologia[1].categorySubtitle).toBe('po 300 zł')
    expect(out.laser[0].rows[0].name).toBe('Pachy')
  })

  it('unsorted order values are sorted ascending in output', () => {
    const unsorted = [
      { id: 'b', tab: 'kosmetologia', category: 'Cat', name: 'Second', price: '200 zł', order: 5 },
      { id: 'a', tab: 'kosmetologia', category: 'Cat', name: 'First', price: '100 zł', order: 2 },
    ] as any
    const out = groupPrices(unsorted)
    expect(out.kosmetologia[0].rows[0].name).toBe('First')
    expect(out.kosmetologia[0].rows[1].name).toBe('Second')
  })

  it('a row with null/undefined category is grouped under key empty string', () => {
    const nocat = [
      { id: 'x', tab: 'cialo', category: null, name: 'Mystery', price: '99 zł', order: 0 },
      { id: 'y', tab: 'cialo', category: undefined, name: 'Mystery2', price: '88 zł', order: 1 },
    ] as any
    const out = groupPrices(nocat)
    // Both null and undefined should collapse to the same group
    expect(out.cialo).toHaveLength(1)
    expect(out.cialo[0].rows).toHaveLength(2)
    expect(out.cialo[0].category).toBeNull()
  })

  it('all four tab keys are always present even when tabs have no rows', () => {
    const singleTab = [
      { id: '1', tab: 'laser', category: 'Cat', name: 'Row', price: '100 zł', order: 0 },
    ] as any
    const out = groupPrices(singleTab)
    expect(Object.keys(out)).toEqual(['kosmetologia', 'laser', 'cialo', 'pakiety'])
    expect(out.kosmetologia).toEqual([])
    expect(out.cialo).toEqual([])
    expect(out.pakiety).toEqual([])
    expect(out.laser).toHaveLength(1)
  })

  it('when two rows share a category, group keeps the first row categorySubtitle', () => {
    const shared = [
      { id: '1', tab: 'pakiety', category: 'Kurs', categorySubtitle: 'Kup 5 płać za 4', name: 'Row A', price: '100 zł', order: 0 },
      { id: '2', tab: 'pakiety', category: 'Kurs', categorySubtitle: 'Should be ignored', name: 'Row B', price: '200 zł', order: 1 },
    ] as any
    const out = groupPrices(shared)
    expect(out.pakiety).toHaveLength(1)
    expect(out.pakiety[0].categorySubtitle).toBe('Kup 5 płać za 4')
    expect(out.pakiety[0].rows).toHaveLength(2)
  })
})
