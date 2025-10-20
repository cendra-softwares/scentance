"use client";

import type { Metadata } from "next";
import localFont from "next/font/local";
import { Gayathri } from "next/font/google";
import "./globals.css";
import dynamic from "next/dynamic";

const MeshBackground = dynamic(() => import("@/components/ui/mesh-background"), { ssr: false });

const geistSans = localFont({
  src: "../fonts/GeistVariableVF.woff2",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "../fonts/GeistMonoVariableVF.woff2",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const cormorantGaramond = localFont({
  src: "../../public/fonts/Cormorant_Garamond/CormorantGaramond-VariableFont_wght.ttf",
  variable: "--font-cormorant-garamond",
  weight: "300 700",
});

const gayathri = Gayathri({
  variable: "--font-gayathri",
  subsets: ["latin"],
  weight: "700", // Assuming 'bold' corresponds to a weight of 700
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cormorantGaramond.variable} ${gayathri.variable} antialiased`}
      >
        <MeshBackground className="fixed inset-0 -z-10" />
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
