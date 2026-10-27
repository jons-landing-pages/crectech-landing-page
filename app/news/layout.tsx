import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "News",
  description:
    "CRecTech news and press coverage, including the 2026 pilot agreement with Pertamina NRE.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
