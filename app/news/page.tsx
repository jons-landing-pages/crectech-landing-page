import PageHeader from "@/components/PageHeader";
import NewsRow from "@/components/news/NewsRow";
import Reveal from "@/components/ui/Reveal";
import { newsByDate, type NewsItem } from "@/lib/news";

function groupByYear(items: NewsItem[]) {
  const groups = new Map<string, NewsItem[]>();
  for (const item of items) {
    const year = item.isoDate.slice(0, 4);
    groups.set(year, [...(groups.get(year) ?? []), item]);
  }
  return [...groups.entries()];
}

export default function NewsPage() {
  const [featured, ...rest] = newsByDate;

  return (
    <main>
      <PageHeader
        eyebrow="News"
        title="News and coverage of our work."
        subtitle="From the Breakthrough Energy Fellows cohort in 2024 to the Pertamina NRE pilot agreement in 2026."
      />

      <section className="bg-paper pb-20 pt-2 md:pb-28">
        <div className="mx-auto max-w-7xl px-6">
          {/* Featured story */}
          <Reveal>
            <a
              href={featured.href}
              target="_blank"
              rel="noopener noreferrer"
              className="grain group relative block overflow-hidden rounded-3xl bg-carbon p-8 text-paper md:p-14"
            >
              <div className="blueprint pointer-events-none absolute inset-0 opacity-50" />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-primary/30 blur-[100px] transition-opacity duration-700 group-hover:opacity-70"
              />
              <div className="relative">
                <p className="label text-paper/55">
                  <span className="text-primary-light">Latest · {featured.source}</span> · {featured.date}
                </p>
                <h2 className="font-display mt-6 max-w-4xl text-[clamp(1.8rem,3.6vw,3.25rem)] font-extrabold leading-[1.02]">
                  {featured.title}
                </h2>
                <p className="mt-6 max-w-2xl leading-relaxed text-paper/65">{featured.excerpt}</p>
                <span className="mt-10 inline-flex items-center gap-3 text-sm font-semibold text-primary-light">
                  Read on {featured.source}
                  <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                  <span className="sr-only">(opens in a new tab)</span>
                </span>
              </div>
            </a>
          </Reveal>

          {/* Archive by year */}
          {groupByYear(rest).map(([year, items]) => (
            <div key={year} className="mt-20 grid gap-6 md:grid-cols-12">
              <Reveal className="md:col-span-3">
                <h2 className="font-display text-5xl font-extrabold text-ink/15 md:sticky md:top-28">{year}</h2>
              </Reveal>
              <Reveal className="md:col-span-9">
                <ul className="border-t border-line">
                  {items.map((item) => (
                    <li key={item.href}>
                      <NewsRow item={item} showExcerpt />
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
