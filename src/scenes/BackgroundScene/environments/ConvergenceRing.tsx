import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import Particles from '../Particles'
import { C, useStation, type EnvProps } from '../shared'

const RINGS = [
  { r: 2.2, c: C.terracotta, tilt: 0.0 },
  { r: 3.1, c: C.plum, tilt: 0.5 },
  { r: 4.0, c: C.olive, tilt: -0.5 },
  { r: 5.0, c: C.forest, tilt: 1.0 },
]

/**
 * Scene 08 · Connect. The finale: every motif converges into a set of concentric rings around a glowing core.
 * Rotation speeds up slightly as the camera arrives, then settles.
 */
export default function ConvergenceRing({ compact }: EnvProps) {
  const { group, state } = useStation(7, 1.6)
  const rings = useRef<Array<THREE.Mesh | null>>([])
  const core = useRef<THREE.Mesh>(null)

  useFrame((s) => {
    if (!state.current.active) return
    const t = s.clock.elapsedTime
    const local = state.current.local
    rings.current.forEach((m, i) => {
      if (!m) return
      m.rotation.x = RINGS[i].tilt + Math.sin(t * 0.3 + i) * 0.2
      m.rotation.y = t * (0.18 + i * 0.07) * (i % 2 ? -1 : 1) + local * 1.5
    })
    if (core.current) {
      core.current.rotation.set(t * 0.4, t * 0.3, 0)
      core.current.scale.setScalar(1 + Math.sin(t * 1.5) * 0.06)
    }
  })

  return (
    <group ref={group}>
      <group position={[0, 0.2, -4]}>
      {RINGS.map((r, i) => (
        <mesh key={i} ref={(el) => void (rings.current[i] = el)}>
          <torusGeometry args={[r.r, 0.05, 8, compact ? 64 : 128]} />
          <meshStandardMaterial color={r.c} roughness={0.4} />
        </mesh>
      ))}
      <mesh ref={core}>
        <icosahedronGeometry args={[0.9, 1]} />
        <meshStandardMaterial color={C.terracotta} roughness={0.3} flatShading />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.5, 24, 16]} />
        <meshBasicMaterial color="#efd9a0" transparent opacity={0.18} depthWrite={false} />
      </mesh>
      <Particles count={compact ? 50 : 130} color={C.plum} area={[16, 9, 14]} />
      </group>
    </group>
  )
}
