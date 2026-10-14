import type { NewsItem } from "@/lib/news";

/** One press item as an editorial list row: source and date, headline, arrow. */
export default function NewsRow({ item, showExcerpt = false }: { item: NewsItem; showExcerpt?: boolean }) {
  return (
    <a
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group grid grid-cols-[1fr_auto] gap-x-6 gap-y-2 border-b border-line py-6 transition-colors"
    >
      <p className="label text-ink/50">
        <span className="text-primary">{item.source}</span> · {item.date}
      </p>
      <span
        aria-hidden="true"
        className="row-span-2 grid h-10 w-10 place-items-center self-center rounded-full border border-line text-ink/60 transition-all duration-300 group-hover:-rotate-45 group-hover:border-ink group-hover:bg-ink group-hover:text-paper"
      >
        →
      </span>
      <h3 className="text-lg font-semibold leading-snug transition-colors group-hover:text-primary md:text-xl">
        {item.title}
        <span className="sr-only"> (opens in a new tab)</span>
      </h3>
      {showExcerpt && (
        <p className="col-span-2 max-w-2xl text-sm leading-relaxed text-ink/60">{item.excerpt}</p>
      )}
    </a>
  );
}
