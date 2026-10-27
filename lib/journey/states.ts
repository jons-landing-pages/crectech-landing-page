import type { CameraKey } from "@/lib/three/camera";
import { HERO_PELLET } from "@/lib/journey/layout";

/**
 * The journey: one camera, one world, eight states. Scroll position maps to `at` in [0, 1000];
 * each state owns an equal band and holds its camera pose while its text is on screen.
 * Facts come from the pitch deck (page numbers in comments) and verified 2026 news.
 */

export type Theme = "light" | "dark";

export interface JourneyState {
  id: string;
  label: string;
  theme: Theme;
  /** Hold window inside the band, in `at` units: the camera rests here. */
  hold: [number, number];
  camera: Omit<CameraKey, "at">;
}

export const TIMELINE_LENGTH = 1000;

const pellet: [number, number, number] = [HERO_PELLET.position.x, HERO_PELLET.position.y, HERO_PELLET.position.z];

export const journeyStates: JourneyState[] = [
  {
    id: "overview",
    label: "Overview",
    theme: "light",
    hold: [0, 70],
    camera: { target: [8, 0, 5], orbit: [-46, 29, 84], fov: 30, shiftX: 0.2 },
  },
  {
    id: "feedstock",
    label: "Feedstock",
    theme: "light",
    hold: [160, 228],
    camera: { target: [-36, 1, 32], orbit: [-20, 27, 70], fov: 32, shiftX: 0.25 },
  },
  {
    id: "plant",
    label: "On site",
    theme: "light",
    hold: [285, 352],
    camera: { target: [18, 1.5, 5], orbit: [-30, 26, 62], fov: 32, shiftX: 0.16 },
  },
  {
    id: "reactors",
    label: "Reactors",
    theme: "dark",
    hold: [410, 477],
    camera: { target: [21.5, 1.2, 6], orbit: [-6, 15, 10], fov: 34, shiftX: 0.16 },
  },
  {
    id: "catalyst",
    label: "Catalyst",
    theme: "dark",
    hold: [535, 602],
    camera: { target: pellet, orbit: [14, 13, 0.3], fov: 34, shiftX: 0.18 },
  },
  {
    id: "reforming",
    label: "Reforming",
    theme: "dark",
    hold: [660, 727],
    camera: { target: pellet, orbit: [4, 30, 0.0095], fov: 34, shiftX: 0.16 },
  },
  {
    id: "synthesis",
    label: "Synthesis",
    theme: "dark",
    hold: [785, 852],
    camera: { target: pellet, orbit: [28, 32, 0.0095], fov: 34, shiftX: 0.16 },
  },
  {
    id: "product",
    label: "Product",
    theme: "light",
    hold: [935, 1000],
    camera: { target: [30, 1.2, 6.5], orbit: [-28, 27, 60], fov: 32, shiftX: 0.2 },
  },
];

/** Two keys per state (start and end of its hold), so the camera rests while the text is read. */
export const journeyCameraKeys: CameraKey[] = journeyStates.flatMap((state) => [
  { at: state.hold[0], ...state.camera },
  { at: state.hold[1], ...state.camera },
]);

/** Molecular keyframe index (0…7, see molecules.ts) as a function of `at`. */
export const MOLECULE_TIMELINE: [at: number, keyframe: number][] = [
  [600, 0], // reactants already in view as the camera arrives
  [672, 1], // adsorbed
  [700, 2], // dissociated
  [727, 3], // syngas formed
  [770, 4], // syngas leaves Reactor 1
  [800, 5], // syngas on Reactor 2 catalyst
  [840, 6], // methanol formed
  [880, 7], // methanol leaves
];
