import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { C, scratch, seeded, useDisposable, useStation, type EnvProps } from '../shared'

const LAYERS = [4, 5, 3]

/**
 * Scene 04 · Technology. A computational corridor: lattices of cubes pulsing in a travelling wave,
 * data packets streaming down guide lines, angle-bracket glyphs, and a small neural network.
 */
export default function TechTunnel({ compact }: EnvProps) {
  const { group, state } = useStation(3)
  const cubes = useRef<THREE.InstancedMesh>(null)
  const nodes = useRef<THREE.InstancedMesh>(null)
  const net = useRef<THREE.Group>(null)
  const glyphs = useRef<Array<THREE.Group | null>>([])
  const packets = useRef<THREE.Points>(null)

  const cubeCount = compact ? 38 : 88
  const packetCount = compact ? 40 : 110
  const streamCount = 8

  const cubeData = useMemo(() => {
    const r = seeded(41)
    return Array.from({ length: cubeCount }, (_, i) => {
      const side = i % 2 ? 1 : -1
      return {
        x: side * (3.4 + r() * 3.8),
        y: (r() - 0.5) * 8.5,
        z: 5 - r() * 21,
        s: 0.28 + r() * 0.34,
        hot: r() < 0.14,
      }
    })
  }, [cubeCount])

  const streams = useMemo(() => {
    const r = seeded(43)
    return Array.from({ length: streamCount }, (_, i) => ({
      x: (i % 2 ? 1 : -1) * (2.2 + r() * 2.6),
      y: (r() - 0.5) * 6,
    }))
  }, [])
  const packetData = useMemo(() => {
    const r = seeded(47)
    return Array.from({ length: packetCount }, (_, i) => ({ stream: i % streamCount, off: r() * 22, sp: 2.2 + r() * 2.5 }))
  }, [packetCount])

  const streamGeo = useDisposable(() => {
    const v: number[] = []
    streams.forEach((s) => v.push(s.x, s.y, 6, s.x, s.y, -17))
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(v, 3))
    return g
  }, [streams])
  const packetGeo = useDisposable(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(packetCount * 3), 3))
    return g
  }, [packetCount])

  // Neural network: node positions (x spread across layers, y spread within a layer) and the edges between them.
  const netNodes = useMemo(() => {
    const out: THREE.Vector3[] = []
    LAYERS.forEach((n, li) => {
      for (let k = 0; k < n; k++) out.push(new THREE.Vector3((li - 1) * 1.7, (k - (n - 1) / 2) * 0.95, 0))
    })
    return out
  }, [])
  const netGeo = useDisposable(() => {
    const v: number[] = []
    let start = 0
    for (let li = 0; li < LAYERS.length - 1; li++) {
      const next = start + LAYERS[li]
      for (let a = 0; a < LAYERS[li]; a++)
        for (let b = 0; b < LAYERS[li + 1]; b++) {
          const A = netNodes[start + a]
          const B = netNodes[next + b]
          v.push(A.x, A.y, A.z, B.x, B.y, B.z)
        }
      start = next
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(v, 3))
    return g
  }, [netNodes])

  useLayoutEffect(() => {
    const m = cubes.current
    if (m) {
      cubeData.forEach((c, i) => m.setColorAt(i, new THREE.Color(c.hot ? C.terracotta : i % 3 ? C.forest : C.olive)))
      if (m.instanceColor) m.instanceColor.needsUpdate = true
    }
    const n = nodes.current
    if (n) {
      netNodes.forEach((p, i) => {
        scratch.obj.position.copy(p)
        scratch.obj.rotation.set(0, 0, 0)
        scratch.obj.scale.setScalar(0.2)
        scratch.obj.updateMatrix()
        n.setMatrixAt(i, scratch.obj.matrix)
        n.setColorAt(i, new THREE.Color(i % 4 === 0 ? C.terracotta : C.olive))
      })
      n.instanceMatrix.needsUpdate = true
      if (n.instanceColor) n.instanceColor.needsUpdate = true
    }
  }, [cubeData, netNodes])

  useFrame((s) => {
    if (!state.current.active) return
    const t = s.clock.elapsedTime
    const local = state.current.local
    const m = cubes.current
    if (m) {
      for (let i = 0; i < cubeCount; i++) {
        const c = cubeData[i]
        // wave travels down the corridor; scroll position shifts its phase so it reacts to the camera
        const w = 0.55 + 0.45 * Math.sin(t * 1.7 - c.z * 0.55 + local * 3)
        scratch.obj.position.set(c.x, c.y, c.z)
        scratch.obj.rotation.set(t * 0.2 + i, t * 0.3, 0)
        scratch.obj.scale.setScalar(c.s * (0.6 + w * 0.8))
        scratch.obj.updateMatrix()
        m.setMatrixAt(i, scratch.obj.matrix)
      }
      m.instanceMatrix.needsUpdate = true
    }
    const arr = (packetGeo.getAttribute('position') as THREE.BufferAttribute).array as Float32Array
    for (let i = 0; i < packetCount; i++) {
      const p = packetData[i]
      const st = streams[p.stream]
      arr[i * 3] = st.x
      arr[i * 3 + 1] = st.y
      arr[i * 3 + 2] = 6 - ((t * p.sp + p.off) % 23)
    }
    ;(packetGeo.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true
    if (net.current) {
      net.current.rotation.y = Math.sin(t * 0.35) * 0.45 + local * 0.6
      net.current.position.y = 0.6 + Math.sin(t * 0.5) * 0.2
    }
    glyphs.current.forEach((g, i) => {
      if (!g) return
      g.rotation.y = t * 0.4 + i * 1.6
      g.position.y = (i ? -1.6 : 2.6) + Math.sin(t * 0.6 + i) * 0.3
    })
  })

  const bracket = (dir: 1 | -1) => (
    <>
      <mesh position={[0.28 * dir, 0.42, 0]} rotation={[0, 0, dir * 0.72]}>
        <boxGeometry args={[0.2, 1.1, 0.2]} />
        <meshStandardMaterial color={C.terracotta} flatShading />
      </mesh>
      <mesh position={[0.28 * dir, -0.42, 0]} rotation={[0, 0, -dir * 0.72]}>
        <boxGeometry args={[0.2, 1.1, 0.2]} />
        <meshStandardMaterial color={C.terracotta} flatShading />
      </mesh>
    </>
  )

  return (
    <group ref={group}>
      <instancedMesh ref={cubes} args={[undefined, undefined, cubeCount]} frustumCulled={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial roughness={0.5} flatShading />
      </instancedMesh>

      <lineSegments geometry={streamGeo} frustumCulled={false}>
        <lineBasicMaterial color={C.forest} transparent opacity={0.3} />
      </lineSegments>
      <points ref={packets} geometry={packetGeo} frustumCulled={false}>
        <pointsMaterial color={C.terracotta} size={0.16} sizeAttenuation transparent opacity={0.95} depthWrite={false} />
      </points>

      {/* neural network */}
      <group ref={net} position={[5.0, 0.6, -3]} scale={1.15}>
        <lineSegments geometry={netGeo}>
          <lineBasicMaterial color={C.forest} transparent opacity={0.5} />
        </lineSegments>
        <instancedMesh ref={nodes} args={[undefined, undefined, netNodes.length]} frustumCulled={false}>
          <icosahedronGeometry args={[1, 1]} />
          <meshStandardMaterial roughness={0.4} flatShading />
        </instancedMesh>
      </group>

      {/* "< >" glyphs */}
      <group ref={(el) => void (glyphs.current[0] = el)} position={[-5.4, 2.6, -2]} scale={1.2}>
        <group position={[-0.6, 0, 0]}>{bracket(-1)}</group>
        <group position={[0.6, 0, 0]}>{bracket(1)}</group>
      </group>
      <group ref={(el) => void (glyphs.current[1] = el)} position={[-4.9, -1.6, -8]} scale={1.1}>
        <mesh rotation={[0, 0, 0.35]}>
          <boxGeometry args={[0.2, 2.0, 0.2]} />
          <meshStandardMaterial color={C.plum} flatShading />
        </mesh>
        <mesh position={[0.9, 0, 0]} rotation={[0, 0, 0.35]}>
          <boxGeometry args={[0.2, 2.0, 0.2]} />
          <meshStandardMaterial color={C.olive} flatShading />
        </mesh>
      </group>
    </group>
  )
}
