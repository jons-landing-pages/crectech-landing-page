import Reveal from "@/components/ui/Reveal";
import SectionLabel from "@/components/ui/SectionLabel";
import { businessModels } from "@/lib/site";

export default function ModelsSection() {
  return (
    <section className="bg-paper-2 py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-10 md:grid-cols-12 md:items-end">
          <Reveal className="md:col-span-7">
            <SectionLabel index="04">Working with us</SectionLabel>
            <h2 className="font-display mt-6 text-[clamp(1.9rem,3.3vw,3rem)] font-extrabold leading-[1.02]">
              There are three ways to bring a CRecREF™ plant to your site.
            </h2>
          </Reveal>
          <Reveal className="md:col-span-5" delay={0.1}>
            <p className="leading-relaxed text-ink/65">
              We recommend the middle option: we build a pre-engineered unit, and your team runs it with our catalyst
              supply and maintenance support.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {businessModels.map((model, i) => (
            <Reveal
              key={model.name}
              delay={i * 0.08}
              className={`relative flex h-full flex-col rounded-3xl p-7 ${
                model.preferred ? "grain overflow-hidden bg-carbon text-paper" : "border border-line bg-paper"
              }`}
            >
              {model.preferred && (
                <span className="label absolute right-6 top-6 rounded-full bg-primary-light px-3 py-1 text-carbon">
                  Recommended
                </span>
              )}
              <p className={`font-mono text-xs ${model.preferred ? "text-primary-light" : "text-primary"}`}>0{i + 1}</p>
              <h3 className="mt-5 text-xl font-semibold">{model.name}</h3>
              <p className={`label mt-2 ${model.preferred ? "text-paper/60" : "text-ink/55"}`}>{model.split}</p>
              <ul className={`mt-6 space-y-3 text-sm leading-relaxed ${model.preferred ? "text-paper/75" : "text-ink/70"}`}>
                {model.points.map((point) => (
                  <li key={point} className="flex gap-3">
                    <span aria-hidden="true" className={model.preferred ? "text-primary-light" : "text-primary"}>
                      —
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
