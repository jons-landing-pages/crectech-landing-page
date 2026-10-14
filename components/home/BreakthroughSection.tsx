import Reveal from "@/components/ui/Reveal";
import SectionLabel from "@/components/ui/SectionLabel";
import ArrowLink from "@/components/ui/ArrowLink";
import ProcessDiagram from "@/components/shared/ProcessDiagram";

// Deck p4–5.
const advantages = [
  {
    title: "No upgrading step",
    body: "The conventional route removes the CO₂ from biogas before it can use the methane. CRecREF™ reforms methane and CO₂ together.",
  },
  {
    title: "No conditioning step",
    body: "Steam methane reforming makes syngas with three to five parts hydrogen to one part carbon monoxide, so CO₂ must be added back. Our syngas leaves at 2 : 1.",
  },
  {
    title: "About half the cost",
    body: "Taking out two process steps cuts capital and operating costs by about 50% for a plant that fits at the mill.",
  },
];

export default function BreakthroughSection() {
  return (
    <section className="grain relative overflow-hidden bg-carbon-2 py-24 text-paper md:py-36">
      <div className="blueprint pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_70%)]" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid gap-10 md:grid-cols-12 md:items-end">
          <Reveal className="md:col-span-7">
            <SectionLabel index="02" tone="dark">
              Process
            </SectionLabel>
            <h2 className="font-display mt-6 text-[clamp(1.9rem,3.3vw,3rem)] font-extrabold leading-[1.02]">
              Our catalyst does in one step what conventional plants need three steps to do.
            </h2>
          </Reveal>
          <Reveal className="md:col-span-5" delay={0.1}>
            <p className="text-lg leading-relaxed text-paper/65">
              Both routes start with biogas from the same lagoon and end with the same methanol. The difference is how
              much equipment sits in between.
            </p>
          </Reveal>
        </div>

        <Reveal className="mt-16" delay={0.1}>
          <ProcessDiagram />
        </Reveal>

        <div className="mt-14 grid gap-px overflow-hidden rounded-3xl bg-line-dark md:grid-cols-3">
          {advantages.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.08} className="h-full bg-carbon-2 p-7">
              <p className="font-mono text-xs text-primary-light">0{i + 1}</p>
              <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-paper/60">{item.body}</p>
            </Reveal>
          ))}
        </div>

        <div className="mt-12">
          <ArrowLink href="/technology" variant="outline-light">
            Read about the technology
          </ArrowLink>
        </div>
      </div>
    </section>
  );
}
