/**
 * Seeded random numbers (mulberry32), so every 3D scene looks the same on every load.
 * Returns a function that yields floats in [0, 1).
 */
export function seeded(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Clamp to [0, 1]. */
export const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

/** Smooth 0→1 ramp of `value` across [edge0, edge1] (GLSL smoothstep). */
export function smoothstep(edge0: number, edge1: number, value: number) {
  const t = clamp01((value - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

/** Exponential ease-out: fast start, long soft settle. Matches the site's CSS easing. */
export const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

/** Cubic ease-in-out for symmetric moves. */
export const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
