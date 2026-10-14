"use client";
import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Grid } from "@react-three/drei";
import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { useJourneyFrame } from "@/components/journey/JourneyContext";
import Ink from "@/components/journey/world/Ink";
import { useGlowPoints } from "@/components/three/useGlowPoints";
import { COVERED_LAGOON, OPEN_LAGOON } from "@/lib/journey/layout";
import { seeded, smoothstep } from "@/lib/three/random";

/** A low earth bank around a lagoon, drawn as four boxes. */
function Berm({ centre, width, depth }: { centre: THREE.Vector3; width: number; depth: number }) {
  const bank = 1.6;
  const height = 0.7;
  const sides: [number, number, number, number][] = [
    [0, -depth / 2 - bank / 2, width + bank * 2, bank],
    [0, depth / 2 + bank / 2, width + bank * 2, bank],
    [-width / 2 - bank / 2, 0, bank, depth],
    [width / 2 + bank / 2, 0, bank, depth],
  ];
  return (
    <group position={[centre.x, height / 2, centre.z]}>
      {sides.map(([x, z, w, d]) => (
        <mesh key={`${x}-${z}`} position={[x, 0, z]}>
          <boxGeometry args={[w, height, d]} />
          <meshStandardMaterial color="#e3ddcf" roughness={1} />
          <Ink opacity={0.4} />
        </mesh>
      ))}
    </group>
  );
}

/**
 * Open POME lagoon (deck p2): brown wastewater with methane and CO₂ rising off it unchecked.
 * The bubbles are strongest in the "feedstock" state and fade once the story moves on.
 */
function OpenLagoon() {
  const frame = useJourneyFrame();
  const { centre, width, depth } = OPEN_LAGOON;
  const count = 420;
  const cloud = useGlowPoints(count, { additive: false });
  const particles = useMemo(() => {
    const random = seeded(12);
    return Array.from({ length: count }, () => ({
      x: centre.x + (random() - 0.5) * width * 0.9,
      z: centre.z + (random() - 0.5) * depth * 0.9,
      phase: random(),
      speed: 0.05 + random() * 0.05,
      methane: random() < 0.6,
      drift: random() * Math.PI * 2,
    }));
  }, [centre, width, depth]);
  const methane = useMemo(() => new THREE.Color("#1a9645"), []);
  const carbonDioxide = useMemo(() => new THREE.Color("#b8860b"), []);

  useFrame(() => {
    const { time, at, dark } = frame.current;
    // Emissions read best when the camera is at the lagoon; keep a faint trace otherwise.
    const emphasis = 0.12 + 0.88 * smoothstep(90, 160, at) * (1 - smoothstep(230, 300, at));
    particles.forEach((p, i) => {
      const rise = (p.phase + time * p.speed) % 1;
      const height = 0.4 + rise * 16;
      cloud.positions.set(
        [p.x + Math.sin(p.drift + rise * 4) * 1.2 * rise, height, p.z + Math.cos(p.drift + rise * 3) * 1.2 * rise],
        i * 3,
      );
      const color = p.methane ? methane : carbonDioxide;
      cloud.colors.set([color.r, color.g, color.b], i * 3);
      cloud.sizes[i] = 0.28 + rise * 0.3;
      cloud.alphas[i] = (1 - dark) * emphasis * smoothstep(0, 0.1, rise) * (1 - smoothstep(0.55, 1, rise)) * 0.8;
    });
    cloud.commit();
  });

  return (
    <group>
      <Berm centre={centre} width={width} depth={depth} />
      <mesh position={[centre.x, 0.25, centre.z]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color="#6e6452" roughness={0.3} metalness={0.05} />
      </mesh>
      <points geometry={cloud.geometry} material={cloud.material} frustumCulled={false} />
    </group>
  );
}

/** Covered lagoon: a black HDPE membrane that bulges with the biogas collected under it. */
function CoveredLagoon() {
  const { centre, width, depth, domeHeight } = COVERED_LAGOON;
  const geometry = useMemo(() => {
    const plane = new THREE.PlaneGeometry(width, depth, 90, 60);
    plane.rotateX(-Math.PI / 2);
    const position = plane.attributes.position;
    for (let i = 0; i < position.count; i += 1) {
      const u = (position.getX(i) / width) * 2;
      const v = (position.getZ(i) / depth) * 2;
      const pillow = Math.max(0, (1 - u * u) * (1 - v * v));
      // Long shallow folds across the membrane, like the deck photo.
      const folds = Math.sin(u * 9 + v * 2) * 0.06 + Math.sin(v * 13) * 0.04;
      position.setY(i, 0.3 + domeHeight * Math.pow(pillow, 0.8) + folds * pillow);
    }
    plane.computeVertexNormals();
    return plane;
  }, [width, depth, domeHeight]);
  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <group>
      <Berm centre={centre} width={width} depth={depth} />
      <mesh geometry={geometry} position={[centre.x, 0, centre.z]}>
        <meshStandardMaterial color="#262b2a" roughness={0.42} metalness={0.15} />
      </mesh>
    </group>
  );
}

/** One oil palm: a trunk and a crown of drooping fronds, merged into two geometries for instancing. */
function createPalmGeometries() {
  const trunk = new THREE.CylinderGeometry(0.28, 0.4, 6, 7);
  trunk.translate(0, 3, 0);
  const fronds: THREE.BufferGeometry[] = [];
  const frondCount = 11;
  for (let k = 0; k < frondCount; k += 1) {
    const frond = new THREE.ConeGeometry(0.55, 4.6, 4);
    frond.scale(1, 1, 0.25);
    frond.translate(0, 2.3, 0);
    frond.rotateZ(-(1.15 + (k % 3) * 0.18)); // lean outward and droop
    frond.rotateY((k / frondCount) * Math.PI * 2);
    frond.translate(0, 6, 0);
    fronds.push(frond);
  }
  const crown = mergeGeometries(fronds)!;
  return { trunk, crown };
}

const PALM_SPACING = 8.5;
/** Clear ground around the lagoons, plant and mill (x0, x1, z0, z1). */
const CLEARINGS: [number, number, number, number][] = [
  [-62, 46, -20, 52],
  [38, 118, -72, 18],
];

/** Plantation rows of oil palms around the site. Seeded so the layout never changes. */
function Plantation({ mobile }: { mobile: boolean }) {
  const { trunk, crown } = useMemo(createPalmGeometries, []);
  const trunks = useRef<THREE.InstancedMesh>(null);
  const crowns = useRef<THREE.InstancedMesh>(null);

  const placements = useMemo(() => {
    const random = seeded(1946);
    const result: THREE.Matrix4[] = [];
    const extent = mobile ? 110 : 150;
    for (let row = 0, z = -extent; z <= extent; row += 1, z += PALM_SPACING * 0.87) {
      for (let x = -extent - (row % 2) * (PALM_SPACING / 2); x <= extent; x += PALM_SPACING) {
        const px = x + (random() - 0.5) * 1.6;
        const pz = z + (random() - 0.5) * 1.6;
        const cleared = CLEARINGS.some(([x0, x1, z0, z1]) => px > x0 && px < x1 && pz > z0 && pz < z1);
        if (cleared) continue;
        const scale = 0.85 + random() * 0.35;
        result.push(
          new THREE.Matrix4().compose(
            new THREE.Vector3(px, 0, pz),
            new THREE.Quaternion().setFromEuler(new THREE.Euler(0, random() * Math.PI * 2, (random() - 0.5) * 0.08)),
            new THREE.Vector3(scale, scale, scale),
          ),
        );
      }
    }
    return result;
  }, [mobile]);

  useEffect(() => {
    placements.forEach((matrix, i) => {
      trunks.current?.setMatrixAt(i, matrix);
      crowns.current?.setMatrixAt(i, matrix);
    });
    if (trunks.current) trunks.current.instanceMatrix.needsUpdate = true;
    if (crowns.current) crowns.current.instanceMatrix.needsUpdate = true;
  }, [placements]);

  useEffect(() => () => {
    trunk.dispose();
    crown.dispose();
  }, [trunk, crown]);

  return (
    <group>
      <instancedMesh ref={trunks} args={[trunk, undefined, placements.length]} frustumCulled={false}>
        <meshStandardMaterial color="#a39784" roughness={1} />
      </instancedMesh>
      <instancedMesh ref={crowns} args={[crown, undefined, placements.length]} frustumCulled={false}>
        <meshStandardMaterial color="#7f9b78" roughness={1} flatShading />
      </instancedMesh>
    </group>
  );
}

/**
 * Ground plane in the background colour, so fog and ground meet without a seam, with a fine
 * survey grid on top (hidden once the camera is inside the reactor).
 */
function Ground() {
  const frame = useJourneyFrame();
  const material = useRef<THREE.MeshBasicMaterial>(null);
  const grid = useRef<THREE.Mesh>(null);
  useFrame(({ scene }) => {
    if (material.current && scene.background instanceof THREE.Color) material.current.color.copy(scene.background);
    if (grid.current) grid.current.visible = frame.current.dark < 0.5;
  });
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <planeGeometry args={[2000, 2000]} />
        <meshBasicMaterial ref={material} />
      </mesh>
      <Grid
        ref={grid}
        position={[0, 0.005, 0]}
        args={[400, 400]}
        cellSize={2}
        sectionSize={10}
        cellThickness={0.5}
        sectionThickness={0.8}
        cellColor="#c9c5b8"
        sectionColor="#b3ae9f"
        fadeDistance={260}
        fadeStrength={1.4}
        infiniteGrid
      />
    </group>
  );
}

export default function Landscape({ mobile }: { mobile: boolean }) {
  return (
    <group>
      <Ground />
      <OpenLagoon />
      <CoveredLagoon />
      <Plantation mobile={mobile} />
    </group>
  );
}
