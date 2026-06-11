import { describe, it, expect } from 'vitest'
import { readingMinutes } from '@/lib/reading-time'
import { slugify, extractHeadings } from '@/lib/lexical-headings'

const body = (text: string) => ({
  root: { type: 'root', format: '', indent: 0, version: 1, direction: 'ltr',
    children: [{ type: 'paragraph', format: '', indent: 0, version: 1, direction: 'ltr',
      children: [{ type: 'text', text, format: 0, detail: 0, mode: 'normal', style: '', version: 1 }] }] } })

describe('readingMinutes', () => {
  it('returns at least 1 minute for short text', () => {
    expect(readingMinutes(body('a few words here'))).toBe(1)
  })
  it('scales with word count (~200 wpm)', () => {
    const words = Array.from({ length: 600 }, () => 'słowo').join(' ')
    expect(readingMinutes(body(words))).toBe(3)
  })
  it('handles empty/nullish body', () => {
    expect(readingMinutes(null)).toBe(1)
  })
})

const heading = (tag: string, text: string) => ({
  type: 'heading', tag, format: '', indent: 0, version: 1, direction: 'ltr',
  children: [{ type: 'text', text, format: 0, detail: 0, mode: 'normal', style: '', version: 1 }] })

describe('slugify', () => {
  it('slugifies Polish diacritics', () => {
    expect(slugify('Jak przygotować się do zabiegu')).toBe('jak-przygotowac-sie-do-zabiegu')
  })
})

describe('extractHeadings', () => {
  it('extracts h2/h3 with ids and levels', () => {
    const data = { root: { type: 'root', format: '', indent: 0, version: 1, direction: 'ltr',
      children: [heading('h2', 'Pierwszy'), heading('h3', 'Drugi'), heading('h4', 'Ignored')] } }
    const out = extractHeadings(data)
    expect(out).toEqual([
      { id: 'pierwszy', text: 'Pierwszy', level: 2 },
      { id: 'drugi', text: 'Drugi', level: 3 },
    ])
  })
})
