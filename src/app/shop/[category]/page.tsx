"use client";

import { useShop } from "@/lib/hooks/useShop";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "next/navigation";
import BlurText from "@/components/BlurText";
import { ProductCard } from "@/components/shop/product-card";

export default function CategoryPage() {
  const params = useParams();
  const categorySlug = params.category as string;
  // Show all products for "perfumes" category (same as /shop)
  const effectiveCategory = categorySlug === "perfumes" ? undefined : categorySlug;
  const { products, loading } = useShop(effectiveCategory);
  
  const isComingSoon = categorySlug === "apparel" || categorySlug === "accessories";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-2 border-white/10 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-16">
      {/* Category Header */}
      <section className="py-12 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-16">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="max-w-2xl"
        >
          <span className="text-white/30 text-[10px] uppercase tracking-[0.5em] mb-6 block">Collection</span>
          <BlurText 
            text={categorySlug} 
            className="text-6xl md:text-9xl font-medium leading-[0.8] mb-8 capitalize"
          />
          <p className="text-white/40 text-lg md:text-xl font-light leading-relaxed">
            Explore our premium selection within this category.
          </p>
        </motion.div>

        {!isComingSoon && (
          <div className="flex gap-4">
              <span className="text-white/20 text-[10px] uppercase tracking-[0.3em] self-end">{products.length} Items</span>
          </div>
        )}
      </section>

      {/* Product Grid / Coming Soon State */}
      <section className="flex-1">
        {isComingSoon ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-32 flex flex-col items-center justify-center text-center space-y-6"
          >
            <h2 className="text-5xl md:text-8xl font-medium tracking-tighter opacity-10">COMING SOON</h2>
            <p className="text-white/30 text-sm uppercase tracking-[0.5em] font-light">
              The {categorySlug} collection is currently in development.
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12 md:gap-x-10 md:gap-y-20">
            <AnimatePresence mode="popLayout">
              {products.map((product, index) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  categorySlug={categorySlug}
                  index={index}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>
    </div>
  );
}
