"use client";
import { useEffect, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { createGlowPointsGeometry, createGlowPointsMaterial } from "@/lib/three/glowPoints";

/**
 * A glow-point cloud with typed arrays to write each frame. Call `commit()` after writing.
 * Keeps the material's pixel-ratio and viewport uniforms in sync with the canvas.
 */
export function useGlowPoints(count: number, { additive = true } = {}) {
  const { gl, size } = useThree();
  const geometry = useMemo(() => createGlowPointsGeometry(count), [count]);
  const material = useMemo(() => createGlowPointsMaterial({ additive }), [additive]);

  useEffect(() => () => {
    geometry.dispose();
    material.dispose();
  }, [geometry, material]);

  useFrame(() => {
    material.uniforms.uPixelRatio.value = gl.getPixelRatio();
    material.uniforms.uViewportHeight.value = size.height;
  });

  return useMemo(
    () => ({
      geometry,
      material,
      positions: geometry.attributes.position.array as Float32Array,
      colors: geometry.attributes.aColor.array as Float32Array,
      sizes: geometry.attributes.aSize.array as Float32Array,
      alphas: geometry.attributes.aAlpha.array as Float32Array,
      commit() {
        geometry.attributes.position.needsUpdate = true;
        geometry.attributes.aColor.needsUpdate = true;
        geometry.attributes.aSize.needsUpdate = true;
        geometry.attributes.aAlpha.needsUpdate = true;
      },
    }),
    [geometry, material],
  );
}
