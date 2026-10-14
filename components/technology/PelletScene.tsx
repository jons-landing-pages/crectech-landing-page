"use client";
import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { ContactShadows } from "@react-three/drei";
import CatalystPellet from "@/components/three/CatalystPellet";
import GasStream from "@/components/three/GasStream";
import SceneCanvas, { useReducedMotion } from "@/components/three/SceneCanvas";
import StudioLights from "@/components/three/StudioLights";
import { palette } from "@/lib/three/palette";
import { easeOutExpo } from "@/lib/three/random";

const MOBILE_BREAKPOINT = 768;
/** Seconds for the pellet to settle into place on load. */
const ENTRANCE_SECONDS = 2.2;
/** Slow spin of the pellet around its own axis, radians per second. */
const SPIN_SPEED = 0.12;

type Tone = "light" | "dark";

function Pellet({ tone }: { tone: Tone }) {
  // On paper the pellet floats in open space, so it is drawn a little smaller.
  const baseScale = tone === "light" ? 0.78 : 1;
  const group = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const reducedMotion = useReducedMotion();
  const { size } = useThree();
  const mobile = size.width < MOBILE_BREAKPOINT;

  useFrame(({ clock, pointer }, delta) => {
    if (!group.current || !spin.current) return;
    const entrance = reducedMotion ? 1 : easeOutExpo(Math.min(clock.elapsedTime / ENTRANCE_SECONDS, 1));

    // The axis points right and towards the camera, so gas flows out of the visible face.
    const baseYaw = 0.8;
    const basePitch = 0.36;
    const tiltX = reducedMotion ? 0 : pointer.y * 0.18;
    const tiltY = reducedMotion ? 0 : pointer.x * 0.25;
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, basePitch - tiltX, 3, delta);
    group.current.rotation.y = THREE.MathUtils.damp(
      group.current.rotation.y,
      baseYaw + tiltY - (1 - entrance) * 1.6,
      3,
      delta,
    );
    group.current.scale.setScalar(baseScale * (mobile ? 0.85 : 1) * (0.6 + 0.4 * entrance));
    spin.current.rotation.z = reducedMotion ? 0.3 : clock.elapsedTime * SPIN_SPEED;
  });

  return (
    <group ref={group}>
      <group ref={spin}>
        <CatalystPellet edgeColor={tone === "light" ? palette.ink : palette.paper} edgeOpacity={tone === "light" ? 0.3 : 0.4} />
        <GasStream count={mobile ? 450 : 950} tone={tone} sizeScale={tone === "light" ? 0.42 : 1} />
      </group>
    </group>
  );
}

/** Soft daylight for the pellet floating on paper: no coloured rim light, so the ceramic reads white. */
function PaperLights() {
  return (
    <>
      <hemisphereLight args={["#ffffff", "#d9d4c6", 1.6]} />
      <directionalLight position={[-4, 6, 5]} intensity={2.4} color="#fffaf0" />
      <directionalLight position={[5, 1, 4]} intensity={0.8} color="#f4efe2" />
    </>
  );
}

/** The CRecREF™ pellet with biogas flowing through it; tilts towards the pointer. */
export default function PelletScene({ tone = "dark" }: { tone?: Tone }) {
  return (
    <SceneCanvas className="h-full w-full" camera={{ position: [0, 0, 6.2], fov: 32 }}>
      {tone === "dark" ? <StudioLights /> : <PaperLights />}
      <Pellet tone={tone} />
      {tone === "light" && (
        <ContactShadows position={[0, -1.35, 0]} opacity={0.28} scale={6} blur={2.8} far={3} color="#121a14" />
      )}
    </SceneCanvas>
  );
}
