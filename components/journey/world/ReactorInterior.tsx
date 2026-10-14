"use client";
import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Edges } from "@react-three/drei";
import * as THREE from "three";
import { useJourneyFrame } from "@/components/journey/JourneyContext";
import CatalystPellet from "@/components/three/CatalystPellet";
import GasStream from "@/components/three/GasStream";
import { CONTAINER, HERO_PELLET, PELLET_WORLD_RADIUS, REACTOR_1, REACTOR_2, SLAB_HEIGHT } from "@/lib/journey/layout";
import { createPelletGeometry } from "@/lib/three/pellet";
import { seeded, smoothstep } from "@/lib/three/random";

/**
 * Inside the reactor container (deck p4): Reactor 1 holds the CRecREF™ pellets and turns biogas and
 * steam into syngas; Reactor 2 turns syngas into methanol. Both are drawn as cut-away columns, open
 * towards the camera, with paper-coloured pen lines on the dark interior.
 */

const STEEL = "#aab2ac";
const FLOOR_Y = SLAB_HEIGHT + 0.1;

/** Half a cylinder shell (the back half), so the packing inside is visible from the front. */
function CutawayColumn({ centre, radius, height }: { centre: THREE.Vector3; radius: number; height: number }) {
  const base = FLOOR_Y + 0.25;
  return (
    <group position={[centre.x, base, centre.z]}>
      <mesh position={[0, height / 2, 0]}>
        {/* θ = 0 points to +z (the camera side); π/2 → 3π/2 is the back half. */}
        <cylinderGeometry args={[radius, radius, height, 48, 1, true, Math.PI / 2, Math.PI]} />
        <meshStandardMaterial color={STEEL} metalness={0.55} roughness={0.35} side={THREE.DoubleSide} />
        <Edges threshold={20} color="#f3f1ea" transparent opacity={0.45} />
      </mesh>
      {/* Flanges at top, middle and bottom. */}
      {[0, height / 2, height].map((y) => (
        <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[radius + 0.02, 0.022, 8, 48, Math.PI]} />
          <meshStandardMaterial color={STEEL} metalness={0.6} roughness={0.3} />
        </mesh>
      ))}
      {/* Skirt legs. */}
      {[0, 1, 2].map((k) => {
        const angle = Math.PI / 2 + (k / 2) * Math.PI;
        return (
          <mesh key={k} position={[Math.sin(angle) * radius * 0.85, -0.13, Math.cos(angle) * radius * 0.85]}>
            <boxGeometry args={[0.05, 0.26, 0.05]} />
            <meshStandardMaterial color={STEEL} />
          </mesh>
        );
      })}
    </group>
  );
}

/**
 * Random packing inside a column: seeded rejection sampling with a minimum spacing, limited to the
 * back half so nothing floats in front of the cut.
 */
function packColumn(
  centre: THREE.Vector3,
  radius: number,
  height: number,
  spacing: number,
  target: number,
  seed: number,
  keepClear?: THREE.Vector3,
) {
  const random = seeded(seed);
  const placed: THREE.Vector3[] = [];
  const base = FLOOR_Y + 0.25;
  for (let attempt = 0; attempt < target * 30 && placed.length < target; attempt += 1) {
    const angle = Math.PI / 2 + random() * Math.PI;
    const r = Math.sqrt(random()) * (radius - spacing * 0.5);
    const candidate = new THREE.Vector3(
      centre.x + Math.sin(angle) * r,
      base + spacing * 0.5 + random() * (height - spacing),
      centre.z + Math.cos(angle) * r + spacing * 0.35,
    );
    if (keepClear && candidate.distanceTo(keepClear) < spacing * 1.4) continue;
    if (placed.some((p) => p.distanceToSquared(candidate) < spacing * spacing)) continue;
    placed.push(candidate);
  }
  return placed.map((position) =>
    new THREE.Matrix4().compose(
      position,
      new THREE.Quaternion().setFromEuler(new THREE.Euler(random() * Math.PI, random() * Math.PI, random() * Math.PI)),
      new THREE.Vector3(1, 1, 1),
    ),
  );
}

function PackedPellets() {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const geometry = useMemo(() => {
    const pellet = createPelletGeometry("low");
    pellet.scale(PELLET_WORLD_RADIUS, PELLET_WORLD_RADIUS, PELLET_WORLD_RADIUS);
    return pellet;
  }, []);
  const matrices = useMemo(
    () =>
      packColumn(
        REACTOR_1.centre,
        REACTOR_1.radius,
        REACTOR_1.height,
        PELLET_WORLD_RADIUS * 2.05,
        520,
        5,
        HERO_PELLET.position,
      ),
    [],
  );

  useEffect(() => {
    matrices.forEach((matrix, i) => mesh.current?.setMatrixAt(i, matrix));
    if (mesh.current) mesh.current.instanceMatrix.needsUpdate = true;
  }, [matrices]);
  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <instancedMesh ref={mesh} args={[geometry, undefined, matrices.length]} frustumCulled={false}>
      <meshStandardMaterial color="#c3c8c1" roughness={0.85} />
    </instancedMesh>
  );
}

/** Reactor 2 holds a different catalyst: plain tablets, drawn as small cylinders. */
function PackedTablets() {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const geometry = useMemo(() => new THREE.CylinderGeometry(0.032, 0.032, 0.036, 14), []);
  const matrices = useMemo(() => packColumn(REACTOR_2.centre, REACTOR_2.radius, REACTOR_2.height, 0.068, 420, 9), []);

  useEffect(() => {
    matrices.forEach((matrix, i) => mesh.current?.setMatrixAt(i, matrix));
    if (mesh.current) mesh.current.instanceMatrix.needsUpdate = true;
  }, [matrices]);
  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <instancedMesh ref={mesh} args={[geometry, undefined, matrices.length]} frustumCulled={false}>
      <meshStandardMaterial color="#8c7a63" roughness={0.7} metalness={0.2} />
    </instancedMesh>
  );
}

/** Process piping between the units inside the container. */
function Piping() {
  const tubes = useMemo(() => {
    const top1 = FLOOR_Y + 0.25 + REACTOR_1.height + 0.15;
    const top2 = FLOOR_Y + 0.25 + REACTOR_2.height + 0.15;
    const paths = [
      // Biogas and steam in, to the top of Reactor 1.
      [
        new THREE.Vector3(CONTAINER.centre.x - CONTAINER.length / 2, 0.8, 5.3),
        new THREE.Vector3(18.2, 0.8, 5.3),
        new THREE.Vector3(18.2, top1, 5.3),
        new THREE.Vector3(REACTOR_1.centre.x, top1, 5.6),
      ],
      // Syngas from the bottom of Reactor 1 through the cooler to the top of Reactor 2.
      [
        new THREE.Vector3(REACTOR_1.centre.x, FLOOR_Y + 0.15, 5.7),
        new THREE.Vector3(21.5, FLOOR_Y + 0.15, 5.4),
        new THREE.Vector3(21.5, top2, 5.4),
        new THREE.Vector3(REACTOR_2.centre.x, top2, 5.6),
      ],
      // Methanol out to the storage end.
      [
        new THREE.Vector3(REACTOR_2.centre.x, FLOOR_Y + 0.15, 5.7),
        new THREE.Vector3(27.8, FLOOR_Y + 0.15, 5.4),
        new THREE.Vector3(CONTAINER.centre.x + CONTAINER.length / 2, 0.8, 5.4),
      ],
    ];
    return paths.map((points) => new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.05), 80, 0.05, 8));
  }, []);
  useEffect(() => () => tubes.forEach((tube) => tube.dispose()), [tubes]);

  return (
    <group>
      {tubes.map((tube, i) => (
        <mesh key={i} geometry={tube}>
          <meshStandardMaterial color={i === 0 ? "#d9a92c" : "#c9cec8"} metalness={0.4} roughness={0.4} />
        </mesh>
      ))}
      {/* Syngas cooler between the reactors. */}
      <mesh position={[21.5, 0.75, 5.35]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.2, 0.2, 1.1, 24]} />
        <meshStandardMaterial color={STEEL} metalness={0.55} roughness={0.35} />
        <Edges threshold={20} color="#f3f1ea" transparent opacity={0.35} />
      </mesh>
      {/* Control cabinet with its screen. */}
      <mesh position={[26.9, FLOOR_Y + 0.95, 5.35]}>
        <boxGeometry args={[0.9, 1.9, 0.45]} />
        <meshStandardMaterial color="#d7dbd6" roughness={0.7} />
        <Edges threshold={20} color="#f3f1ea" transparent opacity={0.35} />
      </mesh>
      <mesh position={[26.9, FLOOR_Y + 1.3, 5.58]}>
        <planeGeometry args={[0.6, 0.38]} />
        <meshBasicMaterial color="#3fd47a" toneMapped={false} />
      </mesh>
    </group>
  );
}

/** The pellet the camera flies into, with gas streaming through its channels. */
function HeroPellet() {
  const frame = useJourneyFrame();
  const pelletFade = useRef(1);
  const gasFade = useRef(0);
  const quaternion = useMemo(
    () => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), HERO_PELLET.axis),
    [],
  );

  useFrame(() => {
    const { at, distance } = frame.current;
    // The pellet clears out of the way as the camera enters its centre channel.
    pelletFade.current = smoothstep(0.011, 0.04, distance);
    gasFade.current = smoothstep(470, 525, at) * (1 - smoothstep(610, 640, at)) * pelletFade.current;
  });

  return (
    <group position={HERO_PELLET.position} quaternion={quaternion} scale={PELLET_WORLD_RADIUS}>
      <CatalystPellet fade={pelletFade} edgeOpacity={0.5} />
      {/* Point sizes are in world units; the stream sits in a group scaled to the pellet. */}
      <GasStream count={520} sizeScale={PELLET_WORLD_RADIUS} opacity={gasFade} speed={0.7} />
    </group>
  );
}

/** Below this camera distance (m) only the hero pellet and the molecules are drawn. */
const EQUIPMENT_HIDE_DISTANCE = 0.025;
/** Brightness of the warm lamp inside the reactor container. */
const LAMP_INTENSITY = 6;

export default function ReactorInterior() {
  const frame = useJourneyFrame();
  const group = useRef<THREE.Group>(null);
  const equipment = useRef<THREE.Group>(null);
  const lamp = useRef<THREE.PointLight>(null);

  useFrame(() => {
    const { at, distance } = frame.current;
    // Only draw the interior while the container is open or the camera is inside.
    const interiorShown = at > 330 && at < 940;
    // Pen lines ignore fog, so the columns' edges would cross the molecule close-ups.
    const equipmentShown = distance > EQUIPMENT_HIDE_DISTANCE;
    if (group.current) group.current.visible = interiorShown;
    if (equipment.current) equipment.current.visible = equipmentShown;
    // The lamp is switched by intensity, not hidden. The number of lights is part of every material's
    // shader, so hiding a light makes three.js recompile all of them in the middle of the scroll.
    if (lamp.current) lamp.current.intensity = interiorShown && equipmentShown ? LAMP_INTENSITY : 0;
  });

  return (
    <>
      <pointLight ref={lamp} position={[21.5, 2.3, 7.4]} intensity={0} distance={9} color="#fff1dc" />
      <group ref={group}>
        <group ref={equipment}>
          <CutawayColumn centre={REACTOR_1.centre} radius={REACTOR_1.radius} height={REACTOR_1.height} />
          <CutawayColumn centre={REACTOR_2.centre} radius={REACTOR_2.radius} height={REACTOR_2.height} />
          <PackedPellets />
          <PackedTablets />
          <Piping />
        </group>
        <HeroPellet />
      </group>
    </>
  );
}
