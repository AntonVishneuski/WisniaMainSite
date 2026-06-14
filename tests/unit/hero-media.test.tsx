import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { HeroMedia } from '../../src/components/ui/HeroMedia'

function mockReducedMotion(reduce: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: reduce,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
}

afterEach(() => cleanup())

describe('HeroMedia', () => {
  it('plays the video (muted/loop/playsinline/autoplay + poster) when motion is allowed', () => {
    mockReducedMotion(false)
    const { container } = render(
      <HeroMedia videoUrl="/v.mp4" posterUrl="/p.jpg" alt="hero" sizes="420px" />,
    )
    const video = container.querySelector('video') as HTMLVideoElement | null
    expect(video).toBeTruthy()
    expect(video!.muted).toBe(true)
    expect(video!.loop).toBe(true)
    expect(video!.autoplay).toBe(true)
    expect(video!.playsInline).toBe(true)
    expect(video!.getAttribute('preload')).toBe('metadata')
    expect(video!.getAttribute('poster')).toBe('/p.jpg')
    expect(video!.querySelector('source')?.getAttribute('src')).toBe('/v.mp4')
  })

  it('shows the poster image (no video) under prefers-reduced-motion', () => {
    mockReducedMotion(true)
    const { container } = render(
      <HeroMedia videoUrl="/v.mp4" posterUrl="/p.jpg" alt="hero" sizes="420px" />,
    )
    expect(container.querySelector('video')).toBeNull()
    expect(container.querySelector('img')).toBeTruthy()
  })

  it('shows the image when there is no video', () => {
    mockReducedMotion(false)
    const { container } = render(
      <HeroMedia posterUrl="/p.jpg" alt="hero" sizes="420px" />,
    )
    expect(container.querySelector('video')).toBeNull()
    expect(container.querySelector('img')).toBeTruthy()
  })

  it('renders the placeholder when neither video nor poster is set', () => {
    mockReducedMotion(false)
    const { container, getByText } = render(
      <HeroMedia alt="hero" placeholder={<span>brak</span>} />,
    )
    expect(container.querySelector('video')).toBeNull()
    expect(container.querySelector('img')).toBeNull()
    expect(getByText('brak')).toBeTruthy()
  })
})
