"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Reveal from "@/components/ui/Reveal";
import SectionLabel from "@/components/ui/SectionLabel";
import { easeOutExpo, revealViewport } from "@/lib/animations";
import { PILOT_START, roadmap } from "@/lib/site";

// Chart geometry (SVG user units). Capacity runs on a log scale from 0.0001 to 1,000,000 t/yr.
const CHART = { width: 1000, height: 380, left: 80, right: 90, top: 40, bottom: 40 };
const LOG_MIN = -4;
const LOG_MAX = 6;
const ticks = [
  { log: -3, label: "1 kg/yr" },
  { log: 0, label: "1 t/yr" },
  { log: 3, label: "1 kt/yr" },
  { log: 6, label: "1 Mt/yr" },
];

const xAt = (i: number) =>
  CHART.left + (i / (roadmap.length - 1)) * (CHART.width - CHART.left - CHART.right);
const yAt = (tonnes: number) => {
  const t = (Math.log10(tonnes) - LOG_MIN) / (LOG_MAX - LOG_MIN);
  return CHART.top + (1 - t) * (CHART.height - CHART.top - CHART.bottom);
};

function daysUntil(isoDate: string) {
  const target = new Date(`${isoDate}T00:00:00+07:00`).getTime(); // Western Indonesia Time
  return Math.ceil((target - Date.now()) / 86_400_000);
}

function PilotCountdown() {
  // Computed after hydration, so the server and client render the same first frame.
  const [days, setDays] = useState<number | null>(null);
  useEffect(() => setDays(daysUntil(PILOT_START)), []);
  const upcoming = days !== null && days > 0;

  return (
    <div className="grain relative overflow-hidden rounded-3xl bg-carbon p-7 text-paper md:p-9">
      <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-primary/40 blur-[90px]" />
      <div className="relative">
        <p className="label text-primary-light">Sei Mangkei pilot · with Pertamina NRE</p>
        <p className="font-display mt-6 text-6xl font-extrabold tabular-nums md:text-7xl">
          {upcoming ? days : "Dec 2026"}
          {upcoming && <span className="ml-3 text-2xl font-semibold text-paper/60">days</span>}
        </p>
        <p className="mt-2 text-paper/65">
          {upcoming ? "until the planned start-up on 10 December 2026." : "Planned start-up: 10 December 2026."}
        </p>
        <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-line-dark">
          <div className="bg-carbon p-4">
            <dt className="label text-paper/45">Capacity</dt>
            <dd className="font-display mt-1 text-2xl font-bold">50 t/yr</dd>
          </div>
          <div className="bg-carbon p-4">
            <dt className="label text-paper/45">CO₂eq avoided</dt>
            <dd className="font-display mt-1 text-2xl font-bold">450 t/yr</dd>
          </div>
        </dl>
        <p className="mt-6 text-sm leading-relaxed text-paper/60">
          At 1,000 mills, each making about 7,000 tonnes a year, the avoided emissions would reach about 65 million
          tonnes of CO₂eq a year, close to 0.2% of global emissions.
        </p>
      </div>
    </div>
  );
}

export default function RoadmapSection() {
  const points = roadmap.map((stage, i) => [xAt(i), yAt(stage.tonnesPerYear)] as const);
  const doneUntil = roadmap.findIndex((stage) => stage.status === "now");

  return (
    <section className="bg-paper py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-10 md:grid-cols-12 md:items-end">
          <Reveal className="md:col-span-8">
            <SectionLabel index="03">Scale-up</SectionLabel>
            <h2 className="font-display mt-6 text-[clamp(1.9rem,3.3vw,3rem)] font-extrabold leading-[1.02]">
              The process has grown from one gram of methanol a day in 2022 to a 50-tonne-a-year pilot in 2026.
            </h2>
          </Reveal>
          <Reveal className="md:col-span-4" delay={0.1}>
            <p className="leading-relaxed text-ink/65">
              Each stage runs the same CRecREF™ chemistry at a larger size. The chart uses a log scale, so every
              gridline is a thousand times the one below it.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-12">
          <Reveal className="rounded-3xl border border-line bg-paper-2/50 p-4 md:p-8 lg:col-span-8">
            <svg viewBox={`0 0 ${CHART.width} ${CHART.height + 120}`} className="w-full" role="img" aria-label="Methanol capacity by stage, on a log scale, from 1 gram a day in 2022–23 to 500,000 tonnes a year after 2028">
              {ticks.map((tick) => {
                const y = CHART.top + (1 - (tick.log - LOG_MIN) / (LOG_MAX - LOG_MIN)) * (CHART.height - CHART.top - CHART.bottom);
                return (
                  <g key={tick.label}>
                    <line x1={CHART.left} x2={CHART.width - CHART.right} y1={y} y2={y} stroke="rgba(18,26,20,0.12)" />
                    <text x={CHART.left - 12} y={y + 4} textAnchor="end" fontFamily="var(--font-mono)" fontSize="13" fill="rgba(18,26,20,0.5)">
                      {tick.label}
                    </text>
                  </g>
                );
              })}

              {/* Done part solid, planned part dashed. */}
              <motion.path
                d={points.slice(0, doneUntil + 1).map(([x, y], i) => `${i === 0 ? "M" : "L"}${x} ${y}`).join(" ")}
                fill="none"
                stroke="#1a9645"
                strokeWidth="3"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={revealViewport}
                transition={{ duration: 1.6, ease: easeOutExpo }}
              />
              <path
                d={points.slice(doneUntil).map(([x, y], i) => `${i === 0 ? "M" : "L"}${x} ${y}`).join(" ")}
                fill="none"
                stroke="#1a9645"
                strokeWidth="2"
                strokeDasharray="6 8"
                opacity="0.6"
              />

              {roadmap.map((stage, i) => {
                const [x, y] = points[i];
                const now = stage.status === "now";
                return (
                  <motion.g
                    key={stage.stage}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={revealViewport}
                    transition={{ duration: 0.6, delay: 0.3 + i * 0.25 }}
                  >
                    {now && <circle cx={x} cy={y} r="18" fill="none" stroke="#3fd47a" strokeWidth="2" className="animate-pulse" />}
                    <circle
                      cx={x}
                      cy={y}
                      r="8"
                      fill={stage.status === "next" ? "#f3f1ea" : "#1a9645"}
                      stroke="#1a9645"
                      strokeWidth="2.5"
                    />
                    <text x={x} y={y - 22} textAnchor="middle" fontFamily="var(--font-archivo)" fontWeight="700" fontSize="17" fill="#121a14">
                      {stage.capacity}
                    </text>
                    <text x={x} y={CHART.height + 30} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="13" fill="#1a9645">
                      {stage.years}
                    </text>
                    <foreignObject x={x - 85} y={CHART.height + 42} width="170" height="60">
                      <p className="text-center text-[13px] leading-snug text-ink/70">{stage.stage}</p>
                    </foreignObject>
                  </motion.g>
                );
              })}
            </svg>
          </Reveal>
          <Reveal className="lg:col-span-4" delay={0.15}>
            <PilotCountdown />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
