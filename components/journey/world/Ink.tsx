"use client";
import { Edges } from "@react-three/drei";

/** Pen-line outline on a mesh's sharp edges: the technical-drawing look of the macro world. */
export default function Ink({ light = false, opacity = 0.6 }: { light?: boolean; opacity?: number }) {
  return <Edges threshold={20} color={light ? "#f3f1ea" : "#121a14"} transparent opacity={opacity} />;
}
