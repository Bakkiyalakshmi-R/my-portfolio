import { useSyncExternalStore } from 'react'

export type Capabilities = {
  reducedMotion: boolean
  webgl: boolean
  compact: boolean
}

function detectWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    return false
  }
}

let cached: Capabilities | null = null

function read(): Capabilities {
  if (!cached) {
    cached = {
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      webgl: detectWebGL(),
      compact: window.matchMedia('(max-width: 820px)').matches,
    }
  }
  return cached
}

const subscribe = () => () => undefined

/** Device / user capability flags, computed once per page load. */
export function useCapabilities(): Capabilities {
  return useSyncExternalStore(subscribe, read, () => ({
    reducedMotion: false,
    webgl: false,
    compact: false,
  }))
}
