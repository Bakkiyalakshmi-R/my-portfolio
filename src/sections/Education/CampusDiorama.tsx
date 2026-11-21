import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const ROAD = 'M 35 222 C 110 214, 150 188, 215 174 S 300 168, 345 140'

/**
 * Code-drawn miniature campus. The camera "car" travels the road as the section scrolls:
 * road -> campus entrance -> CS classroom. Reproduced from the Figma frame (SVG export
 * was not downloadable), so it is drawn here with the same composition and palette.
 */
export default function CampusDiorama() {
  const root = useRef<SVGSVGElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const dashRef = useRef<SVGPathElement>(null)
  const carRef = useRef<SVGGElement>(null)
  const buildingRef = useRef<SVGGElement>(null)
  const tagRef = useRef<SVGGElement>(null)

  useLayoutEffect(() => {
    const path = pathRef.current
    const car = carRef.current
    if (!path || !car || !root.current) return
    const len = path.getTotalLength()
    const place = (p: number) => {
      const pt = path.getPointAtLength(len * p)
      car.setAttribute('transform', `translate(${pt.x} ${pt.y})`)
    }

    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: reduce)', () => {
      place(0.82)
    })
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const state = { p: 0 }
      place(0)
      gsap.set(dashRef.current, { strokeDasharray: `5 6` })
      gsap.set(buildingRef.current, { transformOrigin: '395px 135px', scale: 0.92, opacity: 0.6 })
      gsap.set(tagRef.current, { opacity: 0, y: 8 })
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top 85%',
          end: 'bottom 35%',
          scrub: 0.6,
        },
      })
      tl.to(state, { p: 0.86, ease: 'none', duration: 1, onUpdate: () => place(state.p) }, 0)
        .to(buildingRef.current, { scale: 1, opacity: 1, ease: 'power1.out', duration: 0.5 }, 0.45)
        .to(tagRef.current, { opacity: 1, y: 0, duration: 0.25 }, 0.75)
      return () => tl.scrollTrigger?.kill()
    })
    return () => mm.revert()
  }, [])

  return (
    <svg
      ref={root}
      className="campus"
      viewBox="0 0 518 254"
      role="img"
      aria-label="Illustration: a road leading to the campus entrance and the CS classroom"
    >
      {/* sun / hill discs */}
      <circle cx="432" cy="49" r="86" fill="#dce4d6" opacity="0.7" />
      <circle cx="86" cy="161" r="24" fill="#3c4b37" opacity="0.28" />
      <circle cx="109" cy="149" r="19" fill="#3c4b37" opacity="0.38" />
      <circle cx="414" cy="144" r="28" fill="#3c4b37" opacity="0.18" />
      <circle cx="440" cy="131" r="22" fill="#76822e" opacity="0.2" />

      {/* road */}
      <path d={ROAD} fill="none" stroke="#dce4d6" strokeWidth="16" strokeLinecap="round" />
      <path ref={pathRef} d={ROAD} fill="none" stroke="none" />
      <path ref={dashRef} d={ROAD} fill="none" stroke="#3c4b37" strokeWidth="1.6" strokeDasharray="5 6" />

      {/* campus building */}
      <g ref={buildingRef}>
        <polygon points="320,56 395,32 470,56" fill="#c85a40" stroke="#3c4b37" strokeWidth="1.6" strokeLinejoin="round" />
        <rect x="328" y="56" width="134" height="76" rx="3" fill="#fbf8f0" stroke="#3c4b37" strokeWidth="1.8" />
        {[346, 366, 424, 444].map((x) => (
          <line key={x} x1={x} y1="64" x2={x} y2="122" stroke="#3c4b37" strokeWidth="2.2" strokeLinecap="round" />
        ))}
        <path d="M385 122 V98 a10 10 0 0 1 20 0 V122 Z" fill="#cdd1c4" />
      </g>

      {/* CS classroom card */}
      <g ref={tagRef}>
        <rect x="406" y="162" width="95" height="60" rx="8" fill="#fff" stroke="#3c4b37" strokeWidth="1.4" />
        <text x="416" y="181" fontFamily="Space Mono, monospace" fontWeight="700" fontSize="7.8" fill="#485942">
          CS CLASSROOM
        </text>
        <rect x="416" y="189" width="24" height="15.5" rx="2" fill="#d9ddd2" />
        <rect x="445" y="189" width="24" height="15.5" rx="2" fill="#d9ddd2" />
        <rect x="474" y="189" width="17" height="15.5" rx="2" fill="#f1d4cc" />
        <text x="416" y="214" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="6.9" fill="#292a27">
          Terminal 03
        </text>
      </g>

      {/* camera (travelling dot) */}
      <g ref={carRef}>
        <circle r="9" fill="#b8472e" opacity="0.18" />
        <rect x="-5" y="-4" width="10" height="8" rx="2" fill="#b8472e" />
        <circle cx="-3" cy="5" r="1.6" fill="#3c4b37" />
        <circle cx="3" cy="5" r="1.6" fill="#3c4b37" />
      </g>
    </svg>
  )
}
