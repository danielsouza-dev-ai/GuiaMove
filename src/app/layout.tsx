import type { Metadata, Viewport } from "next";
import { Outfit, Fredoka } from "next/font/google";
import { PwaRegister } from "@/components/shared/PwaRegister";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://guiamove.vercel.app"),
  title:
    "GuiaMove — Ferramentas Visuais de Rotina Infantil e Regulação Sensorial",
  description:
    "Ferramentas visuais gratuitas de rotina infantil, temporizador visual para autismo, termômetro sensorial (Zones of Regulation) e quadro Primeiro/Depois ARASAAC por @dansouza.move.",
  keywords: [
    "ferramentas visuais de rotina infantil",
    "temporizador visual autismo",
    "termômetro sensorial Zones of Regulation",
    "quadro primeiro e depois ARASAAC",
    "autonomia infantil TEA TDAH",
    "GuiaMove",
  ],
  applicationName: "GuiaMove",
  alternates: {
    canonical: "https://guiamove.vercel.app",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://guiamove.vercel.app",
    title:
      "GuiaMove — Ferramentas Visuais de Rotina Infantil e Regulação Sensorial",
    description:
      "Temporizador visual, termômetro sensorial e rotinas com pictogramas ARASAAC gratuitos para casa, escola e clínica. Sem cadastro e direto no navegador.",
    siteName: "GuiaMove",
    images: [
      {
        url: "https://guiamove.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "GuiaMove — Ferramentas Visuais de Rotina Infantil e Regulação Sensorial",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "GuiaMove — Ferramentas Visuais de Rotina Infantil e Regulação Sensorial",
    description:
      "Temporizador visual, termômetro sensorial e rotinas visuais ARASAAC gratuitos para rotina em casa e na clínica.",
    images: ["https://guiamove.vercel.app/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "GuiaMove",
  },
};

export const viewport: Viewport = {
  themeColor: "#0284C7",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${outfit.variable} ${fredoka.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#F0F9FF] text-[#0F172A]">
        <PwaRegister />
        {children}
      </body>
    </html>
  );
}
