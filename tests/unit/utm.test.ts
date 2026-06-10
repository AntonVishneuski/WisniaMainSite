import { describe, it, expect } from 'vitest'
import { parseAttribution } from '../../src/lib/utm'

describe('parseAttribution', () => {
  it('extracts utm params and referrer host', () => {
    const out = parseAttribution('?utm_source=google&utm_medium=cpc&utm_campaign=laser', 'https://maps.google.com/x')
    expect(out.utm_source).toBe('google')
    expect(out.utm_medium).toBe('cpc')
    expect(out.utm_campaign).toBe('laser')
    expect(out.referrer_host).toBe('maps.google.com')
  })
  it('handles empty input', () => {
    const out = parseAttribution('', '')
    expect(out.utm_source).toBeUndefined()
    expect(out.referrer_host).toBeUndefined()
  })
})
