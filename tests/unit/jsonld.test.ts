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
})
