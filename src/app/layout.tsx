"use client";

import type { Metadata } from "next";
import localFont from "next/font/local";
import { Cormorant_Garamond, Gayathri } from "next/font/google";
import "./globals.css";
import dynamic from "next/dynamic";
import Footer from "@/components/ui/Footer";

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

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant-garamond",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
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
        <Footer />
      </body>
    </html>
  );
}
