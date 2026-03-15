"use client";

import { motion } from "framer-motion";
import { useShop } from "@/lib/hooks/useShop";
import BlurText from "@/components/BlurText";
import { ProductCard } from "@/components/shop/product-card";

export default function ShopPage() {
  const { products, loading } = useShop();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-2 border-white/10 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-16">
      {/* Header */}
      <section className="py-12 border-b border-white/5 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <span className="text-white/30 text-[10px] uppercase tracking-[0.5em] mb-6 block">The Collections</span>
          <BlurText 
            text="Curated Essence" 
            className="text-6xl md:text-9xl font-medium leading-[0.8] mb-8"
          />
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <p className="text-white/40 text-lg md:text-xl font-light max-w-xl leading-relaxed">
              Explore our archive of premium fragrances and apparel, meticulously crafted for the discerning individual.
            </p>
            <span className="text-white/20 text-[10px] uppercase tracking-[0.3em] shrink-0">
              {products.length} Masterpieces
            </span>
          </div>
        </motion.div>
      </section>

      {/* Product Grid */}
      <section className="flex-1">
        {products.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-white/40 font-light italic">No products found in our current collection.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12 md:gap-x-10 md:gap-y-20">
            {products.map((product, index) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                index={index}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
