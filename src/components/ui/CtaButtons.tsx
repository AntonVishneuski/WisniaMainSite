'use client'
type Method = 'whatsapp' | 'phone' | 'booksy'
const KEY = 'wisnia-attribution'

export function CtaLink({ method, href, children, className }: { method: Method; href: string; children: React.ReactNode; className?: string }) {
  function track() {
    const w = window as any
    w.dataLayer = w.dataLayer || []
    let attr = {}
    try { attr = JSON.parse(localStorage.getItem(KEY) || '{}') } catch {}
    w.dataLayer.push({ event: 'cta_click', method, ...attr })
  }
  return (
    <a href={href} onClick={track} target={method === 'phone' ? undefined : '_blank'} rel="noopener" className={className}>
      {children}
    </a>
  )
}
