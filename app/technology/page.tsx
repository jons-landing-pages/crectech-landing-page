import Image from "next/image";
import TechnologyHero from "@/components/technology/TechnologyHero";
import ProcessDiagram from "@/components/shared/ProcessDiagram";
import SMRFigures from "@/components/shared/SMRFigures";
import Reveal from "@/components/ui/Reveal";
import SectionLabel from "@/components/ui/SectionLabel";
import ArrowLink from "@/components/ui/ArrowLink";
import { systemFeatures } from "@/lib/site";

export default function TechnologyPage() {
  return (
    <main>
      <TechnologyHero />

      {/* Process comparison */}
      <section className="grain relative overflow-hidden bg-carbon-2 py-24 text-paper md:py-36">
        <div className="blueprint pointer-events-none absolute inset-0 opacity-40" />
        <div className="relative mx-auto max-w-7xl px-6">
          <Reveal className="max-w-3xl">
            <SectionLabel index="01" tone="dark">
              Two routes
            </SectionLabel>
            <h2 className="font-display mt-6 text-[clamp(1.9rem,3.3vw,3rem)] font-extrabold leading-[1.02]">
              The conventional route removes CO₂ from the biogas and later adds CO₂ back; ours keeps it.
            </h2>
          </Reveal>
          <Reveal className="mt-16" delay={0.1}>
            <ProcessDiagram />
          </Reveal>
          <dl className="mt-10 grid gap-px overflow-hidden rounded-3xl bg-line-dark md:grid-cols-3">
            {[
              { term: "Process steps", value: "2 instead of 4" },
              { term: "CAPEX and OPEX", value: "About 50% lower" },
              { term: "Syngas ratio, H₂ : CO", value: "2 : 1 directly" },
            ].map((item) => (
              <div key={item.term} className="bg-carbon-2 p-7">
                <dt className="label text-paper/45">{item.term}</dt>
                <dd className="font-display mt-3 text-3xl font-extrabold text-primary-light">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* The containerised unit */}
      <section className="bg-paper py-24 md:py-36">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal className="max-w-3xl">
            <SectionLabel index="02">The unit</SectionLabel>
            <h2 className="font-display mt-6 text-[clamp(1.9rem,3.3vw,3rem)] font-extrabold leading-[1.02]">
              Both reactors fit in one shipping container that sits beside the biogas source.
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-10 md:grid-cols-12 md:items-center">
            <Reveal className="md:col-span-7">
              <figure>
                <Image
                  src="/images/site/sei-mangkei-pilot.jpg"
                  alt="Visualisation of the CRecTech pilot beside the covered lagoon at Sei Mangkei: pre-treatment vessels, a green reactor container and methanol storage under canopies"
                  width={2288}
                  height={1190}
                  sizes="(min-width: 768px) 58vw, 100vw"
                  className="w-full rounded-3xl object-cover"
                />
                <figcaption className="mt-3 text-xs text-ink/50">
                  Visualisation of the planned pilot at Pertamina NRE&apos;s biogas power plant, Sei Mangkei.
                </figcaption>
              </figure>
            </Reveal>
            <div className="md:col-span-5">
              {systemFeatures.map((feature, i) => (
                <Reveal key={feature.title} delay={i * 0.08} className="border-t border-line py-7 first:border-t-0 first:pt-0">
                  <div className="flex gap-5">
                    <span className="font-mono text-xs text-primary">0{i + 1}</span>
                    <div>
                      <h3 className="text-xl font-semibold">{feature.title}</h3>
                      <p className="mt-2 leading-relaxed text-ink/60">{feature.body}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
              <div className="mt-4">
                <ArrowLink href="/#journey" variant="outline-dark">
                  Follow the gas through the plant
                </ArrowLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Incumbent footprint */}
      <section className="bg-paper-2 py-24 md:py-36">
        <div className="mx-auto grid max-w-7xl gap-14 px-6 md:grid-cols-12">
          <Reveal className="md:col-span-6">
            <SectionLabel index="03">The incumbent</SectionLabel>
            <h2 className="font-display mt-6 text-[clamp(1.9rem,3.3vw,3rem)] font-extrabold leading-[1.02]">
              Fossil methanol comes mainly from steam methane reforming, which has a heavy footprint.
            </h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-ink/65">
              The process burns natural gas for heat, consumes large volumes of water, and its catalysts degrade over
              time. These are its global totals for one year.
            </p>
          </Reveal>
          <Reveal className="md:col-span-6 md:col-start-7" delay={0.15}>
            <SMRFigures />
          </Reveal>
        </div>
      </section>
    </main>
  );
}
