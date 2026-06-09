import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import path from 'path'

const css = readFileSync(path.resolve(__dirname, '../../src/app/(frontend)/styles.css'), 'utf8')

describe('design tokens (Tailwind v4 @theme)', () => {
  it('imports tailwind and declares a @theme block', () => {
    expect(css).toMatch(/@import\s+["']tailwindcss["']/)
    expect(css).toMatch(/@theme\s*\{/)
  })
  it('defines brand color tokens', () => {
    expect(css).toContain('--color-cherry: #8B1A3A')
    expect(css).toContain('--color-cream: #FDFAF7')
    expect(css).toContain('--color-rose-gold: #C9956C')
    expect(css).toContain('--color-graphite: #1A1A1A')
  })
  it('defines font + radius + shadow tokens', () => {
    expect(css).toMatch(/--font-serif:/)
    expect(css).toMatch(/--font-sans:/)
    expect(css).toContain('--radius-lg: 22px')
    expect(css).toContain('--shadow-md: 0 12px 32px rgba(110,18,44,.08)')
  })
})
