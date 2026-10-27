"use client";
import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useJourneyFrame } from "@/components/journey/JourneyContext";
import { useGlowPoints } from "@/components/three/useGlowPoints";
import { HERO_PELLET, MOLECULE_STAGE_SCALE } from "@/lib/journey/layout";
import { buildMoleculeSequence, KEYFRAMES } from "@/lib/journey/molecules";
import { MOLECULE_TIMELINE } from "@/lib/journey/states";
import { atomStyle, type Element } from "@/lib/three/palette";
import { clamp01, easeInOutCubic, seeded, smoothstep } from "@/lib/three/random";

/**
 * The molecular stage inside the hero pellet's centre channel. Scroll position drives the atoms
 * through the keyframes in molecules.ts; bonds thin away as they break and grow as new ones form.
 */

const ELEMENTS: Element[] = ["H", "C", "O"];
const BOND_RADIUS = 0.13;
/** Each atom starts its move a little later than the last, so groups move organically. */
const STAGGER = 0.35;
/** Thermal vibration amplitude, in stage units. */
const VIBRATION = 0.045;

const UP = new THREE.Vector3(0, 1, 0);
const scratch = {
  matrix: new THREE.Matrix4(),
  quaternion: new THREE.Quaternion(),
  scale: new THREE.Vector3(),
  mid: new THREE.Vector3(),
  direction: new THREE.Vector3(),
  color: new THREE.Color(),
};

/** Map the timeline position to a keyframe index (0…7) by linear interpolation of MOLECULE_TIMELINE. */
function keyframeAt(at: number) {
  const timeline = MOLECULE_TIMELINE;
  if (at <= timeline[0][0]) return 0;
  for (let i = 0; i < timeline.length - 1; i += 1) {
    const [at0, k0] = timeline[i];
    const [at1, k1] = timeline[i + 1];
    if (at <= at1) return k0 + ((at - at0) / (at1 - at0)) * (k1 - k0);
  }
  return KEYFRAMES.length - 1;
}

function useStageMaterial(color: string) {
  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color,
        roughness: 0.28,
        clearcoat: 1,
        clearcoatRoughness: 0.2,
        fog: false,
        transparent: true,
      }),
    [color],
  );
  useEffect(() => () => material.dispose(), [material]);
  return material;
}

/** The catalyst surface: a patch of support atoms that darkens towards its edge, plus active sites. */
function CatalystSurface({ sites, fade, keyframe }: { sites: THREE.Vector3[]; fade: { current: number }; keyframe: { current: number } }) {
  const support = useRef<THREE.InstancedMesh>(null);
  const active = useRef<THREE.InstancedMesh>(null);
  const supportMaterial = useMemo(
    () => new THREE.MeshPhysicalMaterial({ color: "#ffffff", roughness: 0.6, fog: false, transparent: true }),
    [],
  );
  const activeMaterial = useStageMaterial("#d9a92c");
  const geometry = useMemo(() => new THREE.SphereGeometry(1, 20, 14), []);

  const supportAtoms = useMemo(() => {
    const random = seeded(808);
    const atoms: { position: THREE.Vector3; shade: number }[] = [];
    for (let row = -9; row <= 9; row += 1) {
      for (let col = -14; col <= 14; col += 1) {
        const x = col * 1.25 + (row % 2 ? 0.62 : 0);
        const z = row * 1.08;
        const radius = Math.hypot(x / 1.4, z);
        if (radius > 13) continue;
        atoms.push({ position: new THREE.Vector3(x, -0.6 + random() * 0.08, z), shade: 1 - 0.85 * smoothstep(6, 13, radius) });
      }
    }
    return atoms;
  }, []);

  useEffect(() => {
    supportAtoms.forEach((atom, i) => {
      scratch.matrix.compose(atom.position, scratch.quaternion.identity(), scratch.scale.setScalar(0.62));
      support.current?.setMatrixAt(i, scratch.matrix);
      support.current?.setColorAt(i, scratch.color.set("#9da69e").multiplyScalar(atom.shade));
    });
    sites.forEach((site, i) => {
      scratch.matrix.compose(site.clone().setY(-0.15), scratch.quaternion.identity(), scratch.scale.setScalar(0.62));
      active.current?.setMatrixAt(i, scratch.matrix);
    });
    if (support.current) {
      support.current.instanceMatrix.needsUpdate = true;
      if (support.current.instanceColor) support.current.instanceColor.needsUpdate = true;
      // The per-instance colours were added after the first compile; recompile with them.
      supportMaterial.needsUpdate = true;
    }
    if (active.current) active.current.instanceMatrix.needsUpdate = true;
  }, [supportAtoms, sites, supportMaterial]);

  const reactor1 = useMemo(() => new THREE.Color("#d9a92c"), []);
  const reactor2 = useMemo(() => new THREE.Color("#c4774a"), []);

  useFrame(() => {
    supportMaterial.opacity = fade.current;
    activeMaterial.opacity = fade.current;
    // Reactor 2 uses a different catalyst; its active sites shift from gold to copper.
    activeMaterial.color.copy(reactor1).lerp(reactor2, smoothstep(4.2, 4.9, keyframe.current));
  });

  useEffect(() => () => {
    geometry.dispose();
    supportMaterial.dispose();
  }, [geometry, supportMaterial]);

  return (
    <group>
      <instancedMesh ref={support} args={[geometry, supportMaterial, supportAtoms.length]} frustumCulled={false} />
      <instancedMesh ref={active} args={[geometry, activeMaterial, sites.length]} frustumCulled={false} />
    </group>
  );
}

/** Faint gas molecules drifting through the channel behind the reaction, for depth. */
function BackgroundGas({ fade }: { fade: { current: number } }) {
  const frame = useJourneyFrame();
  const count = 140;
  const cloud = useGlowPoints(count);
  const particles = useMemo(() => {
    const random = seeded(64);
    return Array.from({ length: count }, () => ({
      x: random() * 60 - 30,
      y: 2 + random() * 14,
      z: -12 - random() * 18,
      speed: 0.6 + random() * 1.2,
      tint: random(),
    }));
  }, []);
  const colors = useMemo(() => [new THREE.Color("#3fd47a"), new THREE.Color("#d9a92c"), new THREE.Color("#eef3ec")], []);

  useFrame(() => {
    const { time } = frame.current;
    particles.forEach((p, i) => {
      const x = ((p.x + time * p.speed + 30) % 60) - 30;
      cloud.positions.set([x, p.y, p.z], i * 3);
      const color = colors[p.tint < 0.4 ? 0 : p.tint < 0.7 ? 1 : 2];
      cloud.colors.set([color.r, color.g, color.b], i * 3);
      cloud.sizes[i] = 0.9 * MOLECULE_STAGE_SCALE;
      cloud.alphas[i] = 0.35 * fade.current * (1 - smoothstep(22, 30, Math.abs(x)));
    });
    cloud.commit();
  });

  return <points geometry={cloud.geometry} material={cloud.material} frustumCulled={false} />;
}

export default function MoleculeStage() {
  const frame = useJourneyFrame();
  const group = useRef<THREE.Group>(null);
  const sequence = useMemo(buildMoleculeSequence, []);
  const fade = useRef(0);
  const keyframe = useRef(0);

  const atomMeshes = useRef<Record<Element, THREE.InstancedMesh | null>>({ H: null, C: null, O: null });
  const bondMesh = useRef<THREE.InstancedMesh>(null);
  const sphere = useMemo(() => new THREE.SphereGeometry(1, 28, 20), []);
  const cylinder = useMemo(() => new THREE.CylinderGeometry(1, 1, 1, 14, 1), []);
  const materials = {
    H: useStageMaterial(atomStyle.H.color),
    C: useStageMaterial(atomStyle.C.color),
    O: useStageMaterial(atomStyle.O.color),
  };
  const bondMaterial = useStageMaterial("#cfd6cf");

  // Atom indices per element, so each element draws with its own instanced mesh.
  const byElement = useMemo(() => {
    const groups: Record<Element, number[]> = { H: [], C: [], O: [] };
    sequence.atoms.forEach((atom, i) => groups[atom.element].push(i));
    return groups;
  }, [sequence]);

  /**
   * Start delays per keyframe segment. While bonds are visible, every atom of a molecule shares one
   * delay, so the molecule moves as a unit; during bond breaking and forming, atoms move freely.
   */
  const segmentDelays = useMemo(() => {
    const random = seeded(99);
    const perAtom = sequence.atoms.map(() => random());
    const byMolecule = (bonds: [number, number][]) => {
      // Union-find over the bonds: atoms joined by bonds share the lowest member's delay.
      const parent = sequence.atoms.map((_, i) => i);
      const find = (i: number): number => (parent[i] === i ? i : (parent[i] = find(parent[i])));
      bonds.forEach(([a, b]) => {
        parent[find(a)] = find(b);
      });
      return sequence.atoms.map((_, i) => perAtom[find(i)]);
    };
    const reactants = byMolecule(sequence.bonds.reactants);
    const syngas = byMolecule(sequence.bonds.syngas);
    const methanol = byMolecule(sequence.bonds.methanol);
    // Segments: K0→1 reactants travel, K1→2 break, K2→3 form, K3→4 and K4→5 syngas travels,
    // K5→6 form methanol, K6→7 methanol travels.
    return [reactants, perAtom, perAtom, syngas, syngas, perAtom, methanol];
  }, [sequence]);

  const allBonds = useMemo(
    () => [
      ...sequence.bonds.reactants.map((pair) => ({ pair, stage: "reactants" as const })),
      ...sequence.bonds.syngas.map((pair) => ({ pair, stage: "syngas" as const })),
      ...sequence.bonds.methanol.map((pair) => ({ pair, stage: "methanol" as const })),
    ],
    [sequence],
  );
  const positions = useMemo(() => sequence.atoms.map(() => new THREE.Vector3()), [sequence]);

  useEffect(() => () => {
    sphere.dispose();
    cylinder.dispose();
  }, [sphere, cylinder]);

  useFrame(() => {
    const { at, distance, time } = frame.current;
    fade.current = 1 - smoothstep(0.012, 0.03, distance);
    if (group.current) group.current.visible = fade.current > 0.01;
    if (fade.current <= 0.01) return;

    const q = keyframeAt(at);
    keyframe.current = q;
    const segment = Math.min(Math.floor(q), KEYFRAMES.length - 2);
    const t = q - segment;

    // Atom positions: staggered eased move between the two keyframes around q, plus vibration.
    sequence.atoms.forEach((_, a) => {
      const local = clamp01((t - segmentDelays[segment][a] * STAGGER) / (1 - STAGGER));
      const eased = easeInOutCubic(local);
      positions[a]
        .copy(sequence.frames[segment][a])
        .lerp(sequence.frames[segment + 1][a], eased)
        .add(
          scratch.direction.set(
            Math.sin(time * 7.1 + a * 1.7),
            Math.sin(time * 6.3 + a * 2.3),
            Math.sin(time * 5.7 + a * 0.9),
          ).multiplyScalar(VIBRATION),
        );
    });

    for (const element of ELEMENTS) {
      const mesh = atomMeshes.current[element];
      if (!mesh) continue;
      byElement[element].forEach((atomIndex, i) => {
        scratch.matrix.compose(positions[atomIndex], scratch.quaternion.identity(), scratch.scale.setScalar(atomStyle[element].radius));
        mesh.setMatrixAt(i, scratch.matrix);
      });
      mesh.instanceMatrix.needsUpdate = true;
      materials[element].opacity = fade.current;
    }

    // Bond weights: reactant bonds break, syngas bonds form then break, methanol bonds form.
    // Bonds exist only while their atoms sit at bonded distance: they vanish as soon as atoms
    // start to separate and appear once the new partners have arrived.
    const weights = {
      reactants: 1 - smoothstep(1.0, 1.25, q),
      syngas: smoothstep(2.7, 3.0, q) * (1 - smoothstep(5.0, 5.2, q)),
      methanol: smoothstep(5.75, 6.0, q),
    };
    allBonds.forEach(({ pair: [a, b], stage }, i) => {
      const weight = weights[stage];
      scratch.direction.subVectors(positions[b], positions[a]);
      const length = scratch.direction.length();
      scratch.mid.addVectors(positions[a], positions[b]).multiplyScalar(0.5);
      scratch.quaternion.setFromUnitVectors(UP, scratch.direction.normalize());
      scratch.scale.set(BOND_RADIUS * weight, length, BOND_RADIUS * weight);
      scratch.matrix.compose(scratch.mid, scratch.quaternion, scratch.scale);
      bondMesh.current?.setMatrixAt(i, scratch.matrix);
    });
    if (bondMesh.current) bondMesh.current.instanceMatrix.needsUpdate = true;
    bondMaterial.opacity = fade.current;
  });

  return (
    <group ref={group} position={HERO_PELLET.position} scale={MOLECULE_STAGE_SCALE} visible={false}>
      <CatalystSurface sites={sequence.sites} fade={fade} keyframe={keyframe} />
      {ELEMENTS.map((element) => (
        <instancedMesh
          key={element}
          ref={(mesh) => {
            atomMeshes.current[element] = mesh;
          }}
          args={[sphere, materials[element], byElement[element].length]}
          frustumCulled={false}
        />
      ))}
      <instancedMesh ref={bondMesh} args={[cylinder, bondMaterial, allBonds.length]} frustumCulled={false} />
      <BackgroundGas fade={fade} />
    </group>
  );
}
