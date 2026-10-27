import Image from "next/image";
import ArrowLink from "@/components/ui/ArrowLink";
import { contactEmail, navLinks } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="grain relative overflow-hidden bg-carbon text-paper">
      <div className="blueprint pointer-events-none absolute inset-0 opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent)]" />

      <div className="relative mx-auto max-w-7xl px-6 pb-10 pt-24 md:pt-32">
        {/* Closing call to action */}
        <div className="flex flex-col gap-10 border-b border-line-dark pb-16 md:flex-row md:items-end md:justify-between">
          <h2 className="font-display max-w-3xl text-[clamp(2.4rem,6vw,5rem)] font-extrabold leading-[0.95]">
            From waste
            <br />
            to <span className="text-accent-light">worth.</span>
          </h2>
          <div className="flex flex-col items-start gap-4">
            <ArrowLink href="/contact">Book a meeting</ArrowLink>
            <a
              href={`mailto:${contactEmail}`}
              className="font-mono text-sm text-paper/60 transition-colors hover:text-primary-light"
            >
              {contactEmail}
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-10 py-12 md:grid-cols-4">
          <div className="col-span-2">
            <Image
              src="/images/CRecTech_logo_white.png"
              alt="CRecTech"
              width={1837}
              height={637}
              className="h-10 w-auto"
            />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-paper/55">
              Carbon Recycle Technologies. A deep-tech spin-off from the National
              University of Singapore, converting waste biogas into renewable
              bio-methanol.
            </p>
          </div>

          <nav aria-label="Footer">
            <p className="label mb-4 text-paper/40">Pages</p>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-paper/70 transition-colors hover:text-primary-light"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="label mb-4 text-paper/40">Reaction</p>
            <p className="font-mono text-sm leading-relaxed text-paper/70">
              CH₄ + CO₂ + H₂O
              <br />→ syngas (2 H₂ : 1 CO)
              <br />→ CH₃OH
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-2 border-t border-line-dark pt-6 font-mono text-xs text-paper/40 md:flex-row">
          <p>© {new Date().getFullYear()} CRecTech Pte. Ltd. All rights reserved.</p>
          <p>Singapore</p>
        </div>
      </div>
    </footer>
  );
}
