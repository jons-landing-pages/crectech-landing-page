"use client";
import dynamic from "next/dynamic";

const PelletScene = dynamic(() => import("@/components/technology/PelletScene"), { ssr: false });

const facts = [
  { term: "Process steps", value: "2 instead of 4" },
  { term: "CAPEX and OPEX", value: "About 50% lower" },
  { term: "Syngas, H₂ : CO", value: "2 : 1" },
];

/**
 * Technology page opener: the CRecREF™ pellet floats on the page, with biogas and steam streaming
 * into its channels and syngas leaving. It tilts towards the pointer.
 */
export default function TechnologyHero() {
  return (
    <section className="relative overflow-hidden bg-paper">
      <div className="blueprint-light pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_70%_50%,black,transparent_70%)]" />

      <div className="relative mx-auto grid min-h-[92svh] max-w-7xl items-center gap-6 px-6 pb-16 pt-28 md:grid-cols-12 md:pt-24">
        {/* The scene bleeds past the column on the right so the gas can trail off the page. */}
        <div className="relative order-first h-[46svh] [mask-image:radial-gradient(ellipse_at_center,black_52%,transparent_76%)] md:order-last md:col-span-6 md:-ml-[4vw] md:-mr-[12vw] md:h-[78svh]">
          <PelletScene tone="light" />
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <span className="label absolute left-[14%] top-[16%] text-primary">In · CH₄ + CO₂ + H₂O</span>
            <span className="label absolute bottom-[22%] right-[16%] text-ink/70">Out · H₂ + CO</span>
            <span className="label absolute bottom-[14%] left-1/2 -translate-x-1/2 text-ink/45">
              CRecREF™ pellet · 7 channels
            </span>
          </div>
        </div>

        <div className="md:col-span-6">
          <p className="animate-fade-up label flex items-center gap-3 text-ink/55">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            CRecTech · Technology
          </p>
          <h1
            style={{ "--delay": "0.1s" } as React.CSSProperties}
            className="animate-fade-up font-display mt-6 text-[clamp(1.9rem,3.1vw,2.9rem)] font-extrabold leading-[1.05]"
          >
            One CRecREF™ step turns raw biogas into the syngas that methanol synthesis needs.
          </h1>
          <div style={{ "--delay": "0.25s" } as React.CSSProperties} className="animate-fade-up mt-6 space-y-4 text-ink/70">
            <p className="text-lg leading-relaxed">
              Biogas, about 60% methane and 40% CO₂, flows with steam through the seven channels of each ceramic
              pellet. On the catalyst surface it reacts to syngas with two parts hydrogen to one part carbon
              monoxide.
            </p>
            <p className="leading-relaxed">
              The catalyst resists the carbon build-up that degrades conventional reforming catalysts, and it uses the
              CO₂ in the biogas as a reactant.
            </p>
          </div>
          <dl
            style={{ "--delay": "0.4s" } as React.CSSProperties}
            className="animate-fade-up mt-8 grid grid-cols-3 border-t border-line"
          >
            {facts.map((fact, i) => (
              <div key={fact.term} className={`py-4 ${i > 0 ? "border-l border-line pl-4" : "pr-4"}`}>
                <dt className="label text-ink/50">{fact.term}</dt>
                <dd className="font-display mt-1 text-lg font-bold md:text-xl">{fact.value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-xs text-ink/45">International patent application WO/2023/146478</p>
        </div>
      </div>
    </section>
  );
}
