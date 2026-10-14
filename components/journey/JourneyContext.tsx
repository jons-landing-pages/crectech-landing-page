"use client";
import { createContext, useContext } from "react";

/**
 * Live values shared by every object in the journey scene. They change every frame, so they are
 * refs read inside useFrame, never React state.
 */
export interface JourneyFrame {
  /** Smoothed scroll position on the timeline, 0…1000. */
  at: number;
  /** Camera distance to its target, in metres. Drives fog, near plane and layer visibility. */
  distance: number;
  /** 0 on paper (macro world), 1 on carbon (inside the reactor). */
  dark: number;
  /** Seconds since the scene started, frozen for reduced motion. */
  time: number;
}

export const JourneyContext = createContext<{ current: JourneyFrame } | null>(null);

export function useJourneyFrame() {
  const frame = useContext(JourneyContext);
  if (!frame) throw new Error("useJourneyFrame must be used inside the journey scene");
  return frame;
}
