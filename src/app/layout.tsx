import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/layout/PageTransition";
import CookieBanner from "@/components/ui/CookieBanner";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  metadataBase: new URL("https://veratori.com"),
  title: "Veratori — Automated Inventory for Food Service",
  description:
    "Veratori installs computer vision hardware in commercial kitchens and walk-in coolers, delivering real-time inventory tracking, daily manager digests, and automated anomaly alerts — no manual counts required.",
  icons: {
    icon: "/images/Logos/Brand Identity/Logos/Logo_dark.png",
    apple: "/images/Logos/Brand Identity/Logos/Logo_dark.png",
  },
  openGraph: {
    title: "Veratori — Automated Inventory for Food Service",
    description:
      "Real-time inventory tracking for restaurants using LiDAR depth sensing and edge AI. No manual counts, no clipboards — zero guesswork.",
    url: "https://veratori.com",
    siteName: "Veratori",
    images: [
      {
        url: "/images/assets/og-image.png",
        width: 1200,
        height: 630,
        alt: "Veratori — Automated Inventory for Food Service",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Veratori — Automated Inventory for Food Service",
    description:
      "Real-time inventory tracking for restaurants using LiDAR depth sensing and edge AI.",
    images: ["/images/assets/og-image.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider>
          <Header />
          <PageTransition>{children}</PageTransition>
          <Footer />
          <CookieBanner />
        </ThemeProvider>
      </body>
    </html>
  );
}
