import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react"
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
  title: 'Calculateurs Fiscaux | Optimisez vos finances en France',
  description: 'Utilisez nos calculateurs fiscaux pour comparer les coûts d\'achat professionnel vs personnel et estimer votre impôt sur le revenu. Optimisez vos décisions financières en France.',
  keywords: 'calculateur fiscal, impôt sur le revenu, achat professionnel, achat personnel, comparaison coûts, optimisation fiscale, France, TVA, charges sociales',
  authors: [{ name: 'Votre Nom', url: 'https://votre-site.com' }],
  creator: 'Votre Nom',
  publisher: 'Votre Nom',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Calculateurs Fiscaux | Optimisez vos finances en France',
    description: 'Comparez les coûts d\'achat professionnel vs personnel et estimez votre impôt sur le revenu pour optimiser vos décisions financières en France.',
    url: 'https://tax-saver.vercel.app',
    siteName: 'Calculateurs Fiscaux',
    images: [
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
  alternates: {
    canonical: 'https://votre-site.com',
    languages: {
      'fr-FR': 'https://votre-site.com/fr',
      'en-US': 'https://votre-site.com/en',
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
      <Analytics />
      </body>
    </html>
  );
}
