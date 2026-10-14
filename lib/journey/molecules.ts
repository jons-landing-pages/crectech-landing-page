import * as THREE from "three";
import type { Element } from "@/lib/three/palette";
import { seeded } from "@/lib/three/random";

/**
 * The molecular sequence of the journey. The same 24 atoms appear in every keyframe:
 *
 *   Reactor 1, biogas reforming:  3 CH₄ + CO₂ + 2 H₂O → 4 CO + 8 H₂   (H₂ : CO = 2 : 1)
 *   Reactor 2, methanol synthesis:          4 CO + 8 H₂ → 4 CH₃OH
 *
 * Both equations balance: 4 C, 4 O and 16 H on every side. The ratio and the two steps come from
 * the pitch deck (p5); the overall reforming balance is the textbook combined steam and dry
 * reforming of methane, which gives exactly that 2 : 1 syngas.
 *
 * Coordinates are in ångström-like stage units; the catalyst surface is the plane y = 0.
 */

export interface Atom {
  element: Element;
}

/** Positions of every atom at each keyframe K0…K7. */
export type Frame = THREE.Vector3[];

export interface MoleculeSequence {
  atoms: Atom[];
  frames: Frame[];
  /** Bonds as atom-index pairs, grouped by the stage in which they exist. */
  bonds: { reactants: [number, number][]; syngas: [number, number][]; methanol: [number, number][] };
  /** Positions of the active sites on the catalyst surface. */
  sites: THREE.Vector3[];
}

/** Keyframe names, in order. Scroll maps onto this index (0…7). */
export const KEYFRAMES = [
  "approach", // K0 reactants arrive from the gas phase
  "adsorbed", // K1 reactants sit on active sites
  "dissociated", // K2 bonds broken, atoms spread on the surface
  "syngas-formed", // K3 CO and H₂ formed on the surface
  "syngas-leaves", // K4 syngas leaves Reactor 1
  "syngas-arrives", // K5 syngas sits on the Reactor 2 catalyst
  "methanol-formed", // K6 CH₃OH formed on the surface
  "methanol-leaves", // K7 methanol leaves
] as const;

const BOND_SCALE = 1.25;

// Molecule templates (relative coordinates, Å, scaled for legibility).
const tetra = [
  [1, 1, 1],
  [1, -1, -1],
  [-1, 1, -1],
  [-1, -1, 1],
].map(([x, y, z]) => new THREE.Vector3(x, y, z).normalize().multiplyScalar(1.09 * BOND_SCALE));

const methanolTemplate = {
  C: new THREE.Vector3(0, 0, 0),
  O: new THREE.Vector3(0, 1.43, 0).multiplyScalar(BOND_SCALE),
  HC: [
    new THREE.Vector3(1.0, -0.36, 0),
    new THREE.Vector3(-0.5, -0.36, 0.87),
    new THREE.Vector3(-0.5, -0.36, -0.87),
  ].map((v) => v.normalize().multiplyScalar(1.09 * BOND_SCALE)),
  HO: new THREE.Vector3(0.9, 1.75, 0).multiplyScalar(BOND_SCALE),
};

/** Rotate template offsets by a seeded orientation and place them at `centre`. */
function place(centre: THREE.Vector3, offsets: THREE.Vector3[], rotation: THREE.Euler) {
  const quaternion = new THREE.Quaternion().setFromEuler(rotation);
  return offsets.map((offset) => offset.clone().applyQuaternion(quaternion).add(centre));
}

export function buildMoleculeSequence(): MoleculeSequence {
  const random = seeded(2023146478);
  const randomEuler = () => new THREE.Euler(random() * Math.PI * 2, random() * Math.PI * 2, random() * Math.PI * 2);
  const jitter = (amount: number) => (random() - 0.5) * amount;

  // ---- Atoms: 4 C, 4 O, 16 H. Index ranges keep the bookkeeping readable. ----
  const C = [0, 1, 2, 3];
  const O = [4, 5, 6, 7];
  const H = Array.from({ length: 16 }, (_, i) => 8 + i);
  const atoms: Atom[] = [
    ...C.map(() => ({ element: "C" as const })),
    ...O.map(() => ({ element: "O" as const })),
    ...H.map(() => ({ element: "H" as const })),
  ];

  // Reactant membership:
  //   CH₄ ×3:  C0 + H0–3,  C1 + H4–7,  C2 + H8–11
  //   CO₂:     C3 + O0 + O1
  //   H₂O ×2:  O2 + H12–13,  O3 + H14–15
  const methane = [0, 1, 2].map((k) => ({ c: C[k], h: H.slice(k * 4, k * 4 + 4) }));
  const carbonDioxide = { c: C[3], o: [O[0], O[1]] };
  const water = [0, 1].map((k) => ({ o: O[2 + k], h: [H[12 + k * 2], H[13 + k * 2]] }));

  // Syngas membership: CO_k = C_k + O_k; H₂ pairs = (H0,H1), (H2,H3), …
  const carbonMonoxide = [0, 1, 2, 3].map((k) => ({ c: C[k], o: O[k] }));
  const hydrogen = Array.from({ length: 8 }, (_, k) => [H[k * 2], H[k * 2 + 1]] as const);

  // Methanol membership: CH₃OH_k = C_k + O_k + three H on C + one H on O (from two H₂ molecules).
  const methanol = [0, 1, 2, 3].map((k) => ({
    c: C[k],
    o: O[k],
    hc: [H[k * 4], H[k * 4 + 1], H[k * 4 + 2]],
    ho: H[k * 4 + 3],
  }));

  // ---- Catalyst surface: hexagonal grid of support atoms with active sites. ----
  const sites: THREE.Vector3[] = [];
  for (let row = -2; row <= 2; row += 1) {
    for (let col = -4; col <= 4; col += 1) {
      if ((row + col) % 2 !== 0) continue;
      sites.push(new THREE.Vector3(col * 2.4, 0, row * 2.2));
    }
  }

  const frames: Frame[] = Array.from({ length: KEYFRAMES.length }, () => atoms.map(() => new THREE.Vector3()));
  const setMolecule = (frame: number, indices: number[], positions: THREE.Vector3[]) =>
    indices.forEach((atomIndex, i) => frames[frame][atomIndex].copy(positions[i]));

  // Reactant centres: gas phase (upper left) and adsorbed (on sites near the middle).
  const reactantGas = [
    new THREE.Vector3(-13, 7.5, -2),
    new THREE.Vector3(-10.5, 9.5, 2.5),
    new THREE.Vector3(-15, 10, 1),
    new THREE.Vector3(-8.5, 6.5, -3.5),
    new THREE.Vector3(-12, 5.5, 3.5),
    new THREE.Vector3(-16, 6, -3),
  ];
  const reactantSurface = [sites[5], sites[7], sites[11], sites[13], sites[17], sites[19]].map((site) =>
    site.clone().add(new THREE.Vector3(0, 1.6, 0)),
  );

  const placeReactants = (frame: number, centres: THREE.Vector3[]) => {
    methane.forEach((m, k) => {
      const rotation = randomEuler();
      setMolecule(frame, [m.c, ...m.h], place(centres[k], [new THREE.Vector3(), ...tetra], rotation));
    });
    const co2Rotation = new THREE.Euler(0, random() * Math.PI, 0);
    setMolecule(
      frame,
      [carbonDioxide.c, ...carbonDioxide.o],
      place(
        centres[3],
        [new THREE.Vector3(), new THREE.Vector3(1.16 * BOND_SCALE, 0, 0), new THREE.Vector3(-1.16 * BOND_SCALE, 0, 0)],
        co2Rotation,
      ),
    );
    water.forEach((w, k) => {
      const rotation = randomEuler();
      setMolecule(
        frame,
        [w.o, ...w.h],
        place(
          centres[4 + k],
          [
            new THREE.Vector3(),
            new THREE.Vector3(0.76, 0.59, 0).multiplyScalar(BOND_SCALE),
            new THREE.Vector3(-0.76, 0.59, 0).multiplyScalar(BOND_SCALE),
          ],
          rotation,
        ),
      );
    });
  };
  placeReactants(0, reactantGas);
  placeReactants(1, reactantSurface);

  // K2: dissociated. C and O on active sites, H spread between them, all just above the surface.
  const heavy = [...C, ...O];
  heavy.forEach((atomIndex, i) => {
    const site = sites[(i * 3 + 2) % sites.length];
    frames[2][atomIndex].copy(site).add(new THREE.Vector3(jitter(0.4), 0.95, jitter(0.4)));
  });
  H.forEach((atomIndex) => {
    frames[2][atomIndex].set(jitter(18), 0.75, jitter(9));
  });

  // Syngas positions on the surface (K3) and leaving (K4), then arriving on Reactor 2 (K5).
  const syngasOnSurface = (frame: number, xShift: number, height: number) => {
    carbonMonoxide.forEach((co, k) => {
      const base = new THREE.Vector3(-6 + k * 4 + xShift, height, (k % 2 ? 1.5 : -1.5));
      frames[frame][co.c].copy(base);
      frames[frame][co.o].copy(base).add(new THREE.Vector3(0, 1.13 * BOND_SCALE, 0));
    });
    hydrogen.forEach(([a, b], k) => {
      const centre = new THREE.Vector3(-7 + (k % 4) * 4.2 + xShift, height + 0.15, k < 4 ? 3.8 : -3.8).add(
        new THREE.Vector3(jitter(0.6), 0, jitter(0.6)),
      );
      const half = new THREE.Vector3(0.37 * BOND_SCALE, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), random() * Math.PI);
      frames[frame][a].copy(centre).add(half);
      frames[frame][b].copy(centre).sub(half);
    });
  };
  syngasOnSurface(3, 0, 1.0);

  // K4: syngas rises and drifts right. Each molecule moves as one piece, so no bond stretches.
  const syngasMolecules = [
    ...carbonMonoxide.map((co) => [co.c, co.o]),
    ...hydrogen.map(([a, b]) => [a, b]),
  ];
  syngasMolecules.forEach((members) => {
    const lift = new THREE.Vector3(12 + jitter(3), 7.5 + jitter(3), jitter(4));
    members.forEach((atomIndex) => frames[4][atomIndex].copy(frames[3][atomIndex]).add(lift));
  });

  // K5: the syngas comes down onto the Reactor 2 catalyst in four groups of CO + 2 H₂.
  methanol.forEach((m, k) => {
    const site = sites[[4, 8, 10, 14][k]];
    const centre = site.clone().add(new THREE.Vector3(0, 1.0, 0));
    frames[5][m.c].copy(centre);
    frames[5][m.o].copy(centre).add(new THREE.Vector3(0, 1.13 * BOND_SCALE, 0));
    // Its two H₂ molecules (H 4k, 4k+1 and H 4k+2, 4k+3) arrive intact on either side.
    const half = new THREE.Vector3(0.37 * BOND_SCALE, 0, 0);
    const pairs: [number, number, THREE.Vector3][] = [
      [m.hc[0], m.hc[1], new THREE.Vector3(1.9, -0.2, 0.7)],
      [m.hc[2], m.ho, new THREE.Vector3(-1.9, -0.2, -0.7)],
    ];
    pairs.forEach(([a, b, offset]) => {
      const pairCentre = centre.clone().add(offset);
      frames[5][a].copy(pairCentre).add(half);
      frames[5][b].copy(pairCentre).sub(half);
    });
  });

  // K6: methanol formed on the surface. K7: methanol leaves to the upper right.
  methanol.forEach((m, k) => {
    const centre = frames[5][m.c].clone();
    const rotation = new THREE.Euler(0, k * 1.3, 0);
    const [c, o, h1, h2, h3, ho] = place(
      centre,
      [methanolTemplate.C, methanolTemplate.O, ...methanolTemplate.HC, methanolTemplate.HO],
      rotation,
    );
    [m.c, m.o, ...m.hc, m.ho].forEach((atomIndex, j) => frames[6][atomIndex].copy([c, o, h1, h2, h3, ho][j]));
    const lift = new THREE.Vector3(11 + k * 1.5, 8 + (k % 2) * 2, (k - 1.5) * 2.2);
    [m.c, m.o, ...m.hc, m.ho].forEach((atomIndex) => frames[7][atomIndex].copy(frames[6][atomIndex]).add(lift));
  });

  const bonds = {
    reactants: [
      ...methane.flatMap((m) => m.h.map((h) => [m.c, h] as [number, number])),
      ...carbonDioxide.o.map((o) => [carbonDioxide.c, o] as [number, number]),
      ...water.flatMap((w) => w.h.map((h) => [w.o, h] as [number, number])),
    ],
    syngas: [
      ...carbonMonoxide.map((co) => [co.c, co.o] as [number, number]),
      ...hydrogen.map(([a, b]) => [a, b] as [number, number]),
    ],
    methanol: methanol.flatMap((m) => [
      [m.c, m.o] as [number, number],
      ...m.hc.map((h) => [m.c, h] as [number, number]),
      [m.o, m.ho] as [number, number],
    ]),
  };

  return { atoms, frames, bonds, sites };
}
