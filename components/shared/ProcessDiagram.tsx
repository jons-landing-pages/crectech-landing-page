"use client";
import { useEffect, useState } from "react";

/**
 * Process simplification (deck p5), drawn as a flow sheet. Both routes share one x axis:
 * CRecTech's reformer sits where the conventional steam reformer sits, with dashed outlines where
 * the upgrading and conditioning units would be. Coloured particles show what flows in each pipe.
 */

const SPECIES = {
  CH4: { color: "#3fd47a", label: "CH₄" },
  CO2: { color: "#d9a92c", label: "CO₂" },
  H2O: { color: "#9fd3e6", label: "H₂O" },
  H2: { color: "#f3f1ea", label: "H₂" },
  CO: { color: "#f2cf6b", label: "CO" },
  MeOH: { color: "#8ff0b5", label: "CH₃OH" },
} as const;
type Species = keyof typeof SPECIES;

/** A gas mix as [species, share] pairs; particles are coloured in these proportions. */
type Mix = [Species, number][];
const BIOGAS: Mix = [["CH4", 0.6], ["CO2", 0.4]];
const BIOMETHANE: Mix = [["CH4", 1]];
const SYNGAS_SMR: Mix = [["H2", 0.8], ["CO", 0.2]]; // H₂ : CO between 3 and 5 to 1; drawn at 4 : 1
const SYNGAS: Mix = [["H2", 2 / 3], ["CO", 1 / 3]];
const METHANOL: Mix = [["MeOH", 1]];

const VIEW = { width: 1200, height: 640 };
const ROWS = { crectech: 180, conventional: 490 };
const X = { start: 30, v1: 235, v2: 475, v3: 715, v4: 955, end: 1170 };
const VESSEL = { width: 72, height: 112 };
const PARTICLE_SPACING = 26;
const SPEED = 70; // user units per second

/** Pick the species for the i-th particle so a stream shows its mix in the right proportions. */
function speciesAt(mix: Mix, i: number): Species {
  // Golden-ratio sequence spreads the colours evenly instead of in blocks.
  const u = (i * 0.618034) % 1;
  let total = 0;
  for (const [species, share] of mix) {
    total += share;
    if (u < total) return species;
  }
  return mix[mix.length - 1][0];
}

/** Particles moving along an SVG path; negative begin times spread them along it from the start. */
function Flow({ d, length, mix, radius = 4.2 }: { d: string; length: number; mix: Mix; radius?: number }) {
  const count = Math.max(2, Math.round(length / PARTICLE_SPACING));
  const duration = length / SPEED;
  return (
    <g>
      {Array.from({ length: count }, (_, i) => (
        <circle key={i} r={radius} fill={SPECIES[speciesAt(mix, i)].color}>
          <animateMotion dur={`${duration}s`} repeatCount="indefinite" path={d} begin={`${-(i / count) * duration}s`} />
        </circle>
      ))}
    </g>
  );
}

/** Reduced motion: a still row of particles along the pipe. */
function StillFlow({ x0, x1, y, mix }: { x0: number; x1: number; y: number; mix: Mix }) {
  const count = Math.max(2, Math.round((x1 - x0) / PARTICLE_SPACING));
  return (
    <g>
      {Array.from({ length: count }, (_, i) => (
        <circle key={i} cx={x0 + ((i + 0.5) / count) * (x1 - x0)} cy={y} r={4.2} fill={SPECIES[speciesAt(mix, i)].color} />
      ))}
    </g>
  );
}

/** Horizontal pipe from x0 to x1 at height y, with particles of the given mix. */
function Pipe({ x0, x1, y, mix, animate }: { x0: number; x1: number; y: number; mix: Mix; animate: boolean }) {
  return (
    <g>
      <line x1={x0} x2={x1} y1={y} y2={y} stroke="rgba(243,241,234,0.14)" strokeWidth="14" strokeLinecap="round" />
      {animate ? <Flow d={`M${x0} ${y} H${x1}`} length={x1 - x0} mix={mix} /> : <StillFlow x0={x0} x1={x1} y={y} mix={mix} />}
    </g>
  );
}

/** Vertical side stream into (direction "in") or out of the top of a vessel. */
function SideStream({ x, y, direction, mix, label, animate, tone }: { x: number; y: number; direction: "in" | "out"; mix: Mix; label: string; animate: boolean; tone: string }) {
  const top = y - VESSEL.height / 2 - 52;
  const bottom = y - VESSEL.height / 2;
  const d = direction === "in" ? `M${x} ${top} V${bottom}` : `M${x} ${bottom} V${top - 16}`;
  return (
    <g>
      <line x1={x} x2={x} y1={top} y2={bottom} stroke="rgba(243,241,234,0.12)" strokeWidth="10" strokeLinecap="round" />
      {animate && <Flow d={d} length={bottom - top + (direction === "out" ? 16 : 0)} mix={mix} radius={3.6} />}
      {/* Label beside the stream, so it never collides with the row title above. */}
      <text x={x + 14} y={(top + bottom) / 2 + 4} className="fill-current font-mono text-[13px] tracking-wider" style={{ color: tone }}>
        {direction === "in" ? "↓ " : "↑ "}
        {label}
      </text>
    </g>
  );
}

function Vessel({ x, y, step, lines, variant }: { x: number; y: number; step?: number; lines: string[]; variant: "plain" | "hero" | "ghost" }) {
  const width = variant === "hero" ? VESSEL.width + 22 : VESSEL.width;
  const height = variant === "hero" ? VESSEL.height + 26 : VESSEL.height;
  const top = y - height / 2;
  const styles = {
    plain: { fill: "#1a231d", stroke: "rgba(243,241,234,0.45)", dash: undefined, text: "#f3f1ea" },
    hero: { fill: "url(#reformer)", stroke: "#3fd47a", dash: undefined, text: "#f3f1ea" },
    ghost: { fill: "none", stroke: "rgba(243,241,234,0.25)", dash: "5 6", text: "rgba(243,241,234,0.4)" },
  }[variant];
  return (
    <g>
      {variant === "hero" && <rect x={x - width / 2 - 14} y={top - 14} width={width + 28} height={height + 28} rx={(width + 28) / 2} fill="#3fd47a" opacity="0.12" filter="url(#glow)" />}
      {/* Pressure vessel: a capsule (dished heads) on two legs. */}
      <rect x={x - width / 2} y={top} width={width} height={height} rx={width / 2} fill={styles.fill} stroke={styles.stroke} strokeWidth="1.5" strokeDasharray={styles.dash} />
      {variant !== "ghost" && (
        <>
          <line x1={x - width / 2} x2={x + width / 2} y1={top + width / 2} y2={top + width / 2} stroke={styles.stroke} strokeOpacity="0.4" />
          <line x1={x - width / 2} x2={x + width / 2} y1={top + height - width / 2} y2={top + height - width / 2} stroke={styles.stroke} strokeOpacity="0.4" />
          <line x1={x - width / 3} x2={x - width / 3 - 6} y1={top + height - 6} y2={top + height + 16} stroke={styles.stroke} strokeWidth="1.5" />
          <line x1={x + width / 3} x2={x + width / 3 + 6} y1={top + height - 6} y2={top + height + 16} stroke={styles.stroke} strokeWidth="1.5" />
        </>
      )}
      {step !== undefined && (
        <text x={x} y={y + 5} textAnchor="middle" className="font-mono text-[12px] tracking-widest" fill={variant === "hero" ? "#0a0f0c" : "rgba(243,241,234,0.6)"}>
          {`STEP ${step}`}
        </text>
      )}
      {variant === "ghost" && (
        <text x={x} y={y + 34} textAnchor="middle" className="font-mono text-[10px] tracking-widest" fill="rgba(243,241,234,0.45)">
          NOT NEEDED
        </text>
      )}
      <text x={x} y={top + height + 40} textAnchor="middle" className="text-[15px] font-semibold" fill={styles.text} textDecoration={variant === "ghost" ? "line-through" : undefined}>
        {lines.map((line, i) => (
          <tspan key={line} x={x} dy={i === 0 ? 0 : 18}>
            {line}
          </tspan>
        ))}
      </text>
    </g>
  );
}

/** Stream name above the pipe, with a ratio bar for syngas. */
function StreamTag({ x, y, name, detail, ratio }: { x: number; y: number; name: string; detail: string; ratio?: [number, number] }) {
  return (
    <g>
      <text x={x} y={y - 46} textAnchor="middle" className="text-[14px] font-semibold" fill="#f3f1ea">
        {name}
      </text>
      <text x={x} y={y - 28} textAnchor="middle" className="font-mono text-[12px]" fill="rgba(243,241,234,0.55)">
        {detail}
      </text>
      {ratio && (
        <g transform={`translate(${x - ((ratio[0] + ratio[1]) * 12) / 2}, ${y + 20})`}>
          {Array.from({ length: ratio[0] + ratio[1] }, (_, i) => (
            <rect key={i} x={i * 12} y={0} width={9} height={9} rx={2} fill={i < ratio[0] ? SPECIES.H2.color : SPECIES.CO.color} />
          ))}
        </g>
      )}
    </g>
  );
}

export default function ProcessDiagram() {
  const [animate, setAnimate] = useState(false);
  useEffect(() => setAnimate(!window.matchMedia("(prefers-reduced-motion: reduce)").matches), []);
  const crY = ROWS.crectech;
  const cvY = ROWS.conventional;
  const half = VESSEL.width / 2;

  return (
    <figure>
      <div className="-mx-6 overflow-x-auto px-6 pb-2 md:mx-0 md:px-0">
        <svg viewBox={`0 0 ${VIEW.width} ${VIEW.height}`} className="min-w-[880px] text-paper" role="img" aria-labelledby="process-title">
          <title id="process-title">
            Conventional bio-methanol takes four steps: biogas upgrading vents CO₂, steam methane reforming makes syngas
            at 3 to 5 parts H₂ per CO, conditioning adds CO₂ to reach 2 to 1, then methanol synthesis. CRecTech takes two:
            CRecREF™ reforming of raw biogas with steam gives 2 to 1 syngas directly, then methanol synthesis.
          </title>
          <defs>
            <linearGradient id="reformer" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#3fd47a" />
              <stop offset="1" stopColor="#1a9645" />
            </linearGradient>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="14" />
            </filter>
          </defs>

          {/* Row frames and titles */}
          <rect x="1" y="1" width={VIEW.width - 2} height="300" rx="24" fill="rgba(26,150,69,0.08)" stroke="rgba(63,212,122,0.35)" />
          <text x="28" y="34" className="font-mono text-[13px] tracking-[0.14em]" fill="#3fd47a">
            CRECTECH · 2 STEPS
          </text>
          <text x={VIEW.width - 28} y="34" textAnchor="end" className="font-mono text-[12px] tracking-[0.14em]" fill="rgba(243,241,234,0.45)">
            RAW BIOGAS · CO₂ KEPT AS A REACTANT
          </text>
          <rect x="1" y="320" width={VIEW.width - 2} height={VIEW.height - 321} rx="24" fill="none" stroke="rgba(243,241,234,0.14)" />
          <text x="28" y="354" className="font-mono text-[13px] tracking-[0.14em]" fill="rgba(243,241,234,0.6)">
            CONVENTIONAL · 4 STEPS
          </text>
          <text x={VIEW.width - 28} y="354" textAnchor="end" className="font-mono text-[12px] tracking-[0.14em]" fill="rgba(243,241,234,0.45)">
            CO₂ REMOVED, THEN ADDED BACK
          </text>

          {/* CRecTech route */}
          <Pipe x0={X.start} x1={X.v2 - half - 11} y={crY} mix={BIOGAS} animate={animate} />
          <Pipe x0={X.v2 + half + 11} x1={X.v4 - half} y={crY} mix={SYNGAS} animate={animate} />
          <Pipe x0={X.v4 + half} x1={X.end} y={crY} mix={METHANOL} animate={animate} />
          <Vessel x={X.v1} y={crY} lines={["Biogas upgrading"]} variant="ghost" />
          <Vessel x={X.v3} y={crY} lines={["Syngas conditioning"]} variant="ghost" />
          <Vessel x={X.v2} y={crY} step={1} lines={["CRecREF™ reforming"]} variant="hero" />
          <SideStream x={X.v2} y={crY - 13} direction="in" mix={[["H2O", 1]]} label="STEAM" animate={animate} tone="#9fd3e6" />
          <Vessel x={X.v4} y={crY} step={2} lines={["Methanol synthesis"]} variant="plain" />
          <StreamTag x={(X.start + X.v1 - half) / 2 + 10} y={crY} name="Biogas" detail="CH₄ 60 · CO₂ 40" />
          <StreamTag x={(X.v3 + X.v4) / 2} y={crY} name="Syngas" detail="H₂ : CO = 2 : 1" ratio={[2, 1]} />
          <StreamTag x={(X.v4 + X.end) / 2 + 12} y={crY} name="Bio-methanol" detail="CH₃OH" />

          {/* Conventional route */}
          <Pipe x0={X.start} x1={X.v1 - half} y={cvY} mix={BIOGAS} animate={animate} />
          <Pipe x0={X.v1 + half} x1={X.v2 - half} y={cvY} mix={BIOMETHANE} animate={animate} />
          <Pipe x0={X.v2 + half} x1={X.v3 - half} y={cvY} mix={SYNGAS_SMR} animate={animate} />
          <Pipe x0={X.v3 + half} x1={X.v4 - half} y={cvY} mix={SYNGAS} animate={animate} />
          <Pipe x0={X.v4 + half} x1={X.end} y={cvY} mix={METHANOL} animate={animate} />
          <Vessel x={X.v1} y={cvY} step={1} lines={["Biogas upgrading"]} variant="plain" />
          <Vessel x={X.v2} y={cvY} step={2} lines={["Steam methane", "reforming"]} variant="plain" />
          <Vessel x={X.v3} y={cvY} step={3} lines={["Syngas conditioning"]} variant="plain" />
          <Vessel x={X.v4} y={cvY} step={4} lines={["Methanol synthesis"]} variant="plain" />
          <SideStream x={X.v1} y={cvY} direction="out" mix={[["CO2", 1]]} label="BIOGENIC CO₂ VENTED" animate={animate} tone="#d9a92c" />
          <SideStream x={X.v2} y={cvY} direction="in" mix={[["H2O", 1]]} label="STEAM" animate={animate} tone="#9fd3e6" />
          <SideStream x={X.v3} y={cvY} direction="in" mix={[["CO2", 1]]} label="CO₂ ADDED" animate={animate} tone="#d9a92c" />
          <StreamTag x={(X.start + X.v1 - half) / 2 + 10} y={cvY} name="Biogas" detail="CH₄ 60 · CO₂ 40" />
          <StreamTag x={(X.v1 + X.v2) / 2} y={cvY} name="Bio-methane" detail="~100% CH₄" />
          <StreamTag x={(X.v2 + X.v3) / 2} y={cvY} name="Syngas" detail="H₂ : CO = 3–5 : 1" ratio={[4, 1]} />
          <StreamTag x={(X.v3 + X.v4) / 2} y={cvY} name="Syngas" detail="H₂ : CO = 2 : 1" ratio={[2, 1]} />
          <StreamTag x={(X.v4 + X.end) / 2 + 12} y={cvY} name="Bio-methanol" detail="CH₃OH" />
        </svg>
      </div>

      <figcaption className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
        {(Object.keys(SPECIES) as Species[]).map((species) => (
          <span key={species} className="label flex items-center gap-2 text-paper/60">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: SPECIES[species].color }} />
            {SPECIES[species].label}
          </span>
        ))}
        <span className="label text-paper/40 md:hidden">Swipe to see the whole diagram</span>
      </figcaption>
    </figure>
  );
}
