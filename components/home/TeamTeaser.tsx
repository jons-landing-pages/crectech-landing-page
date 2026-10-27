import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import SectionLabel from "@/components/ui/SectionLabel";
import ArrowLink from "@/components/ui/ArrowLink";

export default function TeamTeaser() {
  return (
    <section className="bg-paper py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <Reveal className="md:col-span-7">
            <SectionLabel index="06">The team</SectionLabel>
            <h2 className="font-display mt-6 text-[clamp(1.9rem,3.3vw,3rem)] font-extrabold leading-[1.05]">
              Our team combines catalysis research from NUS with decades of work in industry and supply chains.
            </h2>
          </Reveal>
          <Reveal className="md:col-span-4 md:col-start-9" delay={0.1}>
            <p className="leading-relaxed text-ink/65">
              The co-founders bring more than 15 years of catalyst development between them. Our engineers come from
              process plants and chemical companies, and our business lead has 40 years in agricultural supply chains.
            </p>
            <div className="mt-6">
              <ArrowLink href="/about" variant="outline-dark">
                Meet the team
              </ArrowLink>
            </div>
          </Reveal>
        </div>

        <Reveal className="mt-14" y={40}>
          <figure className="relative overflow-hidden rounded-3xl">
            <Image
              src="/images/team/Team-photo.png"
              alt="The CRecTech team standing in front of their methanol synthesis rig in the lab"
              width={2560}
              height={1281}
              sizes="(min-width: 1280px) 1232px, 100vw"
              className="aspect-[16/10] w-full object-cover md:aspect-[2/1]"
            />
            <figcaption className="label absolute bottom-4 left-4 rounded-full bg-carbon/70 px-4 py-2 text-paper/80 backdrop-blur">
              CRecTech lab · methanol synthesis rig
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
