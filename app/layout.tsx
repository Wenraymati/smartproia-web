import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // <--- ESTA ES LA LÍNEA QUE FALTABA (O ESTABA MAL)

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SmartProIA",
  description: "Inversión Tecnológica y Cuántica",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>{children}</body>
    </html>
  );
}