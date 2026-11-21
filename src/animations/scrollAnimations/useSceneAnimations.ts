import { useLayoutEffect, type RefObject } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Scroll-scrubbed DOM choreography. Every tween is driven by scroll position (scrub), so the page
 * behaves like a timeline that can be reversed. Skipped entirely when the visitor prefers reduced motion.
 */
export function useSceneAnimations(root: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const q = gsap.utils.selector(root)

        // 1. Individual elements rise into frame as their scene approaches.
        q<HTMLElement>('[data-enter]').forEach((el) => {
          if (el.closest('[data-stagger]')) return
          gsap.fromTo(
            el,
            { y: 48, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              ease: 'none',
              scrollTrigger: { trigger: el, start: 'top 94%', end: 'top 66%', scrub: 0.5 },
            },
          )
        })

        // 2. Groups (pedestals, tools, projects) arrive one after another.
        q<HTMLElement>('[data-stagger]').forEach((group) => {
          gsap.fromTo(
            Array.from(group.children),
            { y: 70, opacity: 0, scale: 0.97 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              ease: 'none',
              stagger: 0.18,
              scrollTrigger: { trigger: group, start: 'top 92%', end: 'top 38%', scrub: 0.6 },
            },
          )
        })

        // 3. Hero callout drifts slower than the page (parallax).
        q<HTMLElement>('[data-parallax]').forEach((el) => {
          gsap.to(el, {
            y: -70,
            ease: 'none',
            scrollTrigger: { trigger: '#world', start: 'top top', end: 'bottom top', scrub: true },
          })
        })

        // 4. Scene exit: the content recedes slightly as the camera moves on.
        q<HTMLElement>('section[data-scene]').forEach((section, i, all) => {
          if (i === all.length - 1) return
          const inner = section.querySelector<HTMLElement>('.scene-inner')
          if (!inner) return
          gsap.to(inner, {
            opacity: 0.35,
            y: -36,
            scale: 0.985,
            ease: 'none',
            scrollTrigger: { trigger: section, start: 'bottom 45%', end: 'bottom 0%', scrub: true },
          })
        })

        // 5. Timeline: the paper line draws itself, milestones pop in along it.
        const timeline = q<HTMLElement>('.timeline')[0]
        if (timeline) {
          gsap.fromTo(
            '.timeline__line',
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: 'none',
              scrollTrigger: { trigger: timeline, start: 'top 75%', end: 'bottom 70%', scrub: 0.4 },
            },
          )
          q<HTMLElement>('[data-milestone]').forEach((m) => {
            const dot = m.querySelector('.milestone__dot')
            const card = m.querySelector('.milestone__card')
            const tl = gsap.timeline({
              scrollTrigger: { trigger: m, start: 'top 88%', end: 'top 55%', scrub: 0.5 },
            })
            tl.fromTo(dot, { scale: 0 }, { scale: 1, ease: 'back.out(2)', duration: 0.4 }, 0).fromTo(
              card,
              { x: -50, opacity: 0 },
              { x: 0, opacity: 1, ease: 'none', duration: 1 },
              0,
            )
          })
        }

        // 6. Final convergence: both halves of the contact card slide together.
        q<HTMLElement>('[data-converge]').forEach((el) => {
          const dir = el.dataset.converge === 'left' ? -1 : 1
          gsap.fromTo(
            el,
            { x: 60 * dir, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              ease: 'none',
              scrollTrigger: { trigger: '#connect .contact__card', start: 'top 85%', end: 'top 35%', scrub: 0.6 },
            },
          )
        })
      })
    }, root)

    const refresh = () => ScrollTrigger.refresh()
    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts
    fonts?.ready.then(refresh)
    window.addEventListener('load', refresh)

    return () => {
      window.removeEventListener('load', refresh)
      ctx.revert()
    }
  }, [root])
}
