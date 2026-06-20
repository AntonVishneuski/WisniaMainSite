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
// (relative aspect-[4/5] rounded overflow-hidden). The poster image is ALWAYS
// the base layer, so it paints instantly (priority) as a placeholder and never
// disappears. When a video is present — and the visitor doesn't prefer reduced
// motion — it mounts on top and fades in only once it has a frame to show, so
// there is never a blank gap while it loads. With neither poster nor video the
// caller's placeholder is shown.
export function HeroMedia({ videoUrl, posterUrl, alt, priority, sizes, placeholder }: Props) {
  const [playVideo, setPlayVideo] = useState(false)
  const [videoReady, setVideoReady] = useState(false)

  useEffect(() => {
    if (!videoUrl) return
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
    // Playing the video is a client-only decision (the reduced-motion check is
    // unavailable during SSR), so it must flip after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!reduce) setPlayVideo(true)
  }, [videoUrl])

  if (!posterUrl && !videoUrl) return <>{placeholder ?? null}</>

  return (
    <>
      {/* Poster: always-on base layer so something is visible the instant the
          box paints, and it stays put as the video fades in over it. */}
      {posterUrl && (
        <Image src={posterUrl} alt={alt} fill priority={priority} sizes={sizes} className="object-cover" />
      )}
      {videoUrl && playVideo && (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={alt}
          onLoadedData={() => setVideoReady(true)}
          onCanPlay={() => setVideoReady(true)}
          onError={() => setPlayVideo(false)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            videoReady ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <source src={videoUrl} />
        </video>
      )}
    </>
  )
}
