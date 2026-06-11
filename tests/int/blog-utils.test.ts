import { describe, it, expect } from 'vitest'
import { readingMinutes } from '@/lib/reading-time'

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
