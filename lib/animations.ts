import type { Variants } from "framer-motion";

// Fast start, long soft settle. Reads as precise rather than bouncy.
export const easeOutExpo = [0.16, 1, 0.3, 1] as const;

export const staggerContainer: Variants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.09 } },
};

export const staggerItem: Variants = {
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.9, ease: easeOutExpo } },
};

// Shared viewport options for scroll-triggered reveals.
export const revealViewport = { once: true, margin: "-12% 0px" } as const;
