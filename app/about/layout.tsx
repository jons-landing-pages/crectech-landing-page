import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Meet the CRecTech team: an NUS deep-tech company backed by Breakthrough Energy, Temasek and SGInnovate that turns palm oil mill biogas into bio-methanol.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
