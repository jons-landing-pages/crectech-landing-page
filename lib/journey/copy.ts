/**
 * Text for each journey state, in the same order as `journeyStates`. Facts come from the pitch
 * deck (page in brackets) or from verified news; keep every sentence checkable.
 */
export interface JourneyCopy {
  kicker: string;
  title: string;
  body: string;
  /** Optional balanced equation shown under the title. */
  equation?: string;
  /** Optional source line under the body. */
  source?: string;
}

export const journeyCopy: Record<string, JourneyCopy> = {
  overview: {
    kicker: "How it works",
    title: "Biogas from the mill's lagoon is cleaned, converted to methanol in a single container, and stored on site.",
    // Deck p11 (pilot layout).
    body: "At Sei Mangkei, the pilot takes its gas from the covered lagoon of Pertamina NRE's biogas power plant. A pre-treatment unit cleans the gas, a reactor container turns it into methanol in two steps, and a storage unit holds the product beside the palm oil mill.",
  },
  feedstock: {
    kicker: "01 · Feedstock",
    title: "Palm oil mills hold their wastewater in open lagoons, where it gives off methane.",
    // Deck p2.
    body: "One mill can release up to 20,000 Nm³ of biogas a day, a mix of methane and CO₂. Less than 10% of that gas is captured and used, and Indonesia alone has more than 1,000 mills.",
    source: "Mill count: World Biogas Association, Indonesia market report (2022)",
  },
  plant: {
    kicker: "02 · On site",
    title: "We put the bio-methanol plant beside the lagoon, so the biogas is used where it is made.",
    // Deck p10–11; JDA signed 14 August 2026 (CRecTech, ANTARA).
    body: "Our first on-site pilot, about 50 tonnes of methanol a year, is being developed with Pertamina NRE at its biogas power plant in the Sei Mangkei Special Economic Zone, North Sumatra. A pre-treatment unit cleans the gas, one shipping container holds both reactors, and the methanol is stored on site.",
  },
  reactors: {
    kicker: "03 · Reactor unit",
    title: "Inside the container, two reactors replace the four steps of a conventional plant.",
    // Deck p4–5.
    body: "Reactor 1 converts raw biogas and steam into syngas over the CRecREF™ catalyst, and Reactor 2 converts that syngas into methanol. The conventional route first strips CO₂ out of the biogas and later adds CO₂ back to correct the gas mix; our route needs neither step.",
  },
  catalyst: {
    kicker: "04 · Catalyst",
    title: "The CRecREF™ catalyst is a ceramic pellet with seven channels for the gas to flow through.",
    // Deck p4 (pellet photo, WO/2023/146478, 50% CAPEX and OPEX).
    body: "Because it works on raw biogas, with the methane and CO₂ still mixed, the plant avoids the cost of upgrading and conditioning the gas. That is how the process cuts capital and operating costs by about half.",
    source: "International patent application WO/2023/146478",
  },
  reforming: {
    kicker: "05 · Reforming",
    title: "On the catalyst surface, methane, CO₂ and steam break apart and recombine as syngas.",
    equation: "3 CH₄ + CO₂ + 2 H₂O → 4 CO + 8 H₂",
    // Deck p5: biogas + H₂O(g) → syngas H₂ : CO = 2 : 1.
    body: "The syngas leaves with two hydrogen molecules for every carbon monoxide molecule, which is the ratio methanol synthesis needs.",
  },
  synthesis: {
    kicker: "06 · Synthesis",
    title: "In Reactor 2, each carbon monoxide molecule joins two hydrogen molecules to form methanol.",
    equation: "4 CO + 8 H₂ → 4 CH₃OH",
    body: "The 24 atoms in this sequence are the same ones that entered Reactor 1: four carbon, four oxygen and sixteen hydrogen.",
  },
  product: {
    kicker: "07 · Product",
    title: "The plant stores marine-grade bio-methanol on site, made from biogas that most mills still let escape.",
    // Deck p4 (marine methanol grade), p7 (0.2% sustainable supply).
    body: "Methanol is one of the few low-carbon fuels that shipping can adopt at scale this decade, yet only about 0.2% of the world's methanol supply is sustainable today.",
    source: "Sustainable share: Journal of CO₂ Utilization 68 (2023) 102345",
  },
};
