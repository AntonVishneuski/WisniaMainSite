'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'

type Props = {
  videoUrl?: string | null
  posterUrl?: string | null
  alt: string
  priority?: boolean
  sizes?: string
  placeholder?: React.ReactNode
}

// Renders the hero media slot into a parent-provided sized box
// (relative aspect-[4/5] rounded overflow-hidden). SSR + first client render show
// the poster image (no hydration mismatch); after mount we upgrade to an
// autoplay/muted/loop video unless the visitor prefers reduced motion or the
// video errors. With no video the image renders as today; with neither, the
// caller's placeholder is shown.
export function HeroMedia({ videoUrl, posterUrl, alt, priority, sizes, placeholder }: Props) {
  const [playVideo, setPlayVideo] = useState(false)

  useEffect(() => {
    if (!videoUrl) return
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
    // Upgrade poster→video only after mount (see note above) to avoid a hydration
    // mismatch; this client-only flip can't be hoisted out of the effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!reduce) setPlayVideo(true)
  }, [videoUrl])

  if (videoUrl && playVideo) {
    return (
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={posterUrl ?? undefined}
        aria-label={alt}
        onError={() => setPlayVideo(false)}
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={videoUrl} />
      </video>
    )
  }

  if (posterUrl) {
    return <Image src={posterUrl} alt={alt} fill priority={priority} sizes={sizes} className="object-cover" />
  }

  return <>{placeholder ?? null}</>
}
