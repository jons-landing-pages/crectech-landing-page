import Reveal from "@/components/ui/Reveal";
import SectionLabel from "@/components/ui/SectionLabel";
import SMRFigures from "@/components/shared/SMRFigures";

export default function ProblemSection() {
  return (
    <section className="bg-paper py-24 md:py-36">
      <div className="mx-auto grid max-w-7xl gap-14 px-6 md:grid-cols-12">
        <Reveal className="md:col-span-6">
          <SectionLabel index="01">The problem</SectionLabel>
          <h2 className="font-display mt-6 text-[clamp(1.9rem,3.3vw,3rem)] font-extrabold leading-[1.05]">
            Shipping is turning to methanol, but only about 0.2% of the world&apos;s supply is sustainable.
          </h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-ink/65">
            Most methanol comes from natural gas through steam methane reforming. Each year that process burns
            81 million tonnes of gas as fuel, uses 270 million tonnes of water and releases 420 million tonnes of CO₂.
          </p>
          <p className="mt-4 text-xs text-ink/45">Sustainable share: Journal of CO₂ Utilization 68 (2023) 102345</p>
        </Reveal>
        <Reveal className="md:col-span-6 md:col-start-7" delay={0.15}>
          <SMRFigures />
        </Reveal>
      </div>
    </section>
  );
}
