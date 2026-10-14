import * as THREE from "three";

/**
 * Camera keys on a scroll timeline. The camera aims at `target` and sits on an orbit around it:
 * `orbit` is [azimuth°, elevation°, distance]. Azimuth 0 puts the camera on the +z side looking
 * towards −z; positive azimuth swings it towards +x.
 *
 * Adapted from the MarinaChain product films (look3d/camera.ts): each channel is a cubic Hermite
 * curve with monotone tangents, so the camera never overshoots a key, and distance is interpolated
 * in log space, so a zoom from metres to millimetres feels even.
 */
export interface CameraKey {
  at: number;
  target: [number, number, number];
  orbit: [number, number, number];
  fov: number;
  /**
   * Lens shift as a fraction of the frame: positive shiftX moves the picture right, positive
   * shiftY moves it down, without changing perspective (leaves room for text beside the subject).
   */
  shiftX?: number;
  shiftY?: number;
}

export interface CameraPose {
  position: THREE.Vector3;
  target: THREE.Vector3;
  fov: number;
  distance: number;
  shiftX: number;
  shiftY: number;
}

export function orbitPosition(
  target: THREE.Vector3,
  [azimuth, elevation, distance]: readonly [number, number, number],
  out = new THREE.Vector3(),
): THREE.Vector3 {
  const az = THREE.MathUtils.degToRad(azimuth);
  const el = THREE.MathUtils.degToRad(elevation);
  return out.set(
    target.x + distance * Math.cos(el) * Math.sin(az),
    target.y + distance * Math.sin(el),
    target.z + distance * Math.cos(el) * Math.cos(az),
  );
}

function hermite(p0: number, p1: number, m0: number, m1: number, t: number, dt: number) {
  const t2 = t * t;
  const t3 = t2 * t;
  return (2 * t3 - 3 * t2 + 1) * p0 + (t3 - 2 * t2 + t) * m0 * dt + (-2 * t3 + 3 * t2) * p1 + (t3 - t2) * m1 * dt;
}

const channelsOf = (key: CameraKey) => [
  ...key.target,
  key.orbit[0],
  key.orbit[1],
  Math.log(key.orbit[2]),
  key.fov,
  key.shiftX ?? 0,
  key.shiftY ?? 0,
];

/** The camera pose at `at` (same units as the keys). The first and last keys hold still. */
export function cameraAt(keys: readonly CameraKey[], at: number): CameraPose {
  const last = keys.length - 1;
  const values = keys.map(channelsOf);

  let i = 0;
  if (at >= keys[last].at) i = last - 1;
  else while (i < last - 1 && keys[i + 1].at < at) i += 1;

  const dt = keys[i + 1].at - keys[i].at;
  const t = THREE.MathUtils.clamp((at - keys[i].at) / dt, 0, 1);

  // Fritsch–Carlson monotone tangent: zero at extremes, so no overshoot.
  const tangent = (index: number, channel: number) => {
    if (index <= 0 || index >= last) return 0;
    const before = keys[index].at - keys[index - 1].at;
    const after = keys[index + 1].at - keys[index].at;
    const slopeBefore = (values[index][channel] - values[index - 1][channel]) / before;
    const slopeAfter = (values[index + 1][channel] - values[index][channel]) / after;
    if (slopeBefore * slopeAfter <= 0) return 0;
    const w1 = 2 * after + before;
    const w2 = after + 2 * before;
    return (w1 + w2) / (w1 / slopeBefore + w2 / slopeAfter);
  };

  const c = values[0].map((_, ch) =>
    hermite(values[i][ch], values[i + 1][ch], tangent(i, ch), tangent(i + 1, ch), t, dt),
  );
  const target = new THREE.Vector3(c[0], c[1], c[2]);
  const distance = Math.exp(c[5]);
  return {
    target,
    position: orbitPosition(target, [c[3], c[4], distance]),
    fov: c[6],
    distance,
    shiftX: c[7],
    shiftY: c[8],
  };
}

/** Apply a lens shift (fractions of the frame) to a camera; zero shift clears the offset. */
export function applyLensShift(camera: THREE.PerspectiveCamera, shiftX: number, shiftY: number, width: number, height: number) {
  if (Math.abs(shiftX) < 1e-4 && Math.abs(shiftY) < 1e-4) camera.clearViewOffset();
  else camera.setViewOffset(width, height, -shiftX * width, -shiftY * height, width, height);
}
