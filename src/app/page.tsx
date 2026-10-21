"use client";

import { useMemo } from "react";
import { useShop } from "@/lib/hooks/useShop";
import { SiteNav } from "@/components/landing/site-nav";
import { Hero } from "@/components/landing/hero";
import { Manifesto } from "@/components/landing/manifesto";
import { CollectionRail } from "@/components/landing/collection-rail";
import { ScentAnatomy } from "@/components/landing/scent-anatomy";
import { VelocityMarquee } from "@/components/landing/velocity-marquee";
import { Chapters } from "@/components/landing/chapters";
import { Lookbook } from "@/components/landing/lookbook";
import { Finale } from "@/components/landing/finale";

export default function Home() {
  const { products, loading } = useShop();

  // The newest fragrance with a complete note pyramid takes the spotlight.
  const spotlight = useMemo(
    () => products.find((p) => p.top_note && p.middle_note && p.bottom_note),
    [products]
  );

  return (
    <div className="relative overflow-x-clip bg-ink text-bone">
      <SiteNav />
      <Hero />

      {/* Everything after the hero slides up over it like a curtain */}
      <main className="relative z-10 rounded-t-[1.75rem] bg-ink shadow-[0_-40px_90px_rgba(0,0,0,0.6)] sm:rounded-t-[2.75rem]">
        <Manifesto />
        <CollectionRail products={products} loading={loading} />
        {spotlight && <ScentAnatomy product={spotlight} />}
        <VelocityMarquee />
        <Chapters />
        <Lookbook />
        <Finale />
      </main>

      <div aria-hidden className="grain" />
    </div>
  );
}
