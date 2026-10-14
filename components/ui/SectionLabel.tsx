interface SectionLabelProps {
  index: string;
  children: React.ReactNode;
  tone?: "light" | "dark";
}

/** Monospace section marker, e.g. "[02] — Technology". */
export default function SectionLabel({ index, children, tone = "light" }: SectionLabelProps) {
  const color = tone === "dark" ? "text-paper/55" : "text-ink/55";
  const indexColor = tone === "dark" ? "text-primary-light" : "text-primary";
  return (
    <p className={`label flex items-center gap-3 ${color}`}>
      <span className={indexColor}>[{index}]</span>
      <span aria-hidden="true" className="h-px w-8 bg-current opacity-40" />
      {children}
    </p>
  );
}
