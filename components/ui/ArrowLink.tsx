interface ArrowLinkProps {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "solid-dark" | "outline-light" | "outline-dark";
  external?: boolean;
  className?: string;
}

const variants = {
  solid: "bg-primary-light text-carbon hover:bg-accent-light",
  "solid-dark": "bg-ink text-paper hover:bg-primary",
  "outline-light": "border border-paper/25 text-paper hover:border-paper hover:bg-paper hover:text-carbon",
  "outline-dark": "border border-ink/20 text-ink hover:border-ink hover:bg-ink hover:text-paper",
};

/** Pill-shaped call-to-action link with an arrow that slides on hover. */
export default function ArrowLink({
  href,
  children,
  variant = "solid",
  external = false,
  className = "",
}: ArrowLinkProps) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`group inline-flex items-center gap-3 rounded-full py-3 pl-6 pr-3 text-sm font-semibold transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-light ${variants[variant]} ${className}`}
    >
      {children}
      <span
        aria-hidden="true"
        className="grid h-7 w-7 place-items-center overflow-hidden rounded-full bg-current/10"
      >
        <span className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-rotate-45">
          →
        </span>
      </span>
    </a>
  );
}
