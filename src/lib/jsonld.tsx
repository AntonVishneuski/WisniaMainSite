export function localBusinessLd(o: { name: string; url: string; phone?: string; address?: string; geoLat?: string; geoLng?: string; hours?: string; image?: string }) {
  return {
    '@context': 'https://schema.org', '@type': 'BeautySalon',
    name: o.name, url: o.url, telephone: o.phone, image: o.image,
    priceRange: '$$',
    address: { '@type': 'PostalAddress', streetAddress: o.address, addressLocality: 'Warszawa', addressCountry: 'PL' },
    geo: { '@type': 'GeoCoordinates', latitude: o.geoLat, longitude: o.geoLng },
  }
}
export function aggregateRatingLd(ratingValue: string, reviewCount: number) {
  return { '@type': 'AggregateRating', ratingValue, reviewCount }
}
export function faqLd(items: { q: string; a: string }[]) {
  return { '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: items.map((i) => ({ '@type': 'Question', name: i.q, acceptedAnswer: { '@type': 'Answer', text: i.a } })) }
}
export function breadcrumbLd(items: { name: string; url: string }[]) {
  return { '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: it.url })) }
}
export function JsonLd({ data }: { data: object }) {
  const json = JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(new RegExp(' ', 'g'), '\\u2028')
    .replace(new RegExp(' ', 'g'), '\\u2029')
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
}
