import * as THREE from "three";

/**
 * World layout for the journey scene, in metres (y up). The plant follows the pilot render in the
 * pitch deck (p11): pre-treatment unit, containerised reactor unit and methanol storage, beside a
 * covered POME lagoon at the Sei Mangkei biogas power plant.
 */

export const OPEN_LAGOON = { centre: new THREE.Vector3(-36, 0, 34), width: 40, depth: 22 };
export const COVERED_LAGOON = { centre: new THREE.Vector3(-34, 0, 0), width: 42, depth: 28, domeHeight: 3.2 };

export const PRETREATMENT = { x0: 0, x1: 12, z0: 2.5, z1: 9.5 };
/** A 40 ft container: 12.19 × 2.59 × 2.44 m. */
export const CONTAINER = { centre: new THREE.Vector3(22.2, 1.5, 6), length: 12.19, height: 2.59, width: 2.44 };
export const STORAGE = { x0: 31.5, x1: 39.5, z0: 3.5, z1: 8.5 };

/** Slab under every unit, 20 cm high. */
export const SLAB_HEIGHT = 0.2;

/** Reactor 1 (biogas reforming, CRecREF™) and Reactor 2 (methanol synthesis) inside the container. */
export const REACTOR_1 = { centre: new THREE.Vector3(19.4, 0, 6.15), radius: 0.36, height: 2.0 };
export const REACTOR_2 = { centre: new THREE.Vector3(23.6, 0, 6.15), radius: 0.3, height: 1.85 };

/** Catalyst pellets in the reactors are drawn larger than life so they read at this scale. */
export const PELLET_WORLD_RADIUS = 0.045;

/** The one pellet the camera flies into. It sits on the cut plane of the Reactor 1 cut-away. */
export const HERO_PELLET = {
  position: new THREE.Vector3(REACTOR_1.centre.x + 0.02, 1.15, REACTOR_1.centre.z + 0.04),
  /** Pellet axis direction (local +z maps to this). Tilted towards the camera so the channels show. */
  axis: new THREE.Vector3(0.25, 0.2, 1).normalize(),
};

/**
 * The molecular stage sits inside the hero pellet's centre channel. One stage unit is one ångström
 * on screen; the stage is scaled so its width fits inside the channel.
 */
export const MOLECULE_STAGE_SCALE = 2.5e-4;

/** The gold biogas line from the covered lagoon through every unit to storage. */
export const PIPE_PATH = [
  new THREE.Vector3(-12.5, 0.45, 0),
  new THREE.Vector3(-7, 0.45, 0.5),
  new THREE.Vector3(-3.5, 0.45, 10.5),
  new THREE.Vector3(2, 0.45, 10.5),
  new THREE.Vector3(12, 0.45, 10.5),
  new THREE.Vector3(18, 0.45, 9.2),
  new THREE.Vector3(26, 0.45, 9.2),
  new THREE.Vector3(31, 0.45, 9.6),
  new THREE.Vector3(36, 0.45, 9.6),
];

/** Fraction along the pipe where gas enters the reactor container (colour turns to methanol). */
export const PIPE_REACTOR_AT = 0.68;
