'use client'
import { useEffect, useRef, useState } from 'react'

export function Reveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [vis, setVis] = useState(false)
  useEffect(() => {
    // Show immediately (no scroll animation) for reduced-motion users or when
    // IntersectionObserver is unavailable, so content is never stuck hidden.
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
    // Visibility depends on client-only APIs (matchMedia/IntersectionObserver) and must
    // stay false on first paint to match SSR, so this flip can't move out of the effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (reduceMotion || typeof IntersectionObserver === 'undefined') { setVis(true); return }
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVis(true)
          io.disconnect()
        }
      },
      { threshold: 0.12 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <div ref={ref} className={`reveal ${vis ? 'is-visible' : ''} ${className}`}>
      {children}
    </div>
  )
}
