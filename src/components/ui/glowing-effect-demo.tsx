
"use client";

import { Beaker, Droplets, Heart, Star, Crown } from "lucide-react";
import { motion } from "framer-motion";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { cn } from "@/lib/utils";
import React from "react";

export function GlowingEffectDemo() {
  return (
    <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-4 xl:max-h-[34rem] xl:grid-rows-2">
      <GridItem
        area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]"
        icon={<Beaker className="h-4 w-4" />}
        title="Artisan Craftsmanship"
        description="Each fragrance is meticulously crafted by master perfumers using time-honored techniques."
      />
      <GridItem
        area="md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]"
        icon={<Droplets className="h-4 w-4" />}
        title="Premium Ingredients"
        description="Sourced from the finest essences around the world, ensuring unparalleled quality and purity."
      />
      <GridItem
        area="md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]"
        icon={<Heart className="h-4 w-4" />}
        title="Signature Scents"
        description="Unique blends that capture emotions and memories, designed to make every moment unforgettable."
      />
      <GridItem
        area="md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]"
        icon={<Star className="h-4 w-4" />}
        title="Luxury Packaging"
        description="Elegant designs that reflect the sophistication of our fragrances, perfect for gifting or personal indulgence."
      />
      <GridItem
        area="md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]"
        icon={<Crown className="h-4 w-4" />}
        title="Exclusive Collections"
        description="Limited-edition releases that offer rare and exquisite olfactory experiences for discerning connoisseurs."
      />
    </ul>
  );
}

interface GridItemProps {
  area: string;
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
}

const GridItem = React.memo(({ area, icon, title, description }: GridItemProps) => {
  return (
    <motion.li
      className={cn("min-h-[14rem] list-none", area)}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="relative h-full rounded-[1.25rem] border-[0.75px] border-border p-2 md:rounded-[1.5rem] md:p-3">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
          borderWidth={3}
        />
        <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border-[0.75px] bg-background p-6 shadow-sm dark:shadow-[0px_0px_27px_0px_rgba(45,45,45,0.3)] md:p-6">
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            <div className="w-fit rounded-lg border-[0.75px] border-border bg-muted p-2 text-glow">
              {icon}
            </div>
            <div className="space-y-3">
              <h3 className="pt-0.5 text-xl leading-[1.375rem] font-semibold font-sans tracking-[-0.04em] md:text-2xl md:leading-[1.875rem] text-balance text-foreground text-glow">
                {title}
              </h3>
              <h2 className="[&_b]:md:font-semibold [&_strong]:md:font-semibold font-sans text-sm leading-[1.125rem] md:text-base md:leading-[1.375rem] text-muted-foreground text-glow">
                {description}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </motion.li>
  );
});

GridItem.displayName = "GridItem";
