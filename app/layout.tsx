import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SmartProIA — Bots de WhatsApp IA para tu negocio",
  description:
    "Automatizá la atención al cliente de tu negocio con WhatsApp e inteligencia artificial. Setup en 7 días. Ideal para gimnasios, clínicas, inmobiliarias y más.",
  keywords: ["bot whatsapp", "automatización whatsapp", "bot IA negocios", "whatsapp business bot", "atención al cliente IA", "SmartProIA", "gimnasio bot", "Chile automatización"],
  authors: [{ name: "SmartProIA" }],
  openGraph: {
    title: "SmartProIA — Bots de WhatsApp IA para tu negocio",
    description: "Bots con IA que atienden, califican y cierran leads 24/7 por WhatsApp. Setup en 7 días.",
    url: "https://smartproia.com",
    siteName: "SmartProIA",
    locale: "es_CL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SmartProIA — Bots de WhatsApp IA para tu negocio",
    description: "Bots con IA que atienden, califican y cierran leads 24/7 por WhatsApp. Setup en 7 días.",
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
      description: "Bots de WhatsApp con IA para negocios en Chile y LatAm. Atención automatizada 24/7.",
      foundingDate: "2025",
      areaServed: ["CL", "AR", "MX", "CO", "PE"],
    },
    {
      "@type": "Product",
      "@id": "https://smartproia.com/#product",
      name: "SmartProIA — Bot de WhatsApp IA",
      description: "Bot de WhatsApp con inteligencia artificial para negocios. Atiende clientes, califica leads y cierra ventas 24/7.",
      brand: { "@type": "Brand", name: "SmartProIA" },
      offers: [
        {
          "@type": "Offer",
          name: "Plan Starter",
          price: "80",
          priceCurrency: "USD",
          priceValidUntil: "2027-01-01",
          availability: "https://schema.org/InStock",
          url: "https://smartproia.com/#precios",
        },
        {
          "@type": "Offer",
          name: "Plan Pro",
          price: "150",
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
