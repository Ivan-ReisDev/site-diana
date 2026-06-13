import type { Metadata } from "next";
import { Geist_Mono, Nunito, Pacifico, Playfair_Display } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
});

const pacifico = Pacifico({
  variable: "--font-pacifico",
  subsets: ["latin"],
  weight: "400",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Diana faz 1 ano | Convite",
  description:
    "Convite digital real da Diana: 11 de outubro, 13 horas, Casa de Festas Turma da Kali.",
  openGraph: {
    title: "Diana faz 1 ano",
    description: "Prepara-se: a festa real está prestes a começar. Confirme presença até 20 de setembro.",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 800,
        alt: "Decoração delicada para festa infantil",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${nunito.variable} ${playfair.variable} ${pacifico.variable} ${geistMono.variable} scroll-smooth antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
