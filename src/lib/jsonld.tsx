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
export function serviceLd(o: { name: string; description?: string; url: string; providerName: string; providerUrl: string; image?: string }) {
  return {
    '@context': 'https://schema.org', '@type': 'Service',
    name: o.name, description: o.description, url: o.url, image: o.image,
    areaServed: 'Warszawa',
    provider: { '@type': 'BeautySalon', name: o.providerName, url: o.providerUrl },
  }
}
export function medicalWebPageLd(o: {
  headline: string
  description?: string
  url: string
  datePublished?: string
  dateModified?: string
  lastReviewed?: string
  authorName: string
  authorJobTitle?: string
  authorUrl?: string
  reviewerName?: string
  reviewerJobTitle?: string
  image?: string
  publisherName: string
  publisherUrl?: string
  aboutName?: string
  inLanguage: string
}) {
  const author = { '@type': 'Person', name: o.authorName, jobTitle: o.authorJobTitle, url: o.authorUrl }
  const reviewedBy = o.reviewerName
    ? { '@type': 'Person', name: o.reviewerName, jobTitle: o.reviewerJobTitle }
    : undefined
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    headline: o.headline,
    description: o.description,
    inLanguage: o.inLanguage,
    url: o.url,
    mainEntityOfPage: o.url,
    datePublished: o.datePublished,
    dateModified: o.dateModified || o.datePublished,
    lastReviewed: o.lastReviewed,
    specialty: 'CosmeticProcedure',
    audience: { '@type': 'MedicalAudience', audienceType: 'Patient' },
    author,
    reviewedBy,
    image: o.image ? { '@type': 'ImageObject', url: o.image } : undefined,
    publisher: { '@type': 'Organization', name: o.publisherName, url: o.publisherUrl },
    about: o.aboutName ? { '@type': 'MedicalProcedure', name: o.aboutName } : undefined,
  }
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
