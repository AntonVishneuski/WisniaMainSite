// Lightweight GTM dataLayer event helper. Every client-side analytics event
// funnels through here so attribution captured by UtmCapture is consistently
// attached and the dataLayer contract lives in one place.
const ATTR_KEY = 'wisnia-attribution'

export function pushEvent(event: string, params: Record<string, unknown> = {}): void {
  if (typeof window === 'undefined') return
  const w = window as unknown as { dataLayer?: Record<string, unknown>[] }
  w.dataLayer = w.dataLayer || []
  let attr: Record<string, unknown> = {}
  try {
    attr = JSON.parse(localStorage.getItem(ATTR_KEY) || '{}')
  } catch {
    /* attribution is best-effort */
  }
  w.dataLayer.push({ event, ...attr, ...params })
}
