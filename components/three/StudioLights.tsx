"use client";
import { Environment, Lightformer } from "@react-three/drei";

/**
 * Light rig for dark scenes. Reflections come from a procedural environment made of light panels
 * (no HDRI download): a soft white key from top left, a green rim from behind, a gold fill from below.
 */
export default function StudioLights() {
  return (
    <>
      <ambientLight intensity={0.15} />
      <directionalLight position={[-4, 6, 5]} intensity={2.2} color="#fff6e8" />
      <directionalLight position={[5, -1, -6]} intensity={1.3} color="#3fd47a" />
      <pointLight position={[0, -4, 3]} intensity={18} distance={14} color="#d9a92c" />
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={2.5} color="#ffffff" position={[-5, 5, 5]} scale={[6, 4, 1]} />
        <Lightformer form="rect" intensity={1.4} color="#3fd47a" position={[6, 0, -5]} scale={[3, 8, 1]} />
        <Lightformer form="ring" intensity={1.5} color="#d9a92c" position={[0, -6, 2]} scale={4} />
      </Environment>
    </>
  );
}
