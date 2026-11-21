import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { setLenis } from '../utils/scroll'

gsap.registerPlugin(ScrollTrigger)

/**
 * Lenis smooth scrolling synchronised with GSAP's ticker. Disabled for reduced motion, and on touch
 * devices Lenis keeps native momentum scrolling, so nobody is trapped in a custom scroller.
 */
export function useSmoothScroll(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true })
    setLenis(lenis)
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      setLenis(null)
    }
  }, [enabled])
}
