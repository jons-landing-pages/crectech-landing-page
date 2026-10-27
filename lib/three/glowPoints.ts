import * as THREE from "three";

/**
 * Soft round points with a per-point colour and size, drawn additively so overlapping gas reads as
 * glow. Sizes are in world units (attenuated with distance, like real objects).
 */
const vertexShader = /* glsl */ `
  attribute float aSize;
  attribute vec3 aColor;
  attribute float aAlpha;
  uniform float uPixelRatio;
  uniform float uViewportHeight;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vColor = aColor;
    vAlpha = aAlpha;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    // Project a world-size sphere to pixels: size * (viewport height / 2) * projection[1][1] / depth.
    gl_PointSize = aSize * uViewportHeight * 0.5 * projectionMatrix[1][1] / -mvPosition.z * uPixelRatio;
  }
`;

const additiveFragment = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float r = length(gl_PointCoord - 0.5) * 2.0;
    if (r > 1.0) discard;
    // Bright core with a soft halo.
    float core = smoothstep(0.45, 0.0, r);
    float halo = pow(1.0 - r, 2.0) * 0.45;
    gl_FragColor = vec4(vColor * (core + halo), (core + halo) * vAlpha);
  }
`;

// On a light background additive light disappears, so the light variant paints solid soft dots.
const normalFragment = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float r = length(gl_PointCoord - 0.5) * 2.0;
    if (r > 1.0) discard;
    gl_FragColor = vec4(vColor, smoothstep(1.0, 0.55, r) * vAlpha);
  }
`;

export type GlowPointsMaterial = THREE.ShaderMaterial & {
  uniforms: { uPixelRatio: THREE.IUniform<number>; uViewportHeight: THREE.IUniform<number> };
};

/** `additive` for glowing gas on dark backgrounds; normal blending for dots on paper. */
export function createGlowPointsMaterial({ additive = true } = {}): GlowPointsMaterial {
  return new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader: additive ? additiveFragment : normalFragment,
    uniforms: { uPixelRatio: { value: 1 }, uViewportHeight: { value: 800 } },
    transparent: true,
    depthWrite: false,
    blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
  }) as GlowPointsMaterial;
}

/** Geometry with the attributes the glow material reads, sized for `count` points. */
export function createGlowPointsGeometry(count: number) {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(count * 3), 3));
  geometry.setAttribute("aColor", new THREE.BufferAttribute(new Float32Array(count * 3), 3));
  geometry.setAttribute("aSize", new THREE.BufferAttribute(new Float32Array(count), 1));
  geometry.setAttribute("aAlpha", new THREE.BufferAttribute(new Float32Array(count), 1));
  // Points move every frame; a generous bound stops three.js culling the whole cloud.
  geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1e4);
  return geometry;
}
