import type Lenis from 'lenis'

let lenisInstance: Lenis | null = null

export function setLenis(instance: Lenis | null) {
  lenisInstance = instance
}

export function getLenis() {
  return lenisInstance
}

/** Smoothly scroll to a section id. Falls back to native scrolling without Lenis. */
export function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  history.replaceState(null, '', `#${id}`)
  if (lenisInstance) {
    lenisInstance.scrollTo(el, { offset: -96, duration: 1.6 })
    return
  }
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
}
