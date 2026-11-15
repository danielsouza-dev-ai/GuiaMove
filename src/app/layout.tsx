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
  title: "GuiaMove — Ferramentas de Rotina e Autonomia | @dansouza.move",
  description:
    "Ferramentas gratuitas de rotina, autonomia e movimento por @dansouza.move",
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
