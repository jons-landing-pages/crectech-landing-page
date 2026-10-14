"use client";
import { useEffect } from "react";
import { useThree } from "@react-three/fiber";

/**
 * Prepares the scene for the GPU as soon as it mounts, while the visitor is still reading the page
 * above it, so that scrolling into the scene does not stall.
 *
 * 1. Compiles every material, hidden ones included. Without this, three.js compiles a material the
 *    first time its object comes into view, and the browser waits for that compile in the middle of
 *    a scroll: up to several seconds on a first visit or a slow GPU. `compileAsync` uses the
 *    KHR_parallel_shader_compile extension where the browser has it, so this runs off the main thread.
 * 2. Draws one frame, which uploads the geometry and renders the environment map.
 *
 * Mount it as the last child of the scene, so the fog, environment and instance colours that other
 * components add in their own effects are in place before the compile.
 */
export default function SceneWarmup() {
  const { gl, scene, camera, advance } = useThree();

  useEffect(() => {
    let mounted = true;
    const warm = async () => {
      await gl.compileAsync(scene, camera);
      if (mounted) advance(performance.now());
    };
    // Start when the browser is idle, so the work does not compete with hydration.
    if (typeof window.requestIdleCallback === "function") {
      const handle = window.requestIdleCallback(warm, { timeout: 1500 });
      return () => {
        mounted = false;
        window.cancelIdleCallback(handle);
      };
    }
    const timer = window.setTimeout(warm, 200);
    return () => {
      mounted = false;
      window.clearTimeout(timer);
    };
  }, [gl, scene, camera, advance]);

  return null;
}
