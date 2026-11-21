import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { sceneStore } from '../../animations/sceneStore'
import { stationZ } from './journey'

/** Portfolio palette, taken from the site's CSS variables. */
export const C = {
  terracotta: '#b8472e',
  olive: '#76822e',
  plum: '#542d45',
  forest: '#3c4b37',
  paper: '#f7f3e9',
  sand: '#e6dcc9',
  sage: '#dce4d6',
  cream: '#fbf8f0',
  ink: '#1f201e',
}

export type EnvProps = { compact: boolean }

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
export const smooth = (t: number) => t * t * (3 - 2 * t)

/** Small deterministic PRNG so scenes look identical on every load. */
export function seeded(seed: number) {
  let s = seed | 0
  return () => {
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** True when the object and all its ancestors are visible (used to skip per-frame work). */
export function isShown(o: THREE.Object3D | null | undefined) {
  for (let n = o; n; n = n.parent) if (!n.visible) return false
  return !!o
}

/**
 * A station is only rendered and animated while the camera is near it. `local` is the signed distance,
 * in scenes, between the camera's scene index and this station.
 */
export function useStation(index: number, range = 1.3) {
  const group = useRef<THREE.Group>(null)
  const state = useRef({ active: false, local: 0 })
  useFrame(() => {
    const g = group.current
    if (!g) return
    g.position.z = stationZ(index)
    const d = sceneStore.position - index
    const on = Math.abs(d) < range
    if (g.visible !== on) g.visible = on
    state.current.active = on
    state.current.local = d
  })
  return { group, state }
}

/** Memoised GPU resource that is released when the component unmounts. */
export function useDisposable<T extends { dispose(): void }>(factory: () => T, deps: unknown[]): T {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const obj = useMemo(factory, deps)
  useEffect(() => () => obj.dispose(), [obj])
  return obj
}

/** Reusable scratch objects so per-frame code does not allocate. */
export const scratch = {
  obj: new THREE.Object3D(),
  color: new THREE.Color(),
  v: new THREE.Vector3(),
}
