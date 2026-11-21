import * as THREE from 'three'

/**
 * The journey: eight stations spaced along -Z. The camera flies a curved path that passes through a
 * "gate" ring between every pair of stations, so each environment is approached, passed and left behind.
 * Scene index `position` maps onto the curves, so scroll progress is the camera's position on the path.
 */
export const SCENE_COUNT = 8
export const GAP = 30

/** Z coordinate of a station's centre. */
export const stationZ = (i: number) => -GAP * i

/** Camera (x, y) at each station; the camera always rests 10 units in front of the station centre. */
const CAM: Array<[number, number]> = [
  [0, 0.3],
  [-0.6, 0.2],
  [0, 1.4],
  [0.8, 0],
  [0, 0.6],
  [0, 0.8],
  [1.2, 0.4],
  [0, 0],
]
/** Where the camera looks at each station: (x, y, z-offset from the station centre). */
const LOOK: Array<[number, number, number]> = [
  [0, 0, -6],
  [0.4, 0, -8],
  [1, -0.8, -10],
  [-0.5, 0, -8],
  [0, -0.2, -8],
  [0, 0, -8],
  [-1, -0.4, -8],
  [0, 0, -6],
]

/** Base field of view, per station. Gates add a widening surge on top. */
export const FOV = [45, 40, 44, 52, 42, 38, 44, 36]
/** Resting roll (radians) per station, giving each scene a slightly different framing. */
export const ROLL = [0, -0.035, 0.045, -0.045, 0.05, -0.025, 0.04, 0]

/** Point halfway between station i and i+1, where the camera passes through the gate ring. */
export function gatePoint(i: number, out = new THREE.Vector3()) {
  const a = CAM[i]
  const b = CAM[i + 1]
  const weave = (i % 2 ? 1 : -1) * 1.4
  return out.set((a[0] + b[0]) / 2 + weave, (a[1] + b[1]) / 2 + (i % 3 === 0 ? 0.6 : -0.3), stationZ(i) - 5)
}

const camPoints: THREE.Vector3[] = []
const lookPoints: THREE.Vector3[] = []
for (let i = 0; i < SCENE_COUNT; i++) {
  camPoints.push(new THREE.Vector3(CAM[i][0], CAM[i][1], stationZ(i) + 10))
  lookPoints.push(new THREE.Vector3(LOOK[i][0], LOOK[i][1], stationZ(i) + LOOK[i][2]))
  if (i < SCENE_COUNT - 1) {
    const g = gatePoint(i)
    camPoints.push(g)
    lookPoints.push(
      new THREE.Vector3((LOOK[i][0] + LOOK[i + 1][0]) / 2, (LOOK[i][1] + LOOK[i + 1][1]) / 2, g.z - 12),
    )
  }
}

const camCurve = new THREE.CatmullRomCurve3(camPoints, false, 'centripetal')
const lookCurve = new THREE.CatmullRomCurve3(lookPoints, false, 'centripetal')

/** Sample the camera position and look target for a fractional scene index. */
export function sampleJourney(position: number, cam: THREE.Vector3, look: THREE.Vector3) {
  const t = THREE.MathUtils.clamp(position / (SCENE_COUNT - 1), 0, 1)
  camCurve.getPoint(t, cam)
  lookCurve.getPoint(t, look)
}

/** Interpolate a per-station scalar table at a fractional scene index. */
export function lerpTable(table: number[], position: number) {
  const p = THREE.MathUtils.clamp(position, 0, table.length - 1)
  const i = Math.min(table.length - 2, Math.floor(p))
  const t = p - i
  const s = t * t * (3 - 2 * t)
  return table[i] + (table[i + 1] - table[i]) * s
}
