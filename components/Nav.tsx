"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { easeOutExpo } from "@/lib/animations";
import { navLinks } from "@/lib/site";

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close the mobile menu after navigation and lock page scroll while it is open.
  useEffect(() => setMenuOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-6 md:pt-4">
      <nav
        aria-label="Main"
        className={`mx-auto flex h-14 max-w-7xl items-center justify-between rounded-full border pl-5 pr-2 transition-all duration-500 ${
          scrolled || menuOpen
            ? "border-line-dark bg-carbon/85 shadow-[0_8px_32px_rgba(0,0,0,0.25)] backdrop-blur-xl"
            : "border-line-dark bg-carbon/70 backdrop-blur-md"
        }`}
      >
        <a href="/" className="flex items-center" aria-label="CRecTech home">
          <Image
            src="/images/CRecTech_logo_white.png"
            alt="CRecTech"
            width={1837}
            height={637}
            priority
            className="h-8 w-auto"
          />
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    active ? "text-paper" : "text-paper/60 hover:text-paper"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 -z-10 rounded-full bg-paper/10"
                    />
                  )}
                  {link.label}
                </a>
              </li>
            );
          })}
        </ul>

        <a
          href="/contact"
          className="hidden rounded-full bg-primary-light px-5 py-2.5 text-sm font-semibold text-carbon transition-colors hover:bg-accent-light md:inline-flex"
        >
          Book a meeting
        </a>

        <button
          type="button"
          className="relative grid h-10 w-10 place-items-center rounded-full text-paper md:hidden"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          <span
            className={`absolute h-px w-5 bg-current transition-transform duration-300 ${
              menuOpen ? "rotate-45" : "-translate-y-1"
            }`}
          />
          <span
            className={`absolute h-px w-5 bg-current transition-transform duration-300 ${
              menuOpen ? "-rotate-45" : "translate-y-1"
            }`}
          />
        </button>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: easeOutExpo }}
            className="mt-2 rounded-3xl border border-line-dark bg-carbon/95 p-6 backdrop-blur-xl md:hidden"
          >
            <ul>
              {navLinks.map((link, i) => (
                <li key={link.href} className="border-b border-line-dark last:border-0">
                  <a
                    href={link.href}
                    className="font-display flex items-baseline justify-between py-4 text-2xl font-bold text-paper"
                  >
                    {link.label}
                    <span className="label text-paper/40">0{i + 1}</span>
                  </a>
                </li>
              ))}
            </ul>
            <a
              href="/contact"
              className="mt-6 flex justify-center rounded-full bg-primary-light py-3.5 text-sm font-semibold text-carbon"
            >
              Book a meeting
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
