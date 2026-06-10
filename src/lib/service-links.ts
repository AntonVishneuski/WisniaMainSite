export type ServiceLinkRef = { id: string | number; slug: string; title: string }

export function resolveCrossLinks(
  page: { id: string | number; crossLinks?: Array<ServiceLinkRef | string | number> | null },
  allPublished: ServiceLinkRef[],
  max = 3,
): ServiceLinkRef[] {
  const explicit = (page.crossLinks ?? [])
    .map((c) => (typeof c === 'object' ? c : allPublished.find((p) => p.id === c)))
    .filter(Boolean) as ServiceLinkRef[]
  if (explicit.length) return explicit.slice(0, max)
  return allPublished.filter((p) => p.id !== page.id).slice(0, max)
}
