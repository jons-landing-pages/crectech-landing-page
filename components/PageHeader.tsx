interface PageHeaderProps {
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: string;
}

/** Compact light page header for content pages (news, contact): the content starts sooner. */
export default function PageHeader({ eyebrow, title, subtitle }: PageHeaderProps) {
  return (
    <header className="bg-paper">
      <div className="mx-auto max-w-7xl px-6 pb-10 pt-36 md:pb-12 md:pt-40">
        <p className="animate-fade-up label flex items-center gap-3 text-ink/55">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          CRecTech · {eyebrow}
        </p>
        <div className="mt-5 flex flex-col gap-4 border-b border-line pb-10 md:flex-row md:items-end md:justify-between md:gap-12">
          <h1
            style={{ "--delay": "0.1s" } as React.CSSProperties}
            className="animate-fade-up font-display max-w-3xl text-[clamp(2rem,4vw,3.25rem)] font-extrabold leading-[1.04]"
          >
            {title}
          </h1>
          {subtitle && (
            <p
              style={{ "--delay": "0.2s" } as React.CSSProperties}
              className="animate-fade-up max-w-md leading-relaxed text-ink/65"
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </header>
  );
}
