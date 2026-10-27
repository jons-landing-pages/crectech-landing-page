import * as THREE from "three";
import { seeded } from "@/lib/three/random";

/**
 * The CRecREF™ catalyst pellet, drawn from the photo in the pitch deck (WO/2023/146478):
 * a short ceramic cylinder with one centre channel and six channels around it.
 * All sizes are relative to the pellet radius R = 1.
 */
export const PELLET = {
  radius: 1,
  length: 1.25,
  /** Lobe depth of the outer wall, as a fraction of R. The lobes sit outside each ring channel. */
  lobeDepth: 0.035,
  ringChannelRadius: 0.13,
  centreChannelRadius: 0.15,
  /** Distance of the six ring channels from the axis, as a fraction of R. */
  ringDistance: 0.56,
} as const;

const RING_CHANNELS = 6;

/** Centres of the seven gas channels, in pellet-local x/y. */
export function channelCentres(): { x: number; y: number; radius: number }[] {
  const centres: { x: number; y: number; radius: number }[] = [{ x: 0, y: 0, radius: PELLET.centreChannelRadius }];
  for (let k = 0; k < RING_CHANNELS; k += 1) {
    const angle = (k / RING_CHANNELS) * Math.PI * 2;
    centres.push({
      x: Math.cos(angle) * PELLET.ringDistance,
      y: Math.sin(angle) * PELLET.ringDistance,
      radius: PELLET.ringChannelRadius,
    });
  }
  return centres;
}

/**
 * Extruded pellet with its axis along +z, centred on the origin. `low` detail is for the hundreds
 * of instanced pellets packed in a reactor; `high` is for the close-ups.
 */
export function createPelletGeometry(detail: "high" | "low" = "high"): THREE.BufferGeometry {
  const high = detail === "high";
  const outline = new THREE.Shape();
  const segments = high ? 120 : 30;
  for (let i = 0; i <= segments; i += 1) {
    const theta = (i / segments) * Math.PI * 2;
    const r = PELLET.radius * (1 - PELLET.lobeDepth + PELLET.lobeDepth * Math.cos(RING_CHANNELS * theta));
    if (i === 0) outline.moveTo(r * Math.cos(theta), r * Math.sin(theta));
    else outline.lineTo(r * Math.cos(theta), r * Math.sin(theta));
  }
  for (const channel of channelCentres()) {
    const hole = new THREE.Path();
    hole.absarc(channel.x, channel.y, channel.radius, 0, Math.PI * 2, true);
    outline.holes.push(hole);
  }

  const bevel = high ? 0.045 : 0;
  const geometry = new THREE.ExtrudeGeometry(outline, {
    depth: PELLET.length - bevel * 2,
    bevelEnabled: high,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 4,
    curveSegments: high ? 40 : 8,
  });
  geometry.center();
  geometry.computeVertexNormals();
  return geometry;
}

/**
 * A small grey noise texture for the ceramic surface (used as bump and roughness map).
 * Seeded, so the grain is the same on every load.
 */
export function createCeramicTexture(size = 256): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const context = canvas.getContext("2d")!;
  const image = context.createImageData(size, size);
  const random = seeded(4242);
  for (let i = 0; i < size * size; i += 1) {
    // Two octaves: fine grain plus occasional darker pits.
    const grain = 150 + random() * 70;
    const pit = random() < 0.012 ? -70 : 0;
    const value = Math.max(0, Math.min(255, grain + pit));
    image.data.set([value, value, value, 255], i * 4);
  }
  context.putImageData(image, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 3);
  return texture;
}
