import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display, Anton } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import { Footer } from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
});

const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: ["400"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://discovernepaltours.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Discover Nepal",
  description: "Experience the breathtaking landscapes and unparalleled adventures of Nepal through an interactive cinematic journey.",
  alternates: {
    canonical: siteUrl,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  openGraph: {
    title: "Discover Nepal",
    description: "An immersive scrollytelling web experience flying through the Himalayas down to the Terai plains.",
    url: siteUrl,
    siteName: "Discover Nepal",
    images: [
      {
        url: "/assets/thumb_everest.jpg",
        width: 1280,
        height: 720,
        alt: "The Himalayas",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": ["Organization", "TravelAgency"],
  name: "Discover Nepal",
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
  image: `${siteUrl}/assets/thumb_everest.jpg`,
  description: "Experience the breathtaking landscapes and unparalleled adventures of Nepal through an interactive cinematic journey.",
  telephone: "+977-1-4400000",
  email: "booking@discovernepaltours.vercel.app",
  address: {
    "@type": "PostalAddress",
    streetAddress: "123 Thamel Marg",
    addressLocality: "Kathmandu",
    postalCode: "44600",
    addressCountry: "NP"
  },
  sameAs: [
    "https://facebook.com/discovernepal",
    "https://instagram.com/discovernepal",
    "https://twitter.com/discovernepal"
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${anton.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-black text-white">
        <div className="flex-1">
          {children}
        </div>
        <Footer />
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
}
