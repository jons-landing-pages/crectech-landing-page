"use client";
import { motion } from "framer-motion";
import { easeOutExpo, revealViewport } from "@/lib/animations";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  /** Vertical travel in pixels before the element settles. */
  y?: number;
}

/** Fades and lifts its children into place when they scroll into view. */
export default function Reveal({ children, className, delay = 0, y = 28 }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={revealViewport}
      transition={{ duration: 0.9, ease: easeOutExpo, delay }}
    >
      {children}
    </motion.div>
  );
}
