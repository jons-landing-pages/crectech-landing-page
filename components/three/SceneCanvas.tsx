"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Canvas, type CanvasProps } from "@react-three/fiber";

const ReducedMotionContext = createContext(false);

/** True when the visitor asked the system for reduced motion. Scenes then hold a still pose. */
export const useReducedMotion = () => useContext(ReducedMotionContext);

interface SceneCanvasProps extends Omit<CanvasProps, "frameloop" | "children"> {
  children: React.ReactNode;
  className?: string;
  /** Shown instead of the scene when WebGL is unavailable. */
  fallback?: React.ReactNode;
}

/**
 * Shared WebGL canvas wrapper:
 * - renders frames only while the canvas is on screen,
 * - caps the device pixel ratio so large retina screens stay smooth,
 * - renders a single still frame for reduced-motion visitors.
 */
export default function SceneCanvas({ children, className = "", fallback, ...props }: SceneCanvasProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [onScreen, setOnScreen] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

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
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        fallback={fallback}
        {...props}
      >
        <ReducedMotionContext.Provider value={reducedMotion}>{children}</ReducedMotionContext.Provider>
      </Canvas>
    </div>
  );
}
