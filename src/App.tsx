import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useCapabilities } from './hooks/useCapabilities'
import { useSmoothScroll } from './hooks/useSmoothScroll'
import { useSceneAnimations } from './animations/scrollAnimations/useSceneAnimations'
import { useJourneyTimeline } from './animations/scrollAnimations/useJourneyTimeline'
import { sceneStore } from './animations/sceneStore'
import { scrollToId } from './utils/scroll'
import Navbar from './components/Navbar/Navbar'
import Loader from './components/Loader/Loader'
import Hero from './sections/Hero/Hero'
import About from './sections/About/About'
import Education from './sections/Education/Education'
import Skills from './sections/Skills/Skills'
import Internship from './sections/Internship/Internship'
import Projects from './sections/Projects/Projects'
import Certifications from './sections/Certifications/Certifications'
import Contact from './sections/Contact/Contact'

// Three.js is only fetched when the visitor can actually run the 3D scene.
const BackgroundScene = lazy(() => import('./scenes/BackgroundScene/BackgroundScene'))

export default function App() {
  const { reducedMotion, webgl, compact } = useCapabilities()
  const [ready, setReady] = useState(false)
  const mainRef = useRef<HTMLElement>(null)

  const show3D = webgl && !reducedMotion

  useSmoothScroll(!reducedMotion)
  useJourneyTimeline(show3D)
  useSceneAnimations(mainRef)

  useEffect(() => {
    if (import.meta.env.DEV) (window as unknown as { __scene: typeof sceneStore }).__scene = sceneStore
  }, [])

  // Keep the page still behind the intro overlay, then reveal and honour any #hash deep link.
  useEffect(() => {
    document.body.style.overflow = ready ? '' : 'hidden'
    if (!ready) return
    ScrollTrigger.refresh()
    const id = window.location.hash.replace('#', '')
    if (id) requestAnimationFrame(() => scrollToId(id))
  }, [ready])


  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <div className="stage" aria-hidden="true">
        <div className="stage-glow stage-glow--a" />
        <div className="stage-glow stage-glow--b" />
        <div className="stage-glow stage-glow--c" />
        {show3D && (
          <Suspense fallback={null}>
            <BackgroundScene compact={compact} />
          </Suspense>
        )}
      </div>

      <Navbar />

      <main id="main" ref={mainRef}>
        <Hero />
        <About />
        <Education />
        <Skills />
        <Internship />
        <Projects />
        <Certifications />
        <Contact />
      </main>

      <AnimatePresence>{!ready && <Loader onDone={() => setReady(true)} />}</AnimatePresence>
    </>
  )
}
