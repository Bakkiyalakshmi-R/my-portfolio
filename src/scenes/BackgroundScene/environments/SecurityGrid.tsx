import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { C, scratch, seeded, useDisposable, useStation, type EnvProps } from '../shared'

/**
 * Scene 05 · Experience. A cybersecurity operations space: a connected network of nodes with packets
 * travelling the links, a shield with expanding scan pulses, and a radar sweep across the floor.
 */
export default function SecurityGrid({ compact }: EnvProps) {
  const { group, state } = useStation(4)
  const nodes = useRef<THREE.InstancedMesh>(null)
  const shield = useRef<THREE.Group>(null)
  const pulses = useRef<Array<THREE.Mesh | null>>([])
  const sweep = useRef<THREE.Mesh>(null)
  const nodeCount = compact ? 10 : 16
  const packetCount = compact ? 14 : 30

  const nodePos = useMemo(() => {
    const r = seeded(53)
    return Array.from({ length: nodeCount }, (_, i) => {
      const side = i % 2 ? 1 : -1
      return new THREE.Vector3(side * (2.8 + r() * 4.6), (r() - 0.5) * 7, 3 - r() * 17)
    })
  }, [nodeCount])

  const edges = useMemo(() => {
    const seen = new Set<string>()
    const out: Array<[number, number]> = []
    nodePos.forEach((a, i) => {
      nodePos
        .map((b, j) => ({ j, d: i === j ? Infinity : a.distanceTo(b) }))
        .sort((p, q) => p.d - q.d)
        .slice(0, 2)
        .forEach(({ j }) => {
          const k = i < j ? `${i}-${j}` : `${j}-${i}`
          if (!seen.has(k)) {
            seen.add(k)
            out.push([i, j])
          }
        })
    })
    return out
  }, [nodePos])

  const edgeGeo = useDisposable(() => {
    const v: number[] = []
    edges.forEach(([a, b]) => v.push(nodePos[a].x, nodePos[a].y, nodePos[a].z, nodePos[b].x, nodePos[b].y, nodePos[b].z))
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(v, 3))
    return g
  }, [edges, nodePos])
  const packetGeo = useDisposable(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(packetCount * 3), 3))
    return g
  }, [packetCount])
  const packetData = useMemo(
    () => Array.from({ length: packetCount }, (_, i) => ({ e: i % edges.length, off: (i * 0.37) % 1, sp: 0.18 + (i % 5) * 0.05 })),
    [packetCount, edges.length],
  )

  const shieldGeo = useDisposable(() => {
    const s = new THREE.Shape()
    s.moveTo(0, 1.7)
    s.lineTo(1.4, 1.2)
    s.quadraticCurveTo(1.5, -0.8, 0, -1.8)
    s.quadraticCurveTo(-1.5, -0.8, -1.4, 1.2)
    s.closePath()
    return new THREE.ExtrudeGeometry(s, { depth: 0.35, bevelEnabled: true, bevelSize: 0.07, bevelThickness: 0.07, bevelSegments: 2 })
  }, [])

  useLayoutEffect(() => {
    const m = nodes.current
    if (!m) return
    nodePos.forEach((_, i) => m.setColorAt(i, new THREE.Color(i % 5 === 0 ? C.terracotta : i % 2 ? C.forest : C.plum)))
    if (m.instanceColor) m.instanceColor.needsUpdate = true
  }, [nodePos])

  useFrame((s) => {
    if (!state.current.active) return
    const t = s.clock.elapsedTime
    const local = state.current.local
    const m = nodes.current
    if (m) {
      for (let i = 0; i < nodeCount; i++) {
        // nodes pulse in sequence, as if a scan were passing through the network
        const pulse = Math.max(0, Math.sin(t * 2.2 - i * 0.9))
        scratch.obj.position.copy(nodePos[i])
        scratch.obj.rotation.set(0, 0, 0)
        scratch.obj.scale.setScalar(0.22 + pulse * 0.22 + (i % 5 === 0 ? 0.08 : 0))
        scratch.obj.updateMatrix()
        m.setMatrixAt(i, scratch.obj.matrix)
      }
      m.instanceMatrix.needsUpdate = true
    }
    const arr = (packetGeo.getAttribute('position') as THREE.BufferAttribute).array as Float32Array
    for (let i = 0; i < packetCount; i++) {
      const p = packetData[i]
      const [a, b] = edges[p.e]
      const u = (t * p.sp + p.off) % 1
      arr[i * 3] = nodePos[a].x + (nodePos[b].x - nodePos[a].x) * u
      arr[i * 3 + 1] = nodePos[a].y + (nodePos[b].y - nodePos[a].y) * u
      arr[i * 3 + 2] = nodePos[a].z + (nodePos[b].z - nodePos[a].z) * u
    }
    ;(packetGeo.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true

    if (shield.current) {
      shield.current.rotation.y = Math.sin(t * 0.5) * 0.55 + local * 0.9
      shield.current.position.y = 0.4 + Math.sin(t * 0.8) * 0.18
    }
    pulses.current.forEach((p, k) => {
      if (!p) return
      const ph = (t * 0.32 + k * 0.5) % 1
      p.scale.setScalar(1.1 + ph * 5.5)
      ;(p.material as THREE.MeshBasicMaterial).opacity = (1 - ph) * 0.55
    })
    if (sweep.current) sweep.current.rotation.z = -t * 1.1
  })

  return (
    <group ref={group}>
      <instancedMesh ref={nodes} args={[undefined, undefined, nodeCount]} frustumCulled={false}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial roughness={0.4} flatShading />
      </instancedMesh>
      <lineSegments geometry={edgeGeo} frustumCulled={false}>
        <lineBasicMaterial color={C.plum} transparent opacity={0.4} />
      </lineSegments>
      <points geometry={packetGeo} frustumCulled={false}>
        <pointsMaterial color={C.terracotta} size={0.2} sizeAttenuation transparent opacity={0.95} depthWrite={false} />
      </points>

      {/* shield with scan pulses */}
      <group position={[-5.0, 0.4, -4]}>
        <group ref={shield} scale={1.15}>
          <mesh geometry={shieldGeo} position={[0, 0, -0.17]}>
            <meshStandardMaterial color={C.terracotta} roughness={0.4} flatShading />
          </mesh>
          <mesh position={[0, 0.35, 0.3]}>
            <cylinderGeometry args={[0.36, 0.36, 0.1, 20]} />
            <meshStandardMaterial color={C.cream} />
          </mesh>
          <mesh position={[0, -0.18, 0.3]}>
            <boxGeometry args={[0.18, 0.7, 0.1]} />
            <meshStandardMaterial color={C.cream} />
          </mesh>
        </group>
        {[0, 1].map((k) => (
          <mesh key={k} ref={(el) => void (pulses.current[k] = el)} rotation={[Math.PI / 2.4, 0, 0]}>
            <torusGeometry args={[1, 0.02, 8, 64]} />
            <meshBasicMaterial color={C.terracotta} transparent opacity={0.5} depthWrite={false} />
          </mesh>
        ))}
      </group>

      {/* radar on the floor */}
      <group position={[3.6, -3.3, -5]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh ref={sweep}>
          <ringGeometry args={[0.1, 6.2, 40, 1, 0, 0.9]} />
          <meshBasicMaterial color={C.terracotta} transparent opacity={0.28} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
        {[2, 4, 6].map((r) => (
          <mesh key={r}>
            <ringGeometry args={[r - 0.03, r, 64]} />
            <meshBasicMaterial color={C.plum} transparent opacity={0.3} side={THREE.DoubleSide} depthWrite={false} />
          </mesh>
        ))}
      </group>
    </group>
  )
}
