import React from 'react';
import Link from 'next/link';

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-white font-[family-name:var(--font-cormorant-garamond)]">
      {/* Shop Header */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-black/20 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold tracking-widest hover:opacity-70 transition-opacity">
            SCENTENCE
          </Link>
          
          <nav className="hidden md:flex items-center gap-12 text-[10px] uppercase tracking-[0.3em] font-medium text-white/50">
            <Link href="/shop/perfumes" className="hover:text-white transition-colors">Perfumes</Link>
            <Link href="/shop/apparel" className="hover:text-white transition-colors">Apparel</Link>
            <Link href="/shop/accessories" className="hover:text-white transition-colors">Accessories</Link>
          </nav>

          <div className="w-24 md:w-auto" /> {/* Spacer to balance logo */}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {children}
      </main>
    </div>
  );
}
