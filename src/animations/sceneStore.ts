/** Shared, non-reactive scroll state, written by GSAP/ScrollTrigger and read by the WebGL scene every frame. */
export const sceneStore = {
  /**
   * Fractional scene index (0 = hero ... 7 = contact). Scrubbed by a single GSAP tween bound to
   * the page scroll, so scrolling back plays the journey in reverse.
   */
  position: 0,
  /** Index of the section currently centred in the viewport (used by the navigation). */
  active: 0,
  /** Scene-units per second, smoothed. Drives the speed streaks and the field-of-view surge. */
  velocity: 0,
  /** World position of the camera, written by the rig each frame (read by tests and effects). */
  camera: [0, 0, 0] as [number, number, number],
}
