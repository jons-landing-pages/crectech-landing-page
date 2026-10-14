import Image from "next/image";
import PersonCard from "@/components/about/PersonCard";
import Reveal from "@/components/ui/Reveal";
import SectionLabel from "@/components/ui/SectionLabel";
import { advisors, engineers, founders } from "@/lib/team";

export default function AboutPage() {
  return (
    <main>
      {/* Hero: the team in the lab, in front of their methanol synthesis rig. */}
      <section className="grain relative isolate flex min-h-[88svh] items-end overflow-hidden bg-carbon text-paper">
        <Image
          src="/images/team/Team-photo.png"
          alt="The CRecTech team standing in front of their methanol synthesis rig in the lab"
          fill
          priority
          sizes="100vw"
          className="animate-push-in -z-10 object-cover object-[50%_30%]"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-carbon via-carbon/60 to-carbon/10" />
        <div className="mx-auto w-full max-w-7xl px-6 pb-14 md:pb-16">
          <p className="animate-fade-up label flex items-center gap-3 text-paper/70">
            <span className="h-1.5 w-1.5 rounded-full bg-primary-light" />
            CRecTech · About
          </p>
          <h1
            style={{ "--delay": "0.1s" } as React.CSSProperties}
            className="animate-fade-up font-display mt-5 max-w-4xl text-[clamp(2rem,4.4vw,3.75rem)] font-extrabold leading-[1.03]"
          >
            We are a Singapore deep-tech team turning palm-oil biogas into <span className="text-accent-light">marine fuel.</span>
          </h1>
        </div>
      </section>

      {/* Company intro */}
      <section className="bg-paper py-24 md:py-32">
        <div className="mx-auto grid max-w-7xl gap-14 px-6 md:grid-cols-12">
          <Reveal className="md:col-span-7">
            <SectionLabel index="01">Who we are</SectionLabel>
            <div className="mt-8 space-y-5 text-lg leading-relaxed text-ink/70">
              <p>
                <span className="font-semibold text-ink">CRecTech</span> (Carbon Recycle Technologies) started at the
                National University of Singapore. We recycle waste biogas into sustainable bio-methanol, and our motto
                is From Waste to Worth.
              </p>
              <p>
                We are backed by partners including Breakthrough Energy, founded by Bill Gates, and our work has been
                covered by Forbes, CNBC, The Business Times and Manifold Times.
              </p>
            </div>
          </Reveal>
          <Reveal className="md:col-span-4 md:col-start-9" delay={0.1}>
            <dl className="divide-y divide-line border-y border-line">
              {[
                { term: "Founded at", value: "National University of Singapore" },
                { term: "First pilot", value: "Sei Mangkei, North Sumatra, with Pertamina NRE" },
                { term: "Funding raised", value: "Close to S$5 million (IPOS, 2026)" },
                { term: "Backed by", value: "Breakthrough Energy, Temasek, Enterprise Singapore, SGInnovate" },
              ].map((fact) => (
                <div key={fact.term} className="py-4">
                  <dt className="label text-ink/50">{fact.term}</dt>
                  <dd className="mt-1 font-semibold">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* Leadership */}
      <section className="bg-paper-2 py-24 md:py-36">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal className="max-w-3xl">
            <SectionLabel index="02">Leadership</SectionLabel>
            <h2 className="font-display mt-6 text-[clamp(1.9rem,3.3vw,3rem)] font-extrabold leading-[1.05]">
              Two catalysis scientists founded CRecTech, and a supply-chain veteran leads business development.
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {founders.map((person, i) => (
              <Reveal key={person.name} delay={i * 0.08}>
                <PersonCard person={person} size="large" />
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-24">
            <p className="label border-b border-line pb-4 text-ink/50">Engineering</p>
          </Reveal>
          <div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-4">
            {engineers.map((person, i) => (
              <Reveal key={person.name} delay={i * 0.08}>
                <PersonCard person={person} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Advisors */}
      <section className="bg-paper py-24 md:py-36">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal className="max-w-3xl">
            <SectionLabel index="03">Board of advisors</SectionLabel>
            <h2 className="font-display mt-6 text-[clamp(1.9rem,3.3vw,3rem)] font-extrabold leading-[1.05]">
              Our board of advisors.
            </h2>
          </Reveal>
          <div className="mt-14 grid grid-cols-2 gap-8 md:grid-cols-4">
            {advisors.map((person, i) => (
              <Reveal key={person.name} delay={i * 0.08}>
                <PersonCard person={person} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
