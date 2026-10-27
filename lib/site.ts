// Shared site content: navigation, contact points, partner logos, headline figures.

export const navLinks = [
  { href: "/technology", label: "Technology" },
  { href: "/about", label: "About" },
  { href: "/news", label: "News" },
  { href: "/contact", label: "Contact" },
];

export const contactEmail = "contact@crectech.net";
export const calendlyUrl = "https://calendly.com/crectech";

// Logo files are badge-style PNGs (white rounded card, 1273 × 548 or close).
export const partners = [
  { src: "/images/partners/breakthrough-energy.png", name: "Breakthrough Energy" },
  { src: "/images/partners/temasek.png", name: "Temasek" },
  { src: "/images/partners/enterprise-singapore.png", name: "Enterprise Singapore" },
  { src: "/images/partners/sginnovate.png", name: "SGInnovate" },
  { src: "/images/partners/astar.png", name: "A*STAR" },
  { src: "/images/partners/shell-startup-engine.png", name: "Shell StartUp Engine" },
  { src: "/images/partners/pier71.png", name: "PIER71" },
  { src: "/images/partners/startup-sg-founder.png", name: "Startup SG Founder" },
  { src: "/images/partners/block71.png", name: "BLOCK71" },
  { src: "/images/partners/nus-grip.png", name: "NUS GRIP" },
];

export const keyFigures = [
  { value: "50%", label: "Lower CAPEX and OPEX" },
  { value: "2 steps", label: "Instead of four" },
  { value: "1,000+", label: "Palm oil mills in Indonesia" },
  { value: "Dec 2026", label: "First on-site pilot" },
];

/** Planned start-up of the Sei Mangkei pilot (deck p11, "Coming to life"). */
export const PILOT_START = "2026-12-10";

/**
 * Scale-up path (deck p9). Capacity in tonnes of methanol per year, so the stages share one axis:
 * 1 g/day = 0.000365 t/yr, 1 kg/day = 0.365 t/yr.
 */
export const roadmap = [
  { years: "2022–23", stage: "Proof of concept", capacity: "1 g a day", tonnesPerYear: 0.000365, status: "done" },
  { years: "2024–25", stage: "Technology validation", capacity: "1 kg a day", tonnesPerYear: 0.365, status: "done" },
  { years: "2026–27", stage: "On-site pilot, Sei Mangkei", capacity: "50 t a year", tonnesPerYear: 50, status: "now" },
  { years: "2027–28", stage: "Commercial demonstration", capacity: "about 50 kt a year", tonnesPerYear: 50_000, status: "next" },
  { years: "After 2028", stage: "Regional expansion", capacity: "500 kt a year", tonnesPerYear: 500_000, status: "next" },
] as const;

/** Ways to work with CRecTech (deck p8). */
export const businessModels = [
  {
    name: "Licensing and royalty",
    split: "You build, you operate",
    points: ["We provide the design you build", "Annual licence fee and royalties on net bio-methanol sales", "Recurring catalyst supply and maintenance"],
    preferred: false,
  },
  {
    name: "Technology provider",
    split: "We build, you operate",
    points: ["We design, build and deploy a pre-engineered, ready-to-install unit", "Recurring catalyst supply and maintenance support"],
    preferred: true,
  },
  {
    name: "Build, own, operate, transfer",
    split: "We build and operate, then hand over",
    points: ["We run the plant and sell the bio-methanol", "You take over the plant once it is running", "Recurring catalyst supply and maintenance"],
    preferred: false,
  },
] as const;

/** Milestones, newest first. Sources: verified news (lib/news.ts) and the pitch deck (p12). */
export const milestones = [
  { date: "Oct 2026", title: "Winner, Energy Transition track", detail: "Climate Impact Innovations Challenge 2026, with Rp5 billion to pilot in Indonesia" },
  { date: "Sep 2026", title: "Activate Global Fellows", detail: "Both co-founders join Activate's first Singapore cohort" },
  { date: "Aug 2026", title: "Joint Development Agreement with Pertamina NRE", detail: "For the biogas-to-bio-methanol pilot at Sei Mangkei, signed 14 August" },
  { date: "Aug 2026", title: "IPOS Young Innovator", detail: "IP for Growth Awards 2026, Intellectual Property Office of Singapore" },
  { date: "Jan 2026", title: "Seed round", detail: "Led by In Group Holdings" },
  { date: "Nov 2025", title: "IES Sustainability Award and iPitch@ACES", detail: "Promising Start-Up for Sustainability, and Best Disruptive Startup" },
  { date: "2025", title: "Forbes 30 Under 30 Asia", detail: "Dr Lim Kang Hui, co-founder and CEO" },
  { date: "Oct 2024", title: "Breakthrough Energy Fellows", detail: "Inaugural Southeast Asia cohort, with a USD 500K grant" },
] as const;

/** The containerised unit (deck p4, p11). */
export const systemFeatures = [
  {
    title: "Modular and quick to deploy",
    body: "The reactors fit in one shipping container with a small footprint, so a unit can be set up next to the biogas source.",
  },
  {
    title: "Plug-and-play integration",
    body: "The unit connects to the plant's existing biogas, heat and storage infrastructure with little disruption to operations.",
  },
  {
    title: "Lower CAPEX and OPEX",
    body: "Two process steps instead of four cut capital and operating costs by about half. Add units to scale up.",
  },
];
