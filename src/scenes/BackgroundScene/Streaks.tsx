import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { sceneStore } from '../../animations/sceneStore'
import { C, clamp01, seeded, useDisposable } from './shared'

/**
 * Speed lines streaming past the camera while the page is being scrolled. They live in camera space,
 * so they always read as the world rushing by; their length and opacity follow the travel speed.
 */
export default function Streaks({ count }: { count: number }) {
  const group = useRef<THREE.Group>(null)
  const lines = useRef<THREE.LineSegments>(null)
  const mat = useRef<THREE.LineBasicMaterial>(null)
  const seeds = useMemo(() => {
    const r = seeded(21)
    return Array.from({ length: count }, () => ({
      x: Math.cos(r() * 6.283) * (2.4 + r() * 7),
      y: Math.sin(r() * 6.283) * (1.8 + r() * 4.5),
      z: -r() * 38 - 2,
    }))
  }, [count])
  const geo = useDisposable(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 6), 3))
    return g
  }, [count])

  useFrame((state, delta) => {
    const g = group.current
    const l = lines.current
    if (!g || !l || !mat.current) return
    const v = sceneStore.velocity
    const speed = Math.abs(v)
    const o = clamp01((speed - 0.12) / 0.8)
    if (o < 0.02) {
      l.visible = false
      return
    }
    l.visible = true
    mat.current.opacity = o * 0.5
    g.position.copy(state.camera.position)
    g.quaternion.copy(state.camera.quaternion)
    const dir = v >= 0 ? 1 : -1
    const len = 0.5 + Math.min(speed, 2) * 3.2
    const dz = Math.min(delta, 0.05) * (14 + speed * 70) * dir
    const arr = (geo.getAttribute('position') as THREE.BufferAttribute).array as Float32Array
    for (let i = 0; i < count; i++) {
      const s = seeds[i]
      s.z += dz
      if (s.z > -1.5) s.z -= 38
      if (s.z < -40) s.z += 38
      arr[i * 6] = s.x
      arr[i * 6 + 1] = s.y
      arr[i * 6 + 2] = s.z
      arr[i * 6 + 3] = s.x
      arr[i * 6 + 4] = s.y
      arr[i * 6 + 5] = s.z - len
    }
    ;(geo.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true
  })

  return (
    <group ref={group}>
      <lineSegments ref={lines} geometry={geo} frustumCulled={false} visible={false}>
        <lineBasicMaterial ref={mat} color={C.plum} transparent opacity={0} depthWrite={false} />
      </lineSegments>
    </group>
  )
}
