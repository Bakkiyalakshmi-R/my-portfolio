import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { C, useStation, type EnvProps } from '../shared'

const MARKS = [
  { x: -3.6, y: 0.4, z: 1, c: C.terracotta, done: true },
  { x: 0, y: -0.2, z: -4, c: C.olive, done: false },
  { x: 3.6, y: 0.4, z: -9, c: C.plum, done: true },
]

/**
 * Scene 07 · Milestones. A timeline running into the distance: a glowing spine, three milestone markers
 * (the middle one is "in progress", drawn as a partial arc) and drifting date-tick particles.
 */
export default function TimelineRun({ compact }: EnvProps) {
  const { group, state } = useStation(6)
  const markers = useRef<Array<THREE.Group | null>>([])
  const ticks = useRef<THREE.Group>(null)
  const tickCount = compact ? 8 : 16

  useFrame((s) => {
    if (!state.current.active) return
    const t = s.clock.elapsedTime
    const local = state.current.local
    markers.current.forEach((m, i) => {
      if (!m) return
      m.rotation.y = t * 0.5 + i + local
      m.position.y = MARKS[i].y + Math.sin(t * 0.8 + i * 2) * 0.25
    })
    if (ticks.current) ticks.current.rotation.z = Math.sin(t * 0.2) * 0.05
  })

  return (
    <group ref={group}>
      {/* spine */}
      <mesh position={[0, -2.2, -4]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 26, 8]} />
        <meshBasicMaterial color={C.terracotta} />
      </mesh>
      <group ref={ticks}>
        {Array.from({ length: tickCount }, (_, i) => (
          <mesh key={i} position={[0, -2.2, 8 - i * 1.6]}>
            <boxGeometry args={[i % 4 === 0 ? 1.6 : 0.8, 0.04, 0.04]} />
            <meshBasicMaterial color={C.plum} transparent opacity={0.6} />
          </mesh>
        ))}
      </group>

      {MARKS.map((m, i) => (
        <group key={i} position={[m.x, m.y, m.z]}>
          <mesh position={[0, -1.3 - m.y / 2, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 2.6, 6]} />
            <meshBasicMaterial color={m.c} />
          </mesh>
          <group ref={(el) => void (markers.current[i] = el)}>
            <mesh>
              <icosahedronGeometry args={[0.55, 0]} />
              <meshStandardMaterial color={m.c} roughness={0.4} flatShading />
            </mesh>
            <mesh>
              <torusGeometry args={[1.1, 0.04, 8, 60, m.done ? Math.PI * 2 : Math.PI * 1.1]} />
              <meshStandardMaterial color={m.c} />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[1.5, 0.02, 8, 60]} />
              <meshBasicMaterial color={m.c} transparent opacity={0.45} />
            </mesh>
          </group>
        </group>
      ))}
    </group>
  )
}
