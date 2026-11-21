import { useLayoutEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { C, scratch, useStation, type EnvProps } from '../shared'

const FLOOR = -3
const BARS = 7

/**
 * Scene 06 · Exhibition. Two installations on plinths under light beams:
 * WattGuard (animated energy bar chart, left) and the Student Activity Tracker (sorting cards, right).
 */
export default function ExhibitionHall({ compact }: EnvProps) {
  const { group, state } = useStation(5)
  const bars = useRef<Array<THREE.Mesh | null>>([])
  const cards = useRef<Array<THREE.Mesh | null>>([])
  const halo = useRef<THREE.Mesh>(null)
  const spin = useRef<THREE.Group>(null)
  const beams = useRef<THREE.InstancedMesh>(null)
  const cardCount = compact ? 5 : 8

  useLayoutEffect(() => {
    const m = beams.current
    if (!m) return
    ;[-4.2, 4.2].forEach((x, i) => {
      scratch.obj.position.set(x, FLOOR + 4.2, -2)
      scratch.obj.rotation.set(0, 0, 0)
      scratch.obj.scale.set(1, 1, 1)
      scratch.obj.updateMatrix()
      m.setMatrixAt(i, scratch.obj.matrix)
    })
    m.instanceMatrix.needsUpdate = true
  }, [])

  useFrame((s) => {
    if (!state.current.active) return
    const t = s.clock.elapsedTime
    const local = state.current.local
    bars.current.forEach((b, i) => {
      if (!b) return
      const h = 0.7 + (0.5 + 0.5 * Math.sin(t * 1.3 + i * 0.9)) * 2.2 + Math.max(0, -local) * 0.3
      b.scale.y = h
      b.position.y = h / 2
    })
    cards.current.forEach((c, i) => {
      if (!c) return
      // cards cycle through three sorted columns
      const ph = (t * 0.25 + i / cardCount) % 1
      const col = Math.floor(ph * 3)
      const inCol = (ph * 3) % 1
      c.position.x = -1.2 + col * 1.2 + (inCol > 0.85 ? (inCol - 0.85) * 4 : 0)
      c.position.y = 0.4 + (i % 4) * 0.55 + Math.sin(t + i) * 0.05
      c.rotation.y = Math.sin(t * 0.6 + i) * 0.2
    })
    if (halo.current) halo.current.rotation.z = t * 0.3 + local
    if (spin.current) spin.current.rotation.y = t * 0.25 + local * 1.2
  })

  return (
    <group ref={group}>
      <mesh rotation-x={-Math.PI / 2} position={[0, FLOOR, -2]}>
        <circleGeometry args={[15, 48]} />
        <meshStandardMaterial color={C.sand} transparent opacity={0.55} depthWrite={false} />
      </mesh>
      <mesh ref={halo} rotation-x={-Math.PI / 2} position={[0, FLOOR + 0.02, -2]}>
        <ringGeometry args={[8.2, 8.3, 90]} />
        <meshBasicMaterial color={C.terracotta} transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>

      {/* WattGuard installation */}
      <group position={[-4.2, FLOOR, -2]}>
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[2.1, 2.3, 0.4, 32]} />
          <meshStandardMaterial color={C.plum} roughness={0.6} />
        </mesh>
        <group position={[0, 0.4, 0]}>
          {Array.from({ length: BARS }, (_, i) => (
            <mesh key={i} ref={(el) => void (bars.current[i] = el)} position={[(i - (BARS - 1) / 2) * 0.46, 1, 0]}>
              <boxGeometry args={[0.32, 1, 0.32]} />
              <meshStandardMaterial color={i % 3 === 0 ? C.terracotta : C.olive} roughness={0.45} flatShading />
            </mesh>
          ))}
        </group>
        <mesh position={[0, 3.8, 0]} rotation={[0, 0, 0]}>
          <torusGeometry args={[0.45, 0.07, 8, 28]} />
          <meshStandardMaterial color={C.terracotta} />
        </mesh>
      </group>

      {/* Student Activity Tracker installation */}
      <group position={[4.2, FLOOR, -2]}>
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[2.1, 2.3, 0.4, 32]} />
          <meshStandardMaterial color={C.forest} roughness={0.6} />
        </mesh>
        <group ref={spin} position={[0, 0.5, 0]}>
          {Array.from({ length: cardCount }, (_, i) => (
            <mesh key={i} ref={(el) => void (cards.current[i] = el)}>
              <boxGeometry args={[0.8, 0.45, 0.06]} />
              <meshStandardMaterial color={i % 2 ? C.cream : C.sage} roughness={0.7} flatShading />
            </mesh>
          ))}
        </group>
      </group>

      {/* light beams over each plinth */}
      <instancedMesh ref={beams} args={[undefined, undefined, 2]} frustumCulled={false}>
        <cylinderGeometry args={[0.15, 2.0, 8.4, 24, 1, true]} />
        <meshBasicMaterial color="#efd9a0" transparent opacity={0.1} side={THREE.DoubleSide} depthWrite={false} />
      </instancedMesh>
    </group>
  )
}
