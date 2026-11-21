import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { isShown, seeded, useDisposable } from './shared'

type Props = {
  count: number
  color: string
  /** Size of the box the points drift in. */
  area: [number, number, number]
  size?: number
  /** Upward drift in units per second. */
  speed?: number
  opacity?: number
  seed?: number
}

/** A cloud of soft dots drifting upward and wrapping around: cheap depth and motion cue. */
export default function Particles({ count, color, area, size = 0.07, speed = 0.18, opacity = 0.7, seed = 3 }: Props) {
  const ref = useRef<THREE.Points>(null)
  const geo = useDisposable(() => {
    const r = seeded(seed)
    const a = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      a[i * 3] = (r() - 0.5) * area[0]
      a[i * 3 + 1] = (r() - 0.5) * area[1]
      a[i * 3 + 2] = (r() - 0.5) * area[2]
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(a, 3))
    return g
  }, [count, seed, area[0], area[1], area[2]])

  useFrame((_, delta) => {
    const pts = ref.current
    if (!isShown(pts)) return
    const attr = geo.getAttribute('position') as THREE.BufferAttribute
    const arr = attr.array as Float32Array
    const half = area[1] / 2
    const dy = Math.min(delta, 0.05) * speed
    for (let i = 0; i < count; i++) {
      let y = arr[i * 3 + 1] + dy * (0.6 + ((i * 7) % 5) * 0.2)
      if (y > half) y -= area[1]
      arr[i * 3 + 1] = y
    }
    attr.needsUpdate = true
  })

  return (
    <points ref={ref} geometry={geo} frustumCulled={false}>
      <pointsMaterial color={color} size={size} sizeAttenuation transparent opacity={opacity} depthWrite={false} />
    </points>
  )
}
