"use client";
import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGlowPoints } from "@/components/three/useGlowPoints";
import { channelCentres, PELLET } from "@/lib/three/pellet";
import { palette } from "@/lib/three/palette";
import { seeded, smoothstep } from "@/lib/three/random";
import { useReducedMotion } from "@/components/three/SceneCanvas";

/**
 * Gas flowing through the pellet's seven channels, in pellet-local space (axis +z).
 * Upstream: raw biogas and steam — CH₄ (green), CO₂ (gold), H₂O (pale blue).
 * Downstream: syngas — H₂ (white) and CO (light gold), two H₂ for every CO.
 */

/** How far upstream and downstream of the pellet the stream runs, in pellet radii. */
const TRAVEL = 7;
/** Upstream the gas arrives from a wide cloud of this radius. */
const FUNNEL_SPREAD = 2.6;
/** Downstream the jets widen to this fraction of the upstream spread. */
const JET_SPREAD = 0.35;

const scratchColor = new THREE.Color();
const channels = channelCentres();

/** Gas colours per background: glowing light colours on carbon, solid darker inks on paper. */
const gasColors = {
  dark: {
    inlet: [
      [0.5, palette.green], // CH₄ — biogas is about 60% methane
      [0.82, palette.gold], // CO₂ — about 40%
      [1, palette.steam], // H₂O steam
    ] as [number, THREE.Color][],
    hydrogen: palette.paper,
    carbonMonoxide: palette.goldLight,
  },
  light: {
    inlet: [
      [0.5, palette.brandGreen],
      [0.82, new THREE.Color("#b8860b")],
      [1, new THREE.Color("#3f8fae")],
    ] as [number, THREE.Color][],
    hydrogen: palette.ink,
    carbonMonoxide: new THREE.Color("#b8860b"),
  },
};

interface GasStreamProps {
  count?: number;
  speed?: number;
  /** World size of one pellet-local unit, when the stream sits in a scaled group. */
  sizeScale?: number;
  /** Overall opacity, for fading the stream in and out. */
  opacity?: { current: number };
  /** Background the stream sits on; additive glow vanishes on paper. */
  tone?: "light" | "dark";
}

export default function GasStream({ count = 700, speed = 1, sizeScale = 1, opacity, tone = "dark" }: GasStreamProps) {
  const reducedMotion = useReducedMotion();
  const cloud = useGlowPoints(count, { additive: tone === "dark" });
  const colors = gasColors[tone];

  const particles = useMemo(() => {
    const random = seeded(77);
    return Array.from({ length: count }, () => {
      const channel = Math.floor(random() * channels.length);
      const angle = random() * Math.PI * 2;
      const radius = Math.sqrt(random()) * channels[channel].radius * 0.65;
      const wideAngle = random() * Math.PI * 2;
      const wideRadius = 0.6 + random() * FUNNEL_SPREAD;
      const pick = random();
      return {
        channel,
        offsetX: Math.cos(angle) * radius,
        offsetY: Math.sin(angle) * radius,
        wideX: Math.cos(wideAngle) * wideRadius,
        wideY: Math.sin(wideAngle) * wideRadius,
        speed: 0.55 + random() * 0.7,
        phase: random() * TRAVEL * 2,
        inlet: colors.inlet.find(([threshold]) => pick <= threshold)![1],
        outlet: random() < 2 / 3 ? colors.hydrogen : colors.carbonMonoxide,
        wobble: random() * Math.PI * 2,
      };
    });
  }, [count, colors]);

  useFrame(({ clock }) => {
    const time = reducedMotion ? 4 : clock.elapsedTime * speed;
    const fade = opacity ? opacity.current : 1;
    const halfLength = PELLET.length / 2;

    particles.forEach((p, i) => {
      // z runs from −TRAVEL to +TRAVEL and wraps.
      const z = ((time * p.speed + p.phase) % (TRAVEL * 2)) - TRAVEL;
      const channel = channels[p.channel];
      const inChannelX = channel.x + p.offsetX;
      const inChannelY = channel.y + p.offsetY;

      // 0 inside the pellet, rising to 1 far from either face.
      const upstream = smoothstep(-halfLength, -TRAVEL * 0.85, z);
      const downstream = smoothstep(halfLength, TRAVEL * 0.9, z);
      const spread = Math.max(upstream, downstream * JET_SPREAD);
      const swirl = Math.sin(time * 1.3 + p.wobble + z * 0.8) * 0.08 * spread;

      cloud.positions[i * 3] = THREE.MathUtils.lerp(inChannelX, inChannelX + p.wideX, spread) + swirl;
      cloud.positions[i * 3 + 1] = THREE.MathUtils.lerp(inChannelY, inChannelY + p.wideY, spread) - swirl;
      cloud.positions[i * 3 + 2] = z;

      // The reaction happens inside the channel: colour switches over its length.
      const reacted = smoothstep(-halfLength * 0.4, halfLength * 0.6, z);
      const color = scratchColor.copy(p.inlet).lerp(p.outlet, reacted);
      cloud.colors.set([color.r, color.g, color.b], i * 3);
      cloud.sizes[i] = THREE.MathUtils.lerp(0.13, 0.1, reacted) * sizeScale;
      // Fade in at the far upstream end and out at the far downstream end.
      cloud.alphas[i] = fade * smoothstep(-TRAVEL, -TRAVEL * 0.6, z) * (1 - smoothstep(TRAVEL * 0.55, TRAVEL, z));
    });
    cloud.commit();
  });

  return <points geometry={cloud.geometry} material={cloud.material} frustumCulled={false} />;
}
