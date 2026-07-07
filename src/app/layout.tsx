import type { Metadata } from "next";
import { Newsreader, Geist } from "next/font/google";
import AuthShell from "./auth-shell";
import Providers from "./providers";
import SiteNav from "@/components/features/SiteNav";
import SiteFooter from "@/components/features/SiteFooter";
import "./globals.css";
import "@/styles/components.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export const metadata: Metadata = {
  title: { default: "Kiri · Know what your collection is worth", template: "%s · Kiri" },
  description:
    "Track prices across Magic, Pokémon, Yu-Gi-Oh, and Sorcery. Add cards in seconds, follow every swing, and trade with confidence.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthShell>
      <html lang="en" data-theme="light" className={`${newsreader.variable} ${geist.variable}`}>
        <body>
          <Providers>
            <SiteNav />
            <main>{children}</main>
            <SiteFooter />
          </Providers>
        </body>
      </html>
    </AuthShell>
  );
}
