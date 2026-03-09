import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SmartProIA — Señales Crypto con IA | Canal Telegram 6AM",
  description:
    "Bot autónomo que analiza BTC, ETH y SOL cada mañana a las 6AM y te envía una señal clara: GO · CAUTION · NO-GO. 7 días gratis. Sin acceso a tu cuenta.",
  keywords: ["señales crypto", "bot trading", "bitcoin señales", "inteligencia artificial trading", "canal telegram crypto", "SmartProIA"],
  authors: [{ name: "SmartProIA" }],
  openGraph: {
    title: "SmartProIA — Señales Crypto con IA cada mañana",
    description: "Bot autónomo analiza BTC, ETH y SOL a las 6AM. Señal clara GO/CAUTION/NO-GO. 7 días gratis.",
    url: "https://smartproia.com",
    siteName: "SmartProIA",
    locale: "es_CL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SmartProIA — Señales Crypto con IA",
    description: "Bot autónomo analiza BTC, ETH y SOL a las 6AM. Señal clara GO/CAUTION/NO-GO. 7 días gratis.",
  },
  metadataBase: new URL("https://smartproia.com"),
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://smartproia.com/#organization",
      name: "SmartProIA",
      url: "https://smartproia.com",
      email: "hola@smartproia.com",
      description: "Bot autónomo de señales crypto con IA. Análisis diario de BTC, ETH y SOL a las 6AM.",
      foundingDate: "2025",
      areaServed: "CL",
    },
    {
      "@type": "Product",
      "@id": "https://smartproia.com/#product",
      name: "SmartProIA — Canal Señales Crypto",
      description: "Señales diarias de trading crypto con IA: GO · CAUTION · NO-GO. Análisis de BTC, ETH y SOL cada mañana a las 6AM vía Telegram.",
      brand: { "@type": "Brand", name: "SmartProIA" },
      offers: [
        {
          "@type": "Offer",
          name: "Canal Básico",
          price: "15",
          priceCurrency: "USD",
          priceValidUntil: "2027-01-01",
          availability: "https://schema.org/InStock",
          url: "https://smartproia.com/#precios",
        },
        {
          "@type": "Offer",
          name: "Canal PRO",
          price: "25",
          priceCurrency: "USD",
          priceValidUntil: "2027-01-01",
          availability: "https://schema.org/InStock",
          url: "https://smartproia.com/#precios",
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
