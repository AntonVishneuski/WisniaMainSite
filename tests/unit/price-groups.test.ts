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
})
