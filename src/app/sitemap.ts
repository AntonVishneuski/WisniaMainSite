import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const url = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const paths = ['', '/polityka-prywatnosci']
  return paths.flatMap((p) => [
    { url: `${url}${p}`, alternates: { languages: { pl: `${url}${p}`, ru: `${url}/ru${p}` } } },
    { url: `${url}/ru${p}` },
  ])
}
