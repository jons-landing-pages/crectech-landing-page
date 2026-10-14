import Reveal from "@/components/ui/Reveal";
import SectionLabel from "@/components/ui/SectionLabel";
import ArrowLink from "@/components/ui/ArrowLink";
import NewsRow from "@/components/news/NewsRow";
import { newsByDate } from "@/lib/news";
import { milestones } from "@/lib/site";

const LATEST_COUNT = 4;

export default function ProofSection() {
  return (
    <section className="bg-paper py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="max-w-4xl">
          <SectionLabel index="05">Momentum</SectionLabel>
          <h2 className="font-display mt-6 text-[clamp(1.9rem,3.3vw,3rem)] font-extrabold leading-[1.02]">
            In 2026 the work moved from our lab in Singapore to a signed pilot agreement in Indonesia.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-16 md:grid-cols-12">
          <ol className="relative md:col-span-5">
            <span aria-hidden="true" className="absolute bottom-2 left-[5px] top-2 w-px bg-line" />
            {milestones.map((milestone, i) => (
              <Reveal key={milestone.title} delay={Math.min(i * 0.05, 0.3)} className="relative pb-7 pl-8 last:pb-0">
                <li>
                  <span
                    aria-hidden="true"
                    className={`absolute left-0 top-1.5 h-[11px] w-[11px] rounded-full border-2 ${
                      i === 0 ? "border-primary bg-primary" : "border-primary bg-paper"
                    }`}
                  />
                  <p className="label text-primary">{milestone.date}</p>
                  <p className="mt-1 font-semibold">{milestone.title}</p>
                  <p className="mt-0.5 text-sm text-ink/60">{milestone.detail}</p>
                </li>
              </Reveal>
            ))}
          </ol>

          <div className="md:col-span-7">
            <Reveal>
              <p className="label mb-2 text-ink/50">Latest coverage</p>
              <ul>
                {newsByDate.slice(0, LATEST_COUNT).map((item) => (
                  <li key={item.href}>
                    <NewsRow item={item} />
                  </li>
                ))}
              </ul>
            </Reveal>
            <div className="mt-10">
              <ArrowLink href="/news" variant="outline-dark">
                All news
              </ArrowLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
