import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const url = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const paths = ['', '/polityka-prywatnosci']
  return paths.flatMap((p) => {
    const languages = { pl: `${url}${p}`, ru: `${url}/ru${p}`, 'x-default': `${url}${p}` }
    return [
      { url: `${url}${p}`, alternates: { languages } },
      { url: `${url}/ru${p}`, alternates: { languages } },
    ]
  })
}
