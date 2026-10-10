import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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

export const metadata: Metadata = {
  metadataBase: new URL("https://premium-website-pearl.vercel.app"),
  title: "Discover Nepal",
  description: "Experience the breathtaking landscapes and unparalleled adventures of Nepal through an interactive cinematic journey.",
  openGraph: {
    title: "Discover Nepal",
    description: "An immersive scrollytelling web experience flying through the Himalayas down to the Terai plains.",
    url: "https://premium-website-pearl.vercel.app",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body className="min-h-full flex flex-col bg-black text-white">
        <div className="flex-1">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
