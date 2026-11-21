import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { sceneStore } from '../../animations/sceneStore'
import { FOV, ROLL, SCENE_COUNT, lerpTable, sampleJourney } from './journey'
import { C, clamp01, smooth } from './shared'

type Key = {
  amb: number
  ambColor: string
  key: number
  keyColor: string
  accent: number
  accentColor: string
  pop: number
  popColor: string
  fogFar: number
}

/** Lighting per scene: warm daylight, plum dusk, sunlit road, cool lab, scan-red ops room, gallery, dusk, gold. */
const KEYS: Key[] = [
  { amb: 1.0, ambColor: '#fff7ea', key: 1.5, keyColor: '#fff1dc', accent: 16, accentColor: C.terracotta, pop: 0, popColor: '#ffd9a8', fogFar: 48 },
  { amb: 0.9, ambColor: '#f6ecf0', key: 1.3, keyColor: '#f4e6ee', accent: 22, accentColor: C.plum, pop: 8, popColor: '#e9c7da', fogFar: 44 },
  { amb: 1.15, ambColor: '#fff6df', key: 1.9, keyColor: '#ffe9b8', accent: 14, accentColor: C.olive, pop: 10, popColor: '#ffd98a', fogFar: 56 },
  { amb: 0.85, ambColor: '#eef4ea', key: 1.2, keyColor: '#e4f2e2', accent: 26, accentColor: C.olive, pop: 12, popColor: '#cfe6c0', fogFar: 42 },
  { amb: 0.7, ambColor: '#f4e8e3', key: 1.0, keyColor: '#f1ddd6', accent: 34, accentColor: C.terracotta, pop: 10, popColor: '#ff9d86', fogFar: 40 },
  { amb: 0.75, ambColor: '#fbf2e3', key: 1.1, keyColor: '#ffe9c9', accent: 18, accentColor: C.terracotta, pop: 36, popColor: '#ffe2b0', fogFar: 46 },
  { amb: 0.85, ambColor: '#f3e8ee', key: 1.2, keyColor: '#f0dde8', accent: 24, accentColor: C.plum, pop: 14, popColor: '#e4b8cc', fogFar: 46 },
  { amb: 1.1, ambColor: '#fff4dd', key: 1.6, keyColor: '#ffeac2', accent: 20, accentColor: C.terracotta, pop: 44, popColor: '#ffd37a', fogFar: 50 },
]

const keyColors = KEYS.map((k) => ({
  amb: new THREE.Color(k.ambColor),
  key: new THREE.Color(k.keyColor),
  accent: new THREE.Color(k.accentColor),
  pop: new THREE.Color(k.popColor),
}))

const P = new THREE.Vector3()
const L = new THREE.Vector3()
const fwd = new THREE.Vector3()

/**
 * Owns the camera, the three fixed lights and the fog. Everything is a pure function of
 * `sceneStore.position` (scrubbed by GSAP), so scrolling forward flies the camera along the path
 * and scrolling back replays it exactly in reverse.
 */
export default function JourneyRig({ compact }: { compact: boolean }) {
  const amb = useRef<THREE.AmbientLight>(null)
  const key = useRef<THREE.PointLight>(null)
  const accent = useRef<THREE.PointLight>(null)
  const pop = useRef<THREE.PointLight>(null)
  const fog = useRef<THREE.Fog>(null)
  const pointer = useRef({ x: 0, y: 0, sx: 0, sy: 0 })
  const last = useRef(0)
  const vel = useRef(0)
  const fov = useRef(45)

  useEffect(() => {
    if (compact) return
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [compact])

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05)
    const time = state.clock.elapsedTime
    const cam = state.camera as THREE.PerspectiveCamera
    const pos = THREE.MathUtils.clamp(sceneStore.position, 0, SCENE_COUNT - 1)

    // Travel speed in scenes per second (smoothed), shared with the speed streaks.
    vel.current = THREE.MathUtils.damp(vel.current, (pos - last.current) / Math.max(dt, 1e-4), 6, dt)
    last.current = pos
    sceneStore.velocity = vel.current

    // ---- camera position / look-at along the journey path
    sampleJourney(pos, P, L)
    const frac = pos - Math.floor(pos)
    const idx = Math.floor(pos)
    P.x += Math.sin(time * 0.31) * 0.12
    P.y += Math.cos(time * 0.27) * 0.08
    const finale = smooth(clamp01((pos - 6.6) / 0.4))
    P.x += Math.sin(time * 0.22) * 0.9 * finale
    cam.position.copy(P)
    cam.lookAt(L)

    // ---- roll: resting tilt per scene plus banking through each gate
    const bank = Math.sin(frac * Math.PI) * (idx % 2 ? 1 : -1) * 0.075
    cam.rotateZ(lerpTable(ROLL, pos) + bank)

    // ---- pointer parallax (desktop only)
    const ptr = pointer.current
    ptr.sx = THREE.MathUtils.damp(ptr.sx, ptr.x, 3, dt)
    ptr.sy = THREE.MathUtils.damp(ptr.sy, ptr.y, 3, dt)
    cam.translateX(ptr.sx * 0.55)
    cam.translateY(-ptr.sy * 0.32)

    // ---- zoom: base per scene, widening surge mid-transition, wider on narrow screens
    const surge = Math.pow(Math.sin(frac * Math.PI), 1.4) * 9
    const aspect = state.size.width / Math.max(1, state.size.height)
    const narrow = aspect < 1 ? Math.min(1.55, 1 + (1 - aspect) * 1.1) : 1
    const targetFov = (lerpTable(FOV, pos) + surge) * narrow
    fov.current = THREE.MathUtils.damp(fov.current, targetFov, 8, dt)
    if (Math.abs(cam.fov - fov.current) > 0.01) {
      cam.fov = fov.current
      cam.updateProjectionMatrix()
    }
    sceneStore.camera = [cam.position.x, cam.position.y, cam.position.z]

    // ---- lighting keyed to the same scene index
    const i0 = Math.min(KEYS.length - 2, Math.floor(pos))
    const t = smooth(pos - i0)
    const a = KEYS[i0]
    const b = KEYS[i0 + 1]
    const ca = keyColors[i0]
    const cb = keyColors[i0 + 1]
    const mix = (x: number, y: number) => x + (y - x) * t

    cam.getWorldDirection(fwd)
    if (amb.current) {
      amb.current.intensity = mix(a.amb, b.amb)
      amb.current.color.copy(ca.amb).lerp(cb.amb, t)
    }
    if (key.current) {
      key.current.intensity = mix(a.key, b.key)
      key.current.color.copy(ca.key).lerp(cb.key, t)
      key.current.position.set(cam.position.x + 3, cam.position.y + 5, cam.position.z + 4)
    }
    if (accent.current) {
      // A coloured light orbiting ahead of the camera: it sweeps across surfaces as you travel.
      accent.current.intensity = mix(a.accent, b.accent)
      accent.current.color.copy(ca.accent).lerp(cb.accent, t)
      accent.current.position.set(
        cam.position.x + fwd.x * 9 + Math.sin(time * 0.7) * 5,
        cam.position.y + fwd.y * 9 + 2.5 + Math.cos(time * 0.5) * 1.5,
        cam.position.z + fwd.z * 9 + 2,
      )
    }
    if (pop.current) {
      pop.current.intensity = mix(a.pop, b.pop)
      pop.current.color.copy(ca.pop).lerp(cb.pop, t)
      pop.current.position.set(L.x, L.y + 4.5, L.z + 5)
    }
    if (fog.current) fog.current.far = mix(a.fogFar, b.fogFar) * (compact ? 0.85 : 1)
  })

  return (
    <>
      <fog ref={fog} attach="fog" args={[C.paper, 10, 48]} />
      <ambientLight ref={amb} intensity={1} />
      <pointLight ref={key} decay={0} intensity={1.5} />
      <pointLight ref={accent} decay={1} distance={0} intensity={16} color={C.terracotta} />
      <pointLight ref={pop} decay={1} distance={0} intensity={0} color="#ffd9a8" />
    </>
  )
}
