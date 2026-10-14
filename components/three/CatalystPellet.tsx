"use client";
import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Edges, type EdgesRef } from "@react-three/drei";
import * as THREE from "three";
import { createCeramicTexture, createPelletGeometry } from "@/lib/three/pellet";
import { palette } from "@/lib/three/palette";

interface CatalystPelletProps {
  /** Pen-line colour along the pellet's sharp edges. */
  edgeColor?: THREE.ColorRepresentation;
  edgeOpacity?: number;
  /** Optional live opacity (0…1), read every frame, for fading the pellet in and out. */
  fade?: { current: number };
}

/** One ceramic CRecREF™ pellet with technical-drawing edge lines. Axis along local +z. */
export default function CatalystPellet({ edgeColor = palette.paper, edgeOpacity = 0.4, fade }: CatalystPelletProps) {
  const geometry = useMemo(() => createPelletGeometry(), []);
  const grain = useMemo(() => createCeramicTexture(), []);
  const mesh = useRef<THREE.Mesh>(null);
  const material = useRef<THREE.MeshPhysicalMaterial>(null);
  const edges = useRef<EdgesRef>(null);

  useEffect(() => () => {
    geometry.dispose();
    grain.dispose();
  }, [geometry, grain]);

  useFrame(() => {
    if (!fade || !material.current || !mesh.current) return;
    const opacity = fade.current;
    mesh.current.visible = opacity > 0.01;
    material.current.transparent = opacity < 1;
    material.current.opacity = opacity;
    if (edges.current) edges.current.material.opacity = edgeOpacity * opacity;
  });

  return (
    <mesh ref={mesh} geometry={geometry}>
      <meshPhysicalMaterial
        ref={material}
        color={palette.ceramic}
        roughness={0.82}
        roughnessMap={grain}
        bumpMap={grain}
        bumpScale={0.6}
        sheen={0.25}
        sheenColor={palette.green}
        sheenRoughness={0.6}
      />
      <Edges ref={edges} threshold={24} color={edgeColor} transparent opacity={edgeOpacity} />
    </mesh>
  );
}
