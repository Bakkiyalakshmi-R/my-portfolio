import { useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { sceneStore } from '../sceneStore'
import { scenes } from '../../data/content'

gsap.registerPlugin(ScrollTrigger)

/** Fraction of each section-to-section span spent "resting" on a scene before the camera moves on. */
const DWELL = 0.22

/**
 * One GSAP tween scrubbed by the page scroll (via ScrollTrigger, which Lenis feeds) drives the camera
 * journey. Its ease maps scroll progress to a fractional scene index using the measured section
 * centres, so every scene sits in front of the camera exactly while its text is on screen.
 * A single tween means scrolling back replays the same path in reverse with no conflicting writes.
 */
export function useJourneyTimeline(enabled: boolean) {
  useLayoutEffect(() => {
    if (!enabled) return
    let centers: number[] = []
    const measure = () => {
      centers = scenes.map((s) => {
        const el = document.getElementById(s.id)
        if (!el) return 0
        const r = el.getBoundingClientRect()
        return r.top + window.scrollY + r.height / 2
      })
    }
    const toPosition = (progress: number) => {
      if (centers.length < 2) return 0
      const y = progress * ScrollTrigger.maxScroll(window) + window.innerHeight / 2
      const last = centers.length - 1
      if (y <= centers[0]) return 0
      if (y >= centers[last]) return last
      let i = 0
      while (i < last - 1 && y >= centers[i + 1]) i++
      const s = (y - centers[i]) / (centers[i + 1] - centers[i])
      const k = Math.min(1, Math.max(0, (s - DWELL) / (1 - 2 * DWELL)))
      return i + k * k * (3 - 2 * k)
    }

    sceneStore.position = 0
    const tween = gsap.to(sceneStore, {
      position: scenes.length - 1,
      ease: (p: number) => toPosition(p) / (scenes.length - 1),
      scrollTrigger: {
        start: 0,
        end: 'max',
        scrub: 0.7,
        invalidateOnRefresh: true,
        onRefresh: measure,
      },
    })
    measure()

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
      sceneStore.position = 0
    }
  }, [enabled])
}
