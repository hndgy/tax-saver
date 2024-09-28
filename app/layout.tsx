import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: 'Calculateur Achat Pro vs Perso | Comparaison des coûts d\'achat',
  description: 'Comparez facilement le coût réel d\'un achat personnel à celui d\'un achat professionnel. Optimisez vos décisions financières avec notre calculateur interactif.',
  keywords: 'calculateur, achat professionnel, achat personnel, comparaison coûts, optimisation fiscale, France',
  authors: [{ name: 'hndgy', url: 'https://github.com/hndgy' }],
  openGraph: {
    title: 'Calculateur Achat Pro vs Perso',
    description: 'Comparez les coûts d\'achat personnel et professionnel pour optimiser vos décisions financières.',
    url: 'https://tax-saver.vercel.app/',
    siteName: 'Calculateur Achat Pro vs Perso',
    images: [
      {
        url: 'https://votre-site.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Calculateur Achat Pro vs Perso',
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
