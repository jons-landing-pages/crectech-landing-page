"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Canvas, type CanvasProps } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";

const ReducedMotionContext = createContext(false);

/** True when the visitor asked the system for reduced motion. Scenes then hold a still pose. */
export const useReducedMotion = () => useContext(ReducedMotionContext);

interface SceneCanvasProps extends Omit<CanvasProps, "frameloop" | "children" | "dpr"> {
  children: React.ReactNode;
  className?: string;
  /** Shown instead of the scene when WebGL is unavailable. */
  fallback?: React.ReactNode;
  /** Highest device pixel ratio to render at, on screens that have it. */
  maxDpr?: number;
}

/**
 * Shared WebGL canvas wrapper:
 * - renders frames only while the canvas is on screen,
 * - caps the device pixel ratio so large retina screens stay smooth, and drops it to 1 when the
 *   frame rate falls (older or integrated GPUs),
 * - renders a single still frame for reduced-motion visitors.
 */
export default function SceneCanvas({ children, className = "", fallback, maxDpr = 1.75, ...props }: SceneCanvasProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [onScreen, setOnScreen] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [slowGpu, setSlowGpu] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(query.matches);
    const onChange = () => setReducedMotion(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const element = wrapperRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), {
      rootMargin: "200px 0px",
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const frameloop = reducedMotion ? "demand" : onScreen ? "always" : "never";

  return (
    <div ref={wrapperRef} className={className} aria-hidden="true">
      <Canvas
        frameloop={frameloop}
        dpr={slowGpu ? 1 : [1, maxDpr]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        fallback={fallback}
        {...props}
      >
        {/* Measures the frame rate only while frames run continuously; pauses would read as slow frames.
            After 2.5 s below 40 fps (60 on high-refresh screens) the scene renders at pixel ratio 1 for
            the rest of the visit. It does not switch back, so a borderline GPU does not flicker between the two. */}
        {frameloop === "always" && <PerformanceMonitor onDecline={() => setSlowGpu(true)} />}
        <ReducedMotionContext.Provider value={reducedMotion}>{children}</ReducedMotionContext.Provider>
      </Canvas>
    </div>
  );
}
