import * as THREE from "three";

/** Site colour tokens as three.js colours (sRGB hex, converted to linear by THREE.Color). */
export const palette = {
  carbon: new THREE.Color("#0a0f0c"),
  carbon2: new THREE.Color("#111813"),
  paper: new THREE.Color("#f3f1ea"),
  ink: new THREE.Color("#121a14"),
  green: new THREE.Color("#3fd47a"),
  brandGreen: new THREE.Color("#1a9645"),
  gold: new THREE.Color("#d9a92c"),
  goldLight: new THREE.Color("#f2cf6b"),
  ceramic: new THREE.Color("#c9cec8"),
  steam: new THREE.Color("#9fd3e6"),
};

/**
 * Atom colours. Brand-mapped instead of CPK so the molecules sit in the site palette:
 * hydrogen near-white, carbon graphite, oxygen gold.
 */
export const atomStyle = {
  H: { color: "#eef3ec", radius: 0.32 },
  C: { color: "#3a423c", radius: 0.5 },
  O: { color: "#d9a92c", radius: 0.48 },
} as const;

export type Element = keyof typeof atomStyle;
