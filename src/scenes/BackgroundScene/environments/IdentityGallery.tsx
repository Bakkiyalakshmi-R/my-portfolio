import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { C, scratch, useStation, type EnvProps } from '../shared'

const RINGS = [
  { z: 4, r: 6.2, c: C.plum, dir: 1 },
  { z: 0, r: 5.5, c: C.terracotta, dir: -1 },
  { z: -4, r: 6.6, c: C.plum, dir: 1 },
  { z: -8, r: 5.8, c: C.olive, dir: -1 },
  { z: -12, r: 6.8, c: C.plum, dir: 1 },
]

const FRAMES = [
  { x: -6.4, y: 1.6, z: -1, w: 2.2, h: 3.0, c: C.sand, ry: 0.5 },
  { x: 6.2, y: -1.2, z: -4.5, w: 2.8, h: 1.9, c: C.sage, ry: -0.45 },
  { x: -5.4, y: -2.3, z: -8.5, w: 2.4, h: 2.4, c: C.sand, ry: 0.35 },
  { x: 5.8, y: 2.4, z: -11, w: 2.0, h: 2.8, c: C.sage, ry: -0.3 },
  { x: -7.2, y: 0.4, z: 3, w: 1.6, h: 2.1, c: C.cream, ry: 0.6 },
]

/**
 * Scene 02 · Identity. Layered depth: rings the camera threads through, framed "memories" floating at
 * different distances (parallax), and small data nodes riding the rings.
 */
export default function IdentityGallery({ compact }: EnvProps) {
  const { group, state } = useStation(1)
  const ringRefs = useRef<Array<THREE.Mesh | null>>([])
  const frameRefs = useRef<Array<THREE.Group | null>>([])
  const orbs = useRef<THREE.InstancedMesh>(null)
  const orbCount = compact ? 12 : 26
  const orbData = useMemo(
    () => Array.from({ length: orbCount }, (_, i) => ({ ring: i % RINGS.length, a: (i / orbCount) * 20, sp: 0.2 + (i % 5) * 0.07 })),
    [orbCount],
  )

  useLayoutEffect(() => {
    const m = orbs.current
    if (!m) return
    for (let i = 0; i < orbCount; i++) m.setColorAt(i, new THREE.Color(i % 3 === 0 ? C.terracotta : C.olive))
    if (m.instanceColor) m.instanceColor.needsUpdate = true
  }, [orbCount])

  useFrame((s) => {
    if (!state.current.active) return
    const t = s.clock.elapsedTime
    const local = state.current.local
    RINGS.forEach((r, i) => {
      const m = ringRefs.current[i]
      if (m) {
        m.rotation.z = t * 0.12 * r.dir + local * 1.4 * r.dir
        m.rotation.x = Math.sin(t * 0.2 + i) * 0.12
      }
    })
    FRAMES.forEach((f, i) => {
      const g = frameRefs.current[i]
      if (g) {
        g.position.y = f.y + Math.sin(t * 0.5 + i * 1.7) * 0.25
        g.rotation.y = f.ry + Math.sin(t * 0.3 + i) * 0.1 + local * 0.5
        g.rotation.z = Math.sin(t * 0.35 + i) * 0.05
      }
    })
    const m = orbs.current
    if (m) {
      for (let i = 0; i < orbCount; i++) {
        const o = orbData[i]
        const ring = RINGS[o.ring]
        const a = o.a + t * o.sp * ring.dir
        scratch.obj.position.set(Math.cos(a) * ring.r, Math.sin(a) * ring.r, ring.z)
        scratch.obj.rotation.set(t, t * 0.7, 0)
        scratch.obj.scale.setScalar(0.17 + 0.05 * Math.sin(t * 2 + i))
        scratch.obj.updateMatrix()
        m.setMatrixAt(i, scratch.obj.matrix)
      }
      m.instanceMatrix.needsUpdate = true
    }
  })

  return (
    <group ref={group}>
      {RINGS.map((r, i) => (
        <mesh key={i} ref={(el) => void (ringRefs.current[i] = el)} position={[0, 0, r.z]}>
          <torusGeometry args={[r.r, 0.045, 8, compact ? 64 : 120]} />
          <meshStandardMaterial color={r.c} roughness={0.5} />
        </mesh>
      ))}

      {FRAMES.map((f, i) => (
        <group key={i} ref={(el) => void (frameRefs.current[i] = el)} position={[f.x, f.y, f.z]}>
          <mesh position={[0, 0, -0.07]}>
            <boxGeometry args={[f.w + 0.28, f.h + 0.28, 0.08]} />
            <meshStandardMaterial color={i % 2 ? C.terracotta : C.plum} roughness={0.5} flatShading />
          </mesh>
          <mesh>
            <boxGeometry args={[f.w, f.h, 0.1]} />
            <meshStandardMaterial color={f.c} roughness={0.8} flatShading />
          </mesh>
          {/* a few data "lines" inside each frame */}
          <mesh position={[0, f.h * 0.22, 0.06]}>
            <boxGeometry args={[f.w * 0.62, 0.07, 0.02]} />
            <meshBasicMaterial color={C.forest} transparent opacity={0.7} />
          </mesh>
          <mesh position={[-f.w * 0.1, 0, 0.06]}>
            <boxGeometry args={[f.w * 0.42, 0.07, 0.02]} />
            <meshBasicMaterial color={C.terracotta} transparent opacity={0.8} />
          </mesh>
          <mesh position={[0, -f.h * 0.22, 0.06]}>
            <boxGeometry args={[f.w * 0.55, 0.07, 0.02]} />
            <meshBasicMaterial color={C.forest} transparent opacity={0.6} />
          </mesh>
        </group>
      ))}

      <instancedMesh ref={orbs} args={[undefined, undefined, orbCount]} frustumCulled={false}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial roughness={0.4} flatShading />
      </instancedMesh>
    </group>
  )
}
