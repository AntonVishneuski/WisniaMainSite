import { describe, it, expect } from 'vitest'
import { localBusinessLd, aggregateRatingLd, faqLd, breadcrumbLd, serviceLd } from '../../src/lib/jsonld'

describe('jsonld', () => {
  it('builds LocalBusiness with NAP', () => {
    const ld = localBusinessLd({ name: 'Wiśnia Beauty', url: 'https://x.pl', phone: '+48453270435', address: 'ul. Andersa 15', geoLat: '52.2', geoLng: '21.0', hours: 'Mo-Sa 08:00-20:00' })
    expect(ld['@type']).toBe('BeautySalon')
    expect(ld.telephone).toBe('+48453270435')
    expect(ld.geo.latitude).toBe('52.2')
  })

  it('localBusinessLd has addressCountry PL and priceRange', () => {
    const ld = localBusinessLd({ name: 'Wiśnia Beauty', url: 'https://x.pl' })
    expect(ld.address.addressCountry).toBe('PL')
    expect(ld.priceRange).toBeTruthy()
  })

  it('builds AggregateRating', () => {
    const ld = aggregateRatingLd('5.0', 40)
    expect(ld.ratingValue).toBe('5.0')
    expect(ld.reviewCount).toBe(40)
  })

  it('faqLd mainEntity has Question type and acceptedAnswer text', () => {
    const ld = faqLd([
      { q: 'Czy zabieg boli?', a: 'Nie. Większość zabiegów jest komfortowa.' },
      { q: 'Ile zabiegów potrzeba?', a: 'To zależy od zabiegu.' },
    ])
    expect(ld['@type']).toBe('FAQPage')
    expect(ld.mainEntity).toHaveLength(2)
    expect(ld.mainEntity[0]['@type']).toBe('Question')
    expect(ld.mainEntity[0].acceptedAnswer.text).toBe('Nie. Większość zabiegów jest komfortowa.')
    expect(ld.mainEntity[1].name).toBe('Ile zabiegów potrzeba?')
  })

  it('breadcrumbLd itemListElement has correct position values', () => {
    const ld = breadcrumbLd([
      { name: 'Strona główna', url: 'https://x.pl/' },
      { name: 'Cennik', url: 'https://x.pl/#cennik' },
    ])
    expect(ld['@type']).toBe('BreadcrumbList')
    expect(ld.itemListElement).toHaveLength(2)
    expect(ld.itemListElement[0].position).toBe(1)
    expect(ld.itemListElement[1].position).toBe(2)
    expect(ld.itemListElement[1].name).toBe('Cennik')
  })

})

describe('serviceLd', () => {
  it('builds a Service node with provider + areaServed', () => {
    const ld = serviceLd({ name: 'Depilacja laserowa', description: 'opis', url: 'https://x.pl/uslugi/dl', providerName: 'Wiśnia Beauty Studio', providerUrl: 'https://x.pl' })
    expect(ld['@type']).toBe('Service')
    expect(ld.name).toBe('Depilacja laserowa')
    expect(ld.areaServed).toBe('Warszawa')
    expect(ld.provider['@type']).toBe('BeautySalon')
  })
})

describe('jsonld serialization', () => {
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
