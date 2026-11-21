import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import Particles from '../Particles'
import { C, scratch, seeded, useDisposable, useStation, type EnvProps } from '../shared'

const PALETTE = [C.terracotta, C.olive, C.plum, C.forest].map((c) => new THREE.Color(c))

/**
 * Scene 01 · World. A data-inspired space: a swarm of faceted nodes with a drifting web of connections,
 * a terracotta toroid, a chartreuse wire solid and a wireframe lattice at three different depths.
 */
export default function HeroWorld({ compact }: EnvProps) {
  const { group, state } = useStation(0)
  const swarm = useRef<THREE.InstancedMesh>(null)
  const torus = useRef<THREE.Mesh>(null)
  const solid = useRef<THREE.Mesh>(null)
  const lattice = useRef<THREE.LineSegments>(null)
  const count = compact ? 30 : 64
  const nodeCount = compact ? 9 : 15
  const pos = useMemo(() => new Float32Array(nodeCount * 3), [nodeCount])

  const items = useMemo(() => {
    const r = seeded(11)
    return Array.from({ length: count }, () => ({
      base: new THREE.Vector3((r() - 0.5) * 19, (r() - 0.5) * 9.5, 5 - r() * 20),
      ph: r() * 6.283,
      sp: 0.25 + r() * 0.45,
      amp: 0.3 + r() * 0.9,
      s: 0.2 + r() * 0.22,
    }))
  }, [count])

  // Connections between the first `nodeCount` swarm members (each links to two neighbours).
  const edges = useMemo(() => {
    const e: number[] = []
    for (let i = 0; i < nodeCount; i++) e.push(i, (i + 1) % nodeCount, i, (i + 4) % nodeCount)
    return e
  }, [nodeCount])
  const lineGeo = useDisposable(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(edges.length * 3), 3))
    return g
  }, [edges])
  const latticeGeo = useDisposable(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(3, 3, 3, 2, 2, 2)), [])

  useLayoutEffect(() => {
    const m = swarm.current
    if (!m) return
    for (let i = 0; i < count; i++) m.setColorAt(i, PALETTE[i % PALETTE.length])
    if (m.instanceColor) m.instanceColor.needsUpdate = true
  }, [count])

  useFrame((s) => {
    if (!state.current.active) return
    const t = s.clock.elapsedTime
    const local = state.current.local
    const m = swarm.current
    if (m) {
      for (let i = 0; i < count; i++) {
        const it = items[i]
        const a = t * it.sp + it.ph
        scratch.obj.position.set(
          it.base.x + Math.sin(a) * it.amp,
          it.base.y + Math.cos(a * 0.9) * it.amp,
          it.base.z + Math.sin(a * 0.7) * it.amp * 0.6,
        )
        scratch.obj.rotation.set(t * 0.3 + i, t * 0.22 + i * 0.5, 0)
        scratch.obj.scale.setScalar(it.s)
        scratch.obj.updateMatrix()
        m.setMatrixAt(i, scratch.obj.matrix)
        if (i < nodeCount) {
          pos[i * 3] = scratch.obj.position.x
          pos[i * 3 + 1] = scratch.obj.position.y
          pos[i * 3 + 2] = scratch.obj.position.z
        }
      }
      m.instanceMatrix.needsUpdate = true
      const arr = (lineGeo.getAttribute('position') as THREE.BufferAttribute).array as Float32Array
      for (let k = 0; k < edges.length; k++) {
        arr[k * 3] = pos[edges[k] * 3]
        arr[k * 3 + 1] = pos[edges[k] * 3 + 1]
        arr[k * 3 + 2] = pos[edges[k] * 3 + 2]
      }
      ;(lineGeo.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true
    }
    // Sculptures spin on their own and also react to the scroll position.
    if (torus.current) torus.current.rotation.set(t * 0.3 + local * 2.2, t * 0.2 - local * 1.4, 0)
    if (solid.current) solid.current.rotation.set(t * 0.15 - local * 1.6, -t * 0.25 + local * 1.2, 0)
    if (lattice.current) lattice.current.rotation.set(t * 0.1 + local, t * 0.18 - local * 1.8, 0)
  })

  return (
    <group ref={group}>
      <instancedMesh ref={swarm} args={[undefined, undefined, count]} frustumCulled={false}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial roughness={0.45} metalness={0.05} flatShading />
      </instancedMesh>
      <lineSegments geometry={lineGeo} frustumCulled={false}>
        <lineBasicMaterial color={C.plum} transparent opacity={0.45} />
      </lineSegments>

      <mesh ref={torus} position={[4.8, 0.6, -3]} scale={1.5}>
        <torusGeometry args={[1, 0.38, 20, compact ? 36 : 64]} />
        <meshStandardMaterial color={C.terracotta} roughness={0.35} flatShading />
      </mesh>
      <mesh ref={solid} position={[-4.9, -1.4, -4]} scale={1.5}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial color={C.olive} roughness={0.3} wireframe />
      </mesh>
      <lineSegments ref={lattice} geometry={latticeGeo} position={[0.5, 3.4, -9]} scale={1.3}>
        <lineBasicMaterial color={C.forest} transparent opacity={0.55} />
      </lineSegments>

      <Particles count={compact ? 60 : 150} color={C.terracotta} area={[22, 11, 22]} />
    </group>
  )
}
