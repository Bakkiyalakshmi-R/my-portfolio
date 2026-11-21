import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { sceneStore } from '../../animations/sceneStore'
import { SCENE_COUNT, gatePoint } from './journey'
import { C, clamp01, scratch, smooth } from './shared'

/** Tone of the scene each gate leads into. */
const GATE_TONES = [C.plum, C.forest, C.olive, C.terracotta, C.terracotta, C.plum, C.terracotta]
const TICKS = 18

function Gate({ index, compact }: { index: number; compact: boolean }) {
  const group = useRef<THREE.Group>(null)
  const outer = useRef<THREE.Mesh>(null)
  const inner = useRef<THREE.Mesh>(null)
  const ticks = useRef<THREE.InstancedMesh>(null)
  const mats = useRef<THREE.Material[]>([])
  const at = useMemo(() => gatePoint(index), [index])
  const tone = GATE_TONES[index]

  useLayoutEffect(() => {
    const m = ticks.current
    if (!m) return
    for (let i = 0; i < TICKS; i++) {
      const a = (i / TICKS) * Math.PI * 2
      scratch.obj.position.set(Math.cos(a) * 4.3, Math.sin(a) * 4.3, 0)
      scratch.obj.rotation.set(0, 0, a)
      scratch.obj.scale.set(0.5, 0.06, 0.06)
      scratch.obj.updateMatrix()
      m.setMatrixAt(i, scratch.obj.matrix)
    }
    m.instanceMatrix.needsUpdate = true
  }, [])

  useFrame((state) => {
    const g = group.current
    if (!g) return
    // Fade the ring in as travel toward it begins and out once the camera has passed through.
    const d = sceneStore.position - (index + 0.5)
    const fade = smooth(clamp01(1 - Math.abs(d) / 0.62))
    const on = fade > 0.01
    if (g.visible !== on) g.visible = on
    if (!on) return
    const t = state.clock.elapsedTime
    if (outer.current) outer.current.rotation.z = t * 0.25
    if (inner.current) inner.current.rotation.z = -t * 0.42
    if (ticks.current) ticks.current.rotation.z = t * 0.12
    for (const m of mats.current) m.opacity = fade * (m.userData.max as number)
    g.scale.setScalar(0.85 + fade * 0.25)
  })

  const reg = (max: number) => (m: THREE.Material | null) => {
    if (m && !mats.current.includes(m)) {
      m.userData.max = max
      mats.current.push(m)
    }
  }

  return (
    <group ref={group} position={at} rotation={[0, 0, index * 0.5]} visible={false}>
      <mesh ref={outer}>
        <torusGeometry args={[3.7, 0.055, 8, compact ? 56 : 96]} />
        <meshBasicMaterial ref={reg(0.9)} color={tone} transparent depthWrite={false} />
      </mesh>
      <mesh ref={inner}>
        <torusGeometry args={[2.8, 0.03, 8, compact ? 48 : 80, Math.PI * 1.55]} />
        <meshBasicMaterial ref={reg(0.7)} color={C.terracotta} transparent depthWrite={false} />
      </mesh>
      <instancedMesh ref={ticks} args={[undefined, undefined, TICKS]} frustumCulled={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial ref={reg(0.65)} color={tone} transparent depthWrite={false} />
      </instancedMesh>
    </group>
  )
}

/** A glowing ring between every pair of scenes. The camera flies through it. */
export default function Gates({ compact }: { compact: boolean }) {
  return (
    <>
      {Array.from({ length: SCENE_COUNT - 1 }, (_, i) => (
        <Gate key={i} index={i} compact={compact} />
      ))}
    </>
  )
}
