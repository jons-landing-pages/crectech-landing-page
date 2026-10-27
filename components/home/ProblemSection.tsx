import Reveal from "@/components/ui/Reveal";
import SectionLabel from "@/components/ui/SectionLabel";
import ArrowLink from "@/components/ui/ArrowLink";

/** Short statement of the problem. The detailed SMR figures are on the Technology page. */
export default function ProblemSection() {
  return (
    <section className="bg-paper py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="max-w-3xl">
          <SectionLabel index="01">The problem</SectionLabel>
          <h2 className="font-display mt-6 text-[clamp(1.9rem,3.3vw,3rem)] font-extrabold leading-[1.05]">
            Shipping is turning to methanol, but only about 0.2% of the world&apos;s supply is sustainable.
          </h2>
          <div className="mt-8">
            <ArrowLink href="/technology#incumbent" variant="outline-dark">
              See what fossil methanol costs
            </ArrowLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
