"use client";
import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useJourneyFrame } from "@/components/journey/JourneyContext";
import Ink from "@/components/journey/world/Ink";
import { useGlowPoints } from "@/components/three/useGlowPoints";
import {
  CONTAINER,
  PIPE_PATH,
  PIPE_REACTOR_AT,
  PRETREATMENT,
  SLAB_HEIGHT,
  STORAGE,
} from "@/lib/journey/layout";
import { seeded, smoothstep } from "@/lib/three/random";

/**
 * The pilot plant from the deck render (p11): pre-treatment vessels under a canopy, the reactor
 * container, methanol storage totes, and the gold biogas line that links them. Drawn as a
 * technical illustration: pale materials, ink edges, brand colour only on the container and pipe.
 */

const COLORS = {
  concrete: "#e2ddd1",
  steel: "#f6f5f0",
  canopy: "#d9e3df",
  post: "#c9cec8",
  container: "#1a9645",
  pipe: "#d9a92c",
  tote: "#eef0ea",
  methanol: "#bfe3cf",
};

function Slab({ x0, x1, z0, z1 }: { x0: number; x1: number; z0: number; z1: number }) {
  return (
    <mesh position={[(x0 + x1) / 2, SLAB_HEIGHT / 2, (z0 + z1) / 2]}>
      <boxGeometry args={[x1 - x0, SLAB_HEIGHT, z1 - z0]} />
      <meshStandardMaterial color={COLORS.concrete} roughness={1} />
      <Ink opacity={0.35} />
    </mesh>
  );
}

function Canopy({ x0, x1, z0, z1, height }: { x0: number; x1: number; z0: number; z1: number; height: number }) {
  const posts: [number, number][] = [
    [x0 + 0.3, z0 + 0.3],
    [x1 - 0.3, z0 + 0.3],
    [x0 + 0.3, z1 - 0.3],
    [x1 - 0.3, z1 - 0.3],
  ];
  return (
    <group>
      {posts.map(([x, z]) => (
        <mesh key={`${x}-${z}`} position={[x, height / 2, z]}>
          <boxGeometry args={[0.16, height, 0.16]} />
          <meshStandardMaterial color={COLORS.post} roughness={1} />
        </mesh>
      ))}
      {/* Thin roof with a slight fall towards the back, drawn see-through so the units below stay visible. */}
      <mesh position={[(x0 + x1) / 2, height, (z0 + z1) / 2]} rotation={[-0.06, 0, 0]}>
        <boxGeometry args={[x1 - x0 + 0.6, 0.08, z1 - z0 + 0.6]} />
        <meshStandardMaterial color={COLORS.canopy} roughness={1} transparent opacity={0.42} depthWrite={false} />
        <Ink opacity={0.5} />
      </mesh>
    </group>
  );
}

function Vessel({ x, z, radius, height }: { x: number; z: number; radius: number; height: number }) {
  const legs = [0, 1, 2, 3].map((k) => {
    const angle = (k / 4) * Math.PI * 2 + Math.PI / 4;
    return [x + Math.cos(angle) * radius * 0.8, z + Math.sin(angle) * radius * 0.8] as const;
  });
  const base = SLAB_HEIGHT + 0.45;
  return (
    <group>
      {legs.map(([lx, lz]) => (
        <mesh key={`${lx}-${lz}`} position={[lx, SLAB_HEIGHT + 0.22, lz]}>
          <boxGeometry args={[0.08, 0.45, 0.08]} />
          <meshStandardMaterial color={COLORS.post} />
        </mesh>
      ))}
      <mesh position={[x, base + height / 2, z]}>
        <cylinderGeometry args={[radius, radius, height, 28, 1]} />
        <meshStandardMaterial color={COLORS.steel} roughness={0.55} metalness={0.15} />
        <Ink opacity={0.55} />
      </mesh>
      {/* Dished heads top and bottom. */}
      <mesh position={[x, base + height, z]} scale={[1, 0.45, 1]}>
        <sphereGeometry args={[radius, 28, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={COLORS.steel} roughness={0.55} metalness={0.15} />
      </mesh>
      <mesh position={[x, base, z]} scale={[1, 0.3, 1]} rotation={[Math.PI, 0, 0]}>
        <sphereGeometry args={[radius, 28, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={COLORS.steel} roughness={0.55} metalness={0.15} />
      </mesh>
    </group>
  );
}

function PretreatmentUnit() {
  const { x0, x1, z0, z1 } = PRETREATMENT;
  const vessels = [
    { x: 1.6, radius: 0.42, height: 2.6 },
    { x: 3.2, radius: 0.42, height: 2.6 },
    { x: 4.8, radius: 0.42, height: 2.6 },
    { x: 7.0, radius: 0.75, height: 2.9 },
    { x: 9.8, radius: 1.0, height: 3.4 },
  ];
  return (
    <group>
      <Slab x0={x0} x1={x1} z0={z0} z1={z1} />
      {vessels.map((v) => (
        <Vessel key={v.x} x={x0 + v.x} z={(z0 + z1) / 2 - 0.4} radius={v.radius} height={v.height} />
      ))}
      {/* Small pump skids along the front. */}
      {[2.4, 5.9, 8.4].map((x) => (
        <mesh key={x} position={[x0 + x, SLAB_HEIGHT + 0.3, z1 - 1.3]}>
          <boxGeometry args={[0.9, 0.6, 0.6]} />
          <meshStandardMaterial color="#d6dbe0" roughness={0.8} />
          <Ink opacity={0.5} />
        </mesh>
      ))}
      <Canopy x0={x0} x1={x1} z0={z0} z1={z1} height={5.2} />
    </group>
  );
}

/** Draws the side label once fonts are ready, so the type matches the site. */
function useContainerLabel() {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 2048;
    canvas.height = 512;
    return new THREE.CanvasTexture(canvas);
  }, []);

  useEffect(() => {
    const canvas = texture.image as HTMLCanvasElement;
    const context = canvas.getContext("2d")!;
    const draw = () => {
      const family = getComputedStyle(document.body).fontFamily;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = "#f3f1ea";
      context.font = `800 190px ${family}`;
      context.fillText("BIO-METHANOL", 120, 280);
      context.font = `500 70px ${family}`;
      context.fillText("CRecTech · CRecREF™ reactor unit", 128, 400);
      texture.needsUpdate = true;
    };
    draw();
    document.fonts.ready.then(draw);
    return () => texture.dispose();
  }, [texture]);

  return texture;
}

/** The reactor container. Its front wall, ribs, label and roof fade away when the camera goes inside. */
function ReactorContainer() {
  const frame = useJourneyFrame();
  const label = useContainerLabel();
  const fadeMaterials = useRef<THREE.Material[]>([]);
  const register = (material: THREE.Material | null) => {
    if (material && !fadeMaterials.current.includes(material)) fadeMaterials.current.push(material);
  };

  const { centre, length, height, width } = CONTAINER;
  const ribCount = 44;

  useFrame(() => {
    const open = smoothstep(355, 400, frame.current.at) * (1 - smoothstep(880, 925, frame.current.at));
    for (const material of fadeMaterials.current) {
      material.opacity = 1 - open;
      material.visible = open < 0.98;
    }
  });

  const front = centre.z + width / 2;
  const back = centre.z - width / 2;
  return (
    <group>
      <Slab x0={centre.x - length / 2 - 0.8} x1={centre.x + length / 2 + 0.8} z0={back - 1.2} z1={front + 1.6} />
      {/* Floor, back wall and end walls stay; the camera looks in through the front. */}
      <mesh position={[centre.x, SLAB_HEIGHT + 0.05, centre.z]}>
        <boxGeometry args={[length, 0.1, width]} />
        <meshStandardMaterial color="#2a312c" roughness={0.9} />
      </mesh>
      <mesh position={[centre.x, SLAB_HEIGHT + height / 2, back]}>
        <boxGeometry args={[length, height, 0.06]} />
        <meshStandardMaterial color={COLORS.container} roughness={0.75} side={THREE.DoubleSide} />
        <Ink opacity={0.6} />
      </mesh>
      {/* Insulated inner lining: dark, so the reactors read against it from inside. */}
      <mesh position={[centre.x, SLAB_HEIGHT + height / 2, back + 0.05]}>
        <planeGeometry args={[length - 0.1, height - 0.1]} />
        <meshStandardMaterial color="#1f2823" roughness={0.95} />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[centre.x + (side * length) / 2, SLAB_HEIGHT + height / 2, centre.z]}>
          <boxGeometry args={[0.06, height, width]} />
          <meshStandardMaterial color={COLORS.container} roughness={0.75} side={THREE.DoubleSide} />
          <Ink opacity={0.6} />
        </mesh>
      ))}

      {/* Fading parts: roof, front wall, corrugation ribs and the label. */}
      <mesh position={[centre.x, SLAB_HEIGHT + height, centre.z]}>
        <boxGeometry args={[length, 0.06, width]} />
        <meshStandardMaterial ref={register} color="#22a352" roughness={0.75} transparent />
      </mesh>
      <mesh position={[centre.x, SLAB_HEIGHT + height / 2, front]}>
        <boxGeometry args={[length, height, 0.06]} />
        <meshStandardMaterial ref={register} color={COLORS.container} roughness={0.75} transparent />
      </mesh>
      {Array.from({ length: ribCount }, (_, i) => {
        const x = centre.x - length / 2 + ((i + 0.5) / ribCount) * length;
        return (
          <mesh key={i} position={[x, SLAB_HEIGHT + height / 2, front + 0.05]}>
            <boxGeometry args={[0.07, height - 0.2, 0.05]} />
            <meshStandardMaterial ref={register} color="#158a3e" roughness={0.75} transparent />
          </mesh>
        );
      })}
      <mesh position={[centre.x - 1.2, SLAB_HEIGHT + height / 2 + 0.15, front + 0.09]}>
        <planeGeometry args={[7.2, 1.8]} />
        <meshBasicMaterial ref={register} map={label} transparent toneMapped={false} />
      </mesh>
      {/* Door end detail: two vertical locking bars. */}
      {[0.35, 0.75].map((offset) => (
        <mesh key={offset} position={[centre.x + length / 2 + 0.06, SLAB_HEIGHT + height / 2, centre.z - width / 2 + offset * width]}>
          <cylinderGeometry args={[0.03, 0.03, height - 0.3, 8]} />
          <meshStandardMaterial color="#c9cec8" metalness={0.4} roughness={0.5} />
        </mesh>
      ))}
      <Canopy
        x0={centre.x - length / 2 - 0.6}
        x1={centre.x + length / 2 + 0.6}
        z0={back - 1}
        z1={front + 1.2}
        height={4.4}
      />
    </group>
  );
}

/** Four IBC totes. Their methanol level rises during the last state of the journey. */
function StorageUnit() {
  const frame = useJourneyFrame();
  const liquids = useRef<THREE.Mesh[]>([]);
  const { x0, x1, z0, z1 } = STORAGE;
  const tote = { w: 1.2, d: 1.0, h: 1.15 };
  const xs = [0, 1, 2, 3].map((k) => x0 + 1.2 + k * 1.75);

  useFrame(() => {
    const fill = 0.3 + 0.6 * smoothstep(905, 990, frame.current.at);
    liquids.current.forEach((mesh) => {
      mesh.scale.y = fill;
      mesh.position.y = SLAB_HEIGHT + 0.2 + (tote.h * fill) / 2;
    });
  });

  return (
    <group>
      <Slab x0={x0} x1={x1} z0={z0} z1={z1} />
      {xs.map((x, k) => (
        <group key={x}>
          {/* Pallet base. */}
          <mesh position={[x, SLAB_HEIGHT + 0.08, (z0 + z1) / 2]}>
            <boxGeometry args={[tote.w, 0.16, tote.d]} />
            <meshStandardMaterial color="#cfc6b4" roughness={1} />
          </mesh>
          {/* Translucent tank with a steel cage drawn by its edges. */}
          <mesh position={[x, SLAB_HEIGHT + 0.2 + tote.h / 2, (z0 + z1) / 2]}>
            <boxGeometry args={[tote.w, tote.h, tote.d, 3, 3, 3]} />
            <meshStandardMaterial color={COLORS.tote} roughness={0.3} transparent opacity={0.45} depthWrite={false} />
            <Ink opacity={0.7} />
          </mesh>
          <mesh
            ref={(mesh) => {
              if (mesh) liquids.current[k] = mesh;
            }}
            position={[x, SLAB_HEIGHT + 0.4, (z0 + z1) / 2]}
          >
            <boxGeometry args={[tote.w - 0.08, tote.h - 0.06, tote.d - 0.08]} />
            <meshStandardMaterial color={COLORS.methanol} roughness={0.15} transparent opacity={0.85} />
          </mesh>
        </group>
      ))}
      <Canopy x0={x0} x1={x1} z0={z0} z1={z1} height={3.6} />
    </group>
  );
}

/** The gold biogas line with gas moving along it: biogas colours before the reactor, methanol after. */
function BiogasLine() {
  const frame = useJourneyFrame();
  const curve = useMemo(() => new THREE.CatmullRomCurve3(PIPE_PATH, false, "catmullrom", 0.2), []);
  const tube = useMemo(() => new THREE.TubeGeometry(curve, 240, 0.13, 10, false), [curve]);
  const count = 220;
  const cloud = useGlowPoints(count, { additive: false });
  const particles = useMemo(() => {
    const random = seeded(31);
    return Array.from({ length: count }, () => ({ phase: random(), speed: 0.018 + random() * 0.01, lane: random() }));
  }, []);
  const biogas = useMemo(() => [new THREE.Color("#1a9645"), new THREE.Color("#b8860b")], []);
  const methanol = useMemo(() => new THREE.Color("#121a14"), []);
  const point = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => () => tube.dispose(), [tube]);

  const group = useRef<THREE.Group>(null);

  useFrame(() => {
    const { time, dark, at } = frame.current;
    // The outside line would sit between the camera and the reactors while we are inside.
    if (group.current) group.current.visible = at < 370 || at > 905;
    const visible = 1 - dark;
    particles.forEach((p, i) => {
      const u = (p.phase + time * p.speed) % 1;
      curve.getPointAt(u, point);
      cloud.positions.set([point.x, point.y + 0.32, point.z], i * 3);
      const color = u < PIPE_REACTOR_AT ? biogas[p.lane < 0.6 ? 0 : 1] : methanol;
      cloud.colors.set([color.r, color.g, color.b], i * 3);
      cloud.sizes[i] = 0.32;
      cloud.alphas[i] = visible * smoothstep(0, 0.03, u) * (1 - smoothstep(0.97, 1, u));
    });
    cloud.commit();
  });

  const supports = useMemo(() => Array.from({ length: 22 }, (_, i) => curve.getPointAt((i + 0.5) / 22)), [curve]);

  return (
    <group ref={group}>
      <mesh geometry={tube}>
        <meshStandardMaterial color={COLORS.pipe} roughness={0.45} metalness={0.2} />
      </mesh>
      {supports.map((p, i) => (
        <mesh key={i} position={[p.x, p.y / 2, p.z]}>
          <boxGeometry args={[0.1, p.y, 0.1]} />
          <meshStandardMaterial color={COLORS.post} />
        </mesh>
      ))}
      <points geometry={cloud.geometry} material={cloud.material} frustumCulled={false} />
    </group>
  );
}

/** A gable roof: a triangle (span × rise) extruded along the building's length (x axis). */
function PitchedRoof({ length, span, rise, y }: { length: number; span: number; rise: number; y: number }) {
  const geometry = useMemo(() => {
    const triangle = new THREE.Shape([
      new THREE.Vector2(-span / 2 - 0.4, 0),
      new THREE.Vector2(span / 2 + 0.4, 0),
      new THREE.Vector2(0, rise),
    ]);
    const roof = new THREE.ExtrudeGeometry(triangle, { depth: length + 0.8, bevelEnabled: false });
    roof.translate(0, 0, -(length + 0.8) / 2);
    roof.rotateY(Math.PI / 2);
    return roof;
  }, [length, span, rise]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return (
    <mesh geometry={geometry} position={[0, y, 0]}>
      <meshStandardMaterial color="#c6cec8" roughness={1} />
      <Ink opacity={0.4} />
    </mesh>
  );
}

/** The palm oil mill in the background: sheds, a boiler chimney and storage tanks. */
function PalmOilMill() {
  const sheds = [
    { x: 58, z: -38, w: 34, d: 14, h: 8 },
    { x: 84, z: -20, w: 22, d: 12, h: 7 },
    { x: 46, z: -62, w: 26, d: 12, h: 6.5 },
  ];
  const tanks = [
    { x: 96, z: 8, r: 5, h: 9 },
    { x: 108, z: 8, r: 5, h: 9 },
    { x: 102, z: -5, r: 4, h: 8 },
  ];
  return (
    <group>
      {sheds.map((s) => (
        <group key={`${s.x}-${s.z}`} position={[s.x, 0, s.z]}>
          <mesh position={[0, s.h / 2, 0]}>
            <boxGeometry args={[s.w, s.h, s.d]} />
            <meshStandardMaterial color="#ebe6da" roughness={1} />
            <Ink opacity={0.4} />
          </mesh>
          <PitchedRoof length={s.w} span={s.d} rise={2.6} y={s.h} />
        </group>
      ))}
      <mesh position={[70, 13, -28]}>
        <cylinderGeometry args={[0.7, 1.0, 26, 16]} />
        <meshStandardMaterial color="#dcd7cb" roughness={1} />
        <Ink opacity={0.4} />
      </mesh>
      {tanks.map((t) => (
        <mesh key={`${t.x}-${t.z}`} position={[t.x, t.h / 2, t.z]}>
          <cylinderGeometry args={[t.r, t.r, t.h, 32]} />
          <meshStandardMaterial color="#e9e3d6" roughness={0.9} />
          <Ink opacity={0.4} />
        </mesh>
      ))}
    </group>
  );
}

export default function Plant() {
  return (
    <group>
      <PretreatmentUnit />
      <ReactorContainer />
      <StorageUnit />
      <BiogasLine />
      <PalmOilMill />
    </group>
  );
}
