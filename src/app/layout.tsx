import type { Metadata } from "next";
import { Quicksand, Pixelify_Sans, Caveat, Noto_Sans_Khmer } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-quicksand",
});

const pixelifySans = Pixelify_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-pixelify",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-caveat",
});

const notoSansKhmer = Noto_Sans_Khmer({
  subsets: ["khmer"],
  weight: ["700"],
  variable: "--font-khmer",
});

export const metadata: Metadata = {
  title: "Store Khmer — Matching Game",
  description: "Help Ma-Yay shop for Khmer New Year! Learn Khmer words through a fun matching game.",
  openGraph: {
    title: "Store Khmer — Matching Game",
    description: "Help Ma-Yay shop for Khmer New Year! Learn Khmer words through a fun matching game.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Store Khmer — Matching Game",
    description: "Help Ma-Yay shop for Khmer New Year! Learn Khmer words through a fun matching game.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${quicksand.variable} ${pixelifySans.variable} ${caveat.variable} ${notoSansKhmer.variable} h-full`}
    >
      <body className="min-h-full flex flex-col font-[family-name:var(--font-quicksand)]">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
