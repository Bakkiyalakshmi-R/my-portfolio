import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { C, scratch, seeded, useDisposable, useStation, type EnvProps } from '../shared'

const FLOOR = -3
/** The road winds toward the hall, which sits to the right so the camera flies past it, not through it. */
const roadX = (z: number) => Math.sin(z * 0.2) * 1.6 + 0.4 + Math.max(0, -z - 4) * 0.28

/**
 * Scene 03 · Knowledge. A generic college-inspired landscape (not a real campus): a winding road,
 * trees, a pillared hall with a pediment, and floating books. The camera approaches along the road.
 */
export default function CampusRoad({ compact }: EnvProps) {
  const { group, state } = useStation(2, 1.4)
  const books = useRef<Array<THREE.Group | null>>([])
  const cones = useRef<THREE.InstancedMesh>(null)
  const trunks = useRef<THREE.InstancedMesh>(null)
  const dashes = useRef<THREE.InstancedMesh>(null)
  const treeCount = compact ? 10 : 22
  const dashCount = compact ? 12 : 22

  const roadGeo = useDisposable(() => {
    const n = 48
    const verts: number[] = []
    const idx: number[] = []
    for (let k = 0; k <= n; k++) {
      const z = 13 - (k / n) * 27
      const x = roadX(z)
      const dx = (roadX(z - 0.1) - x) / 0.1
      const len = Math.hypot(dx, 1)
      const nx = 1 / len
      const nz = dx / len
      const w = 1.45 - (k / n) * 0.35
      verts.push(x - nx * w, FLOOR + 0.02, z + nz * w, x + nx * w, FLOOR + 0.02, z - nz * w)
      if (k < n) {
        const a = k * 2
        idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2)
      }
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3))
    g.setIndex(idx)
    g.computeVertexNormals()
    return g
  }, [])

  const pedimentGeo = useDisposable(() => {
    const s = new THREE.Shape()
    s.moveTo(-3.4, 0)
    s.lineTo(3.4, 0)
    s.lineTo(0, 1.25)
    s.closePath()
    return new THREE.ExtrudeGeometry(s, { depth: 0.5, bevelEnabled: false })
  }, [])

  const trees = useMemo(() => {
    const r = seeded(31)
    return Array.from({ length: treeCount }, (_, i) => {
      const z = 11 - (i / treeCount) * 22 + r() * 0.8
      const side = i % 2 ? 1 : -1
      return { x: roadX(z) + side * (3.2 + r() * 3.6), z, s: 0.8 + r() * 0.7, ph: r() * 6 }
    })
  }, [treeCount])

  useLayoutEffect(() => {
    const c = cones.current
    const tr = trunks.current
    const d = dashes.current
    if (c && tr) {
      trees.forEach((t, i) => {
        scratch.obj.position.set(t.x, FLOOR + 1.1 * t.s + 0.6 * t.s, t.z)
        scratch.obj.rotation.set(0, 0, 0)
        scratch.obj.scale.setScalar(t.s)
        scratch.obj.updateMatrix()
        c.setMatrixAt(i, scratch.obj.matrix)
        c.setColorAt(i, new THREE.Color(i % 3 === 0 ? C.olive : C.forest))
        scratch.obj.position.set(t.x, FLOOR + 0.35 * t.s, t.z)
        scratch.obj.scale.set(t.s, t.s, t.s)
        scratch.obj.updateMatrix()
        tr.setMatrixAt(i, scratch.obj.matrix)
      })
      c.instanceMatrix.needsUpdate = true
      tr.instanceMatrix.needsUpdate = true
      if (c.instanceColor) c.instanceColor.needsUpdate = true
    }
    if (d) {
      for (let i = 0; i < dashCount; i++) {
        const z = 12 - (i / dashCount) * 25
        const x = roadX(z)
        const ang = Math.atan2(roadX(z - 0.1) - x, -0.1)
        scratch.obj.position.set(x, FLOOR + 0.04, z)
        scratch.obj.rotation.set(0, ang, 0)
        scratch.obj.scale.set(0.12, 0.02, 0.7)
        scratch.obj.updateMatrix()
        d.setMatrixAt(i, scratch.obj.matrix)
      }
      d.instanceMatrix.needsUpdate = true
    }
  }, [trees, dashCount])

  useFrame((s) => {
    if (!state.current.active) return
    const t = s.clock.elapsedTime
    books.current.forEach((b, i) => {
      if (!b) return
      b.position.y = 1.2 + i * 0.7 + Math.sin(t * 0.7 + i * 2) * 0.28
      b.rotation.y = t * 0.35 + i
      b.rotation.z = Math.sin(t * 0.5 + i) * 0.2
    })
  })

  const columns = [-2.5, -1.5, -0.5, 0.5, 1.5, 2.5]
  return (
    <group ref={group}>
      {/* soft ground + road */}
      <mesh rotation-x={-Math.PI / 2} position={[0, FLOOR, -4]}>
        <circleGeometry args={[26, 40]} />
        <meshStandardMaterial color={C.sage} transparent opacity={0.4} depthWrite={false} />
      </mesh>
      <mesh geometry={roadGeo}>
        <meshStandardMaterial color={C.sand} roughness={0.9} side={THREE.DoubleSide} />
      </mesh>
      <instancedMesh ref={dashes} args={[undefined, undefined, dashCount]} frustumCulled={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color={C.cream} />
      </instancedMesh>

      {/* trees */}
      <instancedMesh ref={cones} args={[undefined, undefined, treeCount]} frustumCulled={false}>
        <coneGeometry args={[0.8, 2.2, 7]} />
        <meshStandardMaterial roughness={0.8} flatShading />
      </instancedMesh>
      <instancedMesh ref={trunks} args={[undefined, undefined, treeCount]} frustumCulled={false}>
        <cylinderGeometry args={[0.12, 0.16, 0.7, 6]} />
        <meshStandardMaterial color={C.plum} roughness={0.9} />
      </instancedMesh>

      {/* the hall at the end of the road */}
      <group position={[5.4, FLOOR, -14]} rotation={[0, -0.38, 0]}>
        <mesh position={[0, 0.12, 0]}>
          <boxGeometry args={[7.6, 0.25, 3.8]} />
          <meshStandardMaterial color={C.sand} flatShading />
        </mesh>
        <mesh position={[0, 0.37, 0.1]}>
          <boxGeometry args={[7.0, 0.25, 3.3]} />
          <meshStandardMaterial color={C.cream} flatShading />
        </mesh>
        <mesh position={[0, 1.7, -0.1]}>
          <boxGeometry args={[6.2, 2.4, 2.7]} />
          <meshStandardMaterial color="#f1e8d3" flatShading roughness={0.85} />
        </mesh>
        {columns.map((x) => (
          <mesh key={x} position={[x, 1.7, 1.55]}>
            <cylinderGeometry args={[0.2, 0.22, 2.4, 10]} />
            <meshStandardMaterial color={C.cream} roughness={0.7} />
          </mesh>
        ))}
        <mesh position={[0, 2.95, 1.35]}>
          <boxGeometry args={[6.6, 0.22, 0.9]} />
          <meshStandardMaterial color={C.cream} flatShading />
        </mesh>
        <mesh geometry={pedimentGeo} position={[0, 3.05, 0.95]}>
          <meshStandardMaterial color={C.terracotta} flatShading roughness={0.6} />
        </mesh>
        <mesh position={[0, 1.45, 1.52]}>
          <boxGeometry args={[0.95, 1.6, 0.06]} />
          <meshStandardMaterial color={C.forest} />
        </mesh>
        {[-2.2, 2.2].map((x) => (
          <mesh key={x} position={[x, 1.9, 1.5]}>
            <boxGeometry args={[0.7, 1.0, 0.05]} />
            <meshStandardMaterial color={C.sage} />
          </mesh>
        ))}
      </group>

      {/* floating books: classroom-inspired objects drifting beside the road */}
      {[-5.2, 5.4, -3.6, 4.2].map((x, i) => (
        <group key={i} ref={(el) => void (books.current[i] = el)} position={[x, 1.5, -1 - i * 2.4]}>
          <mesh>
            <boxGeometry args={[1.0, 0.16, 0.74]} />
            <meshStandardMaterial color={i % 2 ? C.terracotta : C.plum} flatShading />
          </mesh>
          <mesh position={[0.03, 0.01, 0]}>
            <boxGeometry args={[0.94, 0.13, 0.7]} />
            <meshStandardMaterial color={C.cream} />
          </mesh>
        </group>
      ))}

      {/* low sun */}
      <mesh position={[7.5, 5.2, -21]}>
        <sphereGeometry args={[2.3, 24, 16]} />
        <meshBasicMaterial color="#efd9a0" transparent opacity={0.85} fog={false} />
      </mesh>
    </group>
  )
}
