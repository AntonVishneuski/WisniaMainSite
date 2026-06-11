'use client'
import { useEffect } from 'react'
import { slugify } from '@/lib/lexical-headings'

export function HeadingAnchors({ containerId }: { containerId: string }) {
  useEffect(() => {
    const root = document.getElementById(containerId)
    if (!root) return
    root.querySelectorAll('h2, h3').forEach((el) => {
      if (!el.id) el.id = slugify(el.textContent ?? '')
    })
  }, [containerId])
  return null
}
