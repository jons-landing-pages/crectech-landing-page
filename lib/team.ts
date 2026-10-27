export interface Person {
  name: string;
  title?: string;
  img: string;
  bio?: string;
  /** Leave empty until a real profile URL is known; the link is then hidden. */
  linkedin?: string;
}

export const founders: Person[] = [
  {
    name: "Dr. Kang Hui Lim",
    title: "Co-Founder & Chief Executive Officer",
    img: "/images/team/kang-hui.png",
    bio: "Ph.D. Chemical Engineering, NUS (President's Graduate Fellow). Forbes 30 Under 30 Asia. 50+ papers in JACS, Advanced Materials and ACS Catalysis.",
  },
  {
    name: "Dr. Kok Giap Haw",
    title: "Co-Founder & Chief Technology Officer",
    img: "/images/team/kok-giap.png",
    bio: "Ph.D. Chemistry, University of Caen (2015). Post-doctoral research across France, Belgium, China and Singapore. Expert in catalysis and porous materials.",
  },
  {
    name: "KK Lai",
    title: "Vice President, Business Development",
    img: "/images/team/kk-lai.png",
    bio: "40+ years in global agricultural supply chains and logistics with ADM, Conagra, FE Zuellig, FCStone and Yugrusi.",
  },
];

export const engineers: Person[] = [
  { name: "Patnam Ramalingam", title: "Senior Process Engineer", img: "/images/team/rama.png" },
  { name: "Muhammad Syahid Bin Husuhaimi", title: "Process Engineer", img: "/images/team/syahid.png" },
  { name: "Kyle Tye Hao Fei", title: "Senior Operations Engineer", img: "/images/team/kyle.png" },
];

export const advisors: Person[] = [
  { name: "Sameer Kalra", img: "/images/advisors/sameer.png" },
  { name: "Lim Heng Young", img: "/images/advisors/lim-heng-young.png" },
  { name: "Saw Biing Huei", img: "/images/advisors/saw-biing-huei.png" },
  { name: "Colin Chua", img: "/images/advisors/colin-chua.png" },
];
