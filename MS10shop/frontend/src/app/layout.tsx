import type { Metadata } from "next";
import "@/styles/globals.css";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "MS10Shop - Maillots & Kits Sportifs Premium",
    template: "%s | MS10Shop",
  },
  description:
    "MS10Shop - Votre destination premium pour les maillots, ensembles et accessoires des plus grands clubs et équipes nationales du monde entier.",
  keywords: [
    "jersey", "football", "soccer", "kit", "maillot", "club", "national team",
    "Real Madrid", "Barcelona", "Manchester United", "PSG", "Al Hilal", "Wydad",
    "Raja", "Espérance", "Al Ahly", "MS10Shop", "tracksuit", "survetement",
  ],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "MS10Shop",
    title: "MS10Shop - Maillots & Kits Sportifs Premium",
    description: "Votre destination premium pour les maillots sportifs",
    images: ["/images/og-image.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "MS10Shop - Maillots & Kits Sportifs Premium",
    description: "Votre destination premium pour les maillots sportifs",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" dir="ltr" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-dark-950 text-white antialiased font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
