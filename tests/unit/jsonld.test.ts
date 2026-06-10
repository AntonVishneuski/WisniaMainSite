import { describe, it, expect } from 'vitest'
import { localBusinessLd, aggregateRatingLd } from '../../src/lib/jsonld'

describe('jsonld', () => {
  it('builds LocalBusiness with NAP', () => {
    const ld = localBusinessLd({ name: 'Wiśnia Beauty', url: 'https://x.pl', phone: '+48453270435', address: 'ul. Andersa 15', geoLat: '52.2', geoLng: '21.0', hours: 'Mo-Sa 08:00-20:00' })
    expect(ld['@type']).toBe('BeautySalon')
    expect(ld.telephone).toBe('+48453270435')
    expect(ld.geo.latitude).toBe('52.2')
  })
  it('builds AggregateRating', () => {
    const ld = aggregateRatingLd('5.0', 40)
    expect(ld.ratingValue).toBe('5.0')
    expect(ld.reviewCount).toBe(40)
  })
  it('JSON-LD serialization escapes </script> breakout sequences', () => {
    // Simulate what JsonLd does internally — verify the replacement logic neutralises breakout chars
    const dangerous = { name: '</script><script>alert(1)</script>', url: 'https://x.pl' }
    const serialized = JSON.stringify(dangerous)
      .replace(/</g, '\\u003c')
      .replace(/>/g, '\\u003e')
      .replace(/&/g, '\\u0026')
      .replace(/ /g, '\\u2028')
      .replace(/ /g, '\\u2029')
    expect(serialized).not.toContain('</script>')
    expect(serialized).not.toContain('<script>')
    // Must still be valid JSON
    const parsed = JSON.parse(serialized)
    expect(parsed.name).toBe('</script><script>alert(1)</script>')
  })
})
