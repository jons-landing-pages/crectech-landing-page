export interface NewsItem {
  title: string;
  /** Display date, as written by the source. */
  date: string;
  /** Sort key. Month-only dates use the first of the month. */
  isoDate: string;
  excerpt: string;
  href: string;
  source: string;
}

export const newsItems: NewsItem[] = [
  {
    title: "CRecTech wins the Energy Transition track of the Climate Impact Innovations Challenge 2026",
    date: "October 7, 2026",
    isoDate: "2026-10-07",
    excerpt: "CRecTech won Rp5 billion in catalytic funding to pilot its palm-oil-biogas-to-bio-methanol solution in Indonesia, plus a US$50k grant from Sinar Mas and a US$50k investment from Vinerock.",
    href: "https://east.vc/news/press-release/climate-impact-innovations-challenge-2026-awards-rp15-billion-in-catalytic-funding-to-crectech-blueyou-and-macrocycle-technologies",
    source: "East Ventures",
  },
  {
    title: "Meet Activate's First Global Fellows: Singapore",
    date: "September 8, 2026",
    isoDate: "2026-09-08",
    excerpt: "Co-founders Kang Hui Lim and Kok Giap Haw join Activate's first Singapore cohort, for turning stranded biogas and biomass into affordable green methanol with a modular process.",
    href: "https://activate.org/news/meet-activates-first-global-fellows-singapore",
    source: "Activate",
  },
  {
    title: "IP for Growth Awards 2026: Young Innovator",
    date: "August 25, 2026",
    isoDate: "2026-08-25",
    excerpt: "The Intellectual Property Office of Singapore names Dr Lim Kang Hui a 2026 Young Innovator, noting CRecTech has raised close to S$5 million and is preparing a pilot in Indonesia.",
    href: "https://www.ipos.gov.sg/news/events/ip-for-growth-awards-2026/",
    source: "IPOS",
  },
  {
    title: "CRecTech and Pertamina NRE Sign JDA for End-to-End Bio-Methanol Value Chain",
    date: "August 24, 2026",
    isoDate: "2026-08-24",
    excerpt: "On 14 August 2026, CRecTech and Pertamina NRE signed a Joint Development Agreement for a biogas-to-bio-methanol demonstration plant of about 50 tonnes a year at Sei Mangkei, North Sumatra.",
    href: "https://www.crectech.net/news/crectech-pertamina-nre-jda-end-to-end-biomethanol-value-chain",
    source: "CRecTech",
  },
  {
    title: "Pertamina NRE develops a biogas-based bio-methanol ecosystem",
    date: "August 19, 2026",
    isoDate: "2026-08-19",
    excerpt: "Pertamina NRE signs three agreements, including the JDA with CRecTech for a pilot of about 50 t/yr in KEK Sei Mangkei, fed with POME biogas from its biogas power plant there.",
    href: "https://www.antaranews.com/berita/5701244/pertamina-nre-kembangkan-ekosistem-bio-metanol-berbasis-biogas",
    source: "ANTARA News",
  },
  {
    title: "Agreements from the Indonesia–Singapore Leaders' Retreat",
    date: "July 6, 2026",
    isoDate: "2026-07-06",
    excerpt: "The list of agreements from the Leaders' Retreat includes biogas-to-bio-methanol cooperation between Pertamina Power Indonesia and CRecTech.",
    href: "https://en.antaranews.com/news/421721/full-list-of-agreements-from-indonesia-singapore-leaders-retreat",
    source: "ANTARA News",
  },
  {
    title: "DPM Gan Kim Yong on the CRecTech–Pertamina biofuel project",
    date: "June 9, 2026",
    isoDate: "2026-06-09",
    excerpt: "Singapore's Deputy Prime Minister says Singapore and Indonesia are working together on a first-of-its-kind biogas-to-bio-methanol pilot in North Sumatra through the CRecTech–Pertamina project.",
    href: "https://www.meti.gov.sg/newsroom/remarks-by-deputy-prime-minister-and-minister-for-trade-and-industry-gan-kim-yong-at-the-16th-six-bilateral-economic-working-groups-ministerial-meeting-joint-press-conference/",
    source: "Ministry of Trade and Industry",
  },
  {
    title: "Pertamina NRE and CRecTech eye biogas-to-methanol",
    date: "April 14, 2026",
    isoDate: "2026-04-14",
    excerpt: "Coverage of the 1 April 2026 MoU to study a biogas-to-bio-methanol pilot at the Sei Mangkei SEZ, with CRecREF™ to be deployed at the Sei Mangkei biogas power plant.",
    href: "https://bioenergyinternational.com/pertamina-nre-and-crectech-eye-biogas-to-methanol/",
    source: "Bioenergy International",
  },
  {
    title: "Pertamina Power Indonesia Signs MOU with CRecTech for Sumatra Bio-Methanol Pilot",
    date: "April 2, 2026",
    isoDate: "2026-04-02",
    excerpt: "PT Pertamina Power Indonesia and CRecTech sign an MoU for a joint pilot study at Sei Mangkei, witnessed by Enterprise Singapore, Breakthrough Energy, In Group Holdings and Black & Veatch.",
    href: "https://www.crectech.net/news/pertamina-power-indonesia-crectech-sumatra-bio-methanol-pilot",
    source: "CRecTech",
  },
  {
    title: "CRecTech Receives Seed Funding to Drive Green Maritime Fuel and Sustainable Chemical Production",
    date: "January 26, 2026",
    isoDate: "2026-01-26",
    excerpt: "In Group Holdings leads CRecTech's seed round, funding an on-site pilot with partners in 2026 ahead of commercial deployment in 2027–2028.",
    href: "https://www.crectech.net/news/crectech-receives-seed-funding",
    source: "CRecTech",
  },
  {
    title: "IES Sustainability Award 2025 – Promising Start-Ups for Sustainability",
    date: "November 7, 2025",
    isoDate: "2025-11-07",
    excerpt: "The Institution of Engineers, Singapore recognises CRecTech for carrying catalysis research through to scalable reactor engineering.",
    href: "https://www.crectech.net/news/ies-sustainability-award-2025",
    source: "CRecTech",
  },
  {
    title: "iPitch@ACES Award – Best Disruptive Startup",
    date: "November 7, 2025",
    isoDate: "2025-11-07",
    excerpt: "CRecTech wins Best Disruptive Startup at iPitch@ACES, the pitch competition of the Asia Clean Energy Summit.",
    href: "https://www.crectech.net/news/ipitch-aces-award-best-disruptive-startup",
    source: "CRecTech",
  },
  {
    title: "CRecTech Launches Pre-Pilot System to Convert Waste Biogas into Bio-Methanol",
    date: "December 18, 2025",
    isoDate: "2025-12-18",
    excerpt: "CRecTech unveils its integrated pre-pilot reactor, a critical next step toward the commercial deployment of its CRecREF™ direct conversion technology.",
    href: "https://www.manifoldtimes.com/news/singapore-crectech-launches-pre-pilot-system-to-convert-waste-biogas-into-bio-methanol/",
    source: "Manifold Times",
  },
  {
    title: "CRecTech Spotlighted in Enterprise Singapore's CNBC Clean Tech Feature",
    date: "October 31, 2025",
    isoDate: "2025-10-31",
    excerpt: "CNBC's Enterprise Singapore advertorial features CRecTech among Singapore's breakthrough clean-tech ventures moving from lab to global market.",
    href: "https://www.cnbc.com/advertorial/singapore-engine-global-clean-tech/",
    source: "CNBC",
  },
  {
    title: "CRecTech on 'Fueling the Energy Transition' Panel at SWITCH 2025",
    date: "November 2, 2025",
    isoDate: "2025-11-02",
    excerpt: "CRecTech joined experts from Aether Fuels and Octayne Green Fuels on the SWITCH 2025 Main Stage to discuss agricultural waste conversion into exportable energy feedstocks.",
    href: "https://koreatechdesk.com/switch-singapore-2025-deep-tech-collaborations-k-startup-global",
    source: "KoreaTechDesk",
  },
  {
    title: "Hudson Shipping Lines Signals Support for Carbon Recycling Innovation",
    date: "September 25, 2025",
    isoDate: "2025-09-25",
    excerpt: "Hudson Shipping Lines expresses formal support for CRecTech's bio-methanol technology, projecting up to 50% reduction in capital and operating costs versus conventional methods.",
    href: "https://www.hudsonshipping.com/hudson-news/hudson-shipping-lines-signals-support-for-carbon-recycling-innovation",
    source: "Hudson Shipping",
  },
  {
    title: "Dr. Lim Kang Hui Named Forbes 30 Under 30 Asia 2025",
    date: "May 2025",
    isoDate: "2025-05-01",
    excerpt: "Forbes recognises CRecTech's co-founder and CEO in the Industry, Manufacturing & Energy category — one of 19 Singapore individuals on the 2025 Asia list.",
    href: "https://vulcanpost.com/888673/forbes-30-under-30-2025-list-singapore-individuals/",
    source: "Vulcan Post",
  },
  {
    title: "Breakthrough Energy Expands Global Impact with First Southeast Asia Fellows",
    date: "October 28, 2024",
    isoDate: "2024-10-28",
    excerpt: "Breakthrough Energy, Temasek, and Enterprise Singapore announce CRecTech as part of the inaugural BE Fellows – Southeast Asia cohort, backed by a USD $500K grant.",
    href: "https://www.breakthroughenergy.org/newsroom/articles/southeast-asia-fellows/",
    source: "Breakthrough Energy",
  },
  {
    title: "Temasek: Breakthrough Energy Fellows SE Asia Announces First Cohort",
    date: "October 28, 2024",
    isoDate: "2024-10-28",
    excerpt: "Temasek's official newsroom covers the inaugural BE Fellows – Southeast Asia cohort, with CRecTech selected to develop bio-methanol production for maritime decarbonisation.",
    href: "https://www.temasek.com.sg/en/news-and-resources/news-room/news/2024/BEF-SEA_announce_first_cohort",
    source: "Temasek",
  },
  {
    title: "CRecTech Featured in Goldbell Sustainability Spotlight",
    date: "April 23, 2025",
    isoDate: "2025-04-23",
    excerpt: "Goldbell Innovate highlights its investment in CRecTech, an NUS spin-off developing energy-efficient catalysts for low-carbon methanol production at scale.",
    href: "https://goldbell.com.sg/resource/crectech/",
    source: "Goldbell",
  },
  {
    title: "From PhD to Startup: CRecTech's Mission to Decarbonise Maritime",
    date: "July 3, 2025",
    isoDate: "2025-07-03",
    excerpt: "The Climate Map profiles CRecTech's founding story, the CRecREF™ catalyst, $1.8M raised, and regional expansion plans across Malaysia, Indonesia, Vietnam, India, and China.",
    href: "https://the-climate-map.org/climate-deals/from-phd-to-startup",
    source: "The Climate Map",
  },
  {
    title: "Singapore Boosts Funding for Deep Tech Startups — CRecTech Among First BE Fellows SEA",
    date: "October 31, 2024",
    isoDate: "2024-10-31",
    excerpt: "Coverage of Singapore's S$440M Startup SG Equity top-up and CRecTech's selection as an inaugural Breakthrough Energy Fellows – Southeast Asia cohort member.",
    href: "https://www.thestorythailand.com/en/31/10/2024/140562/",
    source: "The Story Thailand",
  },
];

/** News items, newest first. */
export const newsByDate = [...newsItems].sort((a, b) => b.isoDate.localeCompare(a.isoDate));
