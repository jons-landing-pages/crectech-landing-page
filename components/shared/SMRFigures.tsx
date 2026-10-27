"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { easeOutExpo } from "@/lib/animations";

// Annual global footprint of conventional steam methane reforming (SMR).
const figures = [
  { value: 81, label: "Natural gas burned as fuel" },
  { value: 270, label: "Water consumed" },
  { value: 420, label: "CO₂ emitted" },
];
const largestValue = Math.max(...figures.map((f) => f.value));
const COUNT_DURATION_MS = 1600;

function useCountUp(target: number, active: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCount(target);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / COUNT_DURATION_MS, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.round(eased * target));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, active]);
  return count;
}

function FigureRow({ value, label, index }: { value: number; label: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const count = useCountUp(value, inView);

  return (
    <div ref={ref} className="border-t border-line py-6">
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-sm text-ink/60">{label}</p>
        <p className="font-display text-4xl font-extrabold tabular-nums md:text-5xl">
          {count}
          <span className="ml-1 text-lg font-semibold text-ink/50 md:text-xl">M t/yr</span>
        </p>
      </div>
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-ink/[0.06]">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-accent to-[#c4532b]"
          initial={{ width: 0 }}
          animate={inView ? { width: `${(value / largestValue) * 100}%` } : undefined}
          transition={{ duration: 1.6, ease: easeOutExpo, delay: index * 0.1 }}
        />
      </div>
    </div>
  );
}

/** Animated bars for the yearly resource and emission cost of SMR methanol. */
export default function SMRFigures() {
  return (
    <div>
      {figures.map((figure, i) => (
        <FigureRow key={figure.label} index={i} {...figure} />
      ))}
      <p className="label border-t border-line pt-4 text-ink/40">
        Global steam methane reforming · million tonnes per year
      </p>
    </div>
  );
}
