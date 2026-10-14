import type { Metadata } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import "@/app/globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";

// Archivo is variable on width; the "wdth" axis gives the expanded display cut.
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | CRecTech",
    default: "CRecTech — Breakthrough Catalytic Technology",
  },
  description:
    "CRecTech turns palm oil mill biogas into marine-grade bio-methanol with its CRecREF™ catalyst, in two process steps instead of four and at about half the capital and operating cost.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${archivo.variable} ${plexMono.variable}`}>
      <body>
        <SmoothScroll />
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
