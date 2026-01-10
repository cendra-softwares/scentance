"use client";

import type { Metadata } from "next";
import localFont from "next/font/local";
import { Geist, Geist_Mono, Gayathri } from "next/font/google";
import "./globals.css";
import dynamic from "next/dynamic";
import Footer from "@/components/footer";

const MeshBackground = dynamic(() => import("@/components/ui/mesh-background"), { ssr: false });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
        <Footer />
      </body>
    </html>
  );
}
