"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
  categorySlug?: string;
  index?: number;
}

export function ProductCard({ product, categorySlug, index = 0 }: ProductCardProps) {
  const finalCategorySlug = categorySlug || "all";
  const productUrl = `/shop/${finalCategorySlug}/${product.id}`;

  const priceValue = parseFloat(product.price.replace(/,/g, '')) || 0;
  const discount = product.discount_percent || 0;
  const finalPrice = discount > 0 ? priceValue * (1 - discount / 100) : priceValue;
  const hasDiscount = discount > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <Link href={productUrl} className="group block space-y-6">
        <div className="aspect-[4/5] relative overflow-hidden rounded-[2rem] bg-neutral-900 shadow-2xl transition-all duration-700 group-hover:rounded-[1.5rem]">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-110 opacity-90 group-hover:opacity-100"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
          
          {/* View Details Overlay */}
          <div className="absolute bottom-6 left-6 right-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
            <div className="w-full py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-center text-[10px] uppercase tracking-[0.2em] font-bold text-white">
              View Details
            </div>
          </div>

          {/* Discount Badge */}
          {hasDiscount && (
            <div className="absolute top-6 left-6">
              <span className="px-3 py-1 bg-rose-500 backdrop-blur-md border border-rose-400 rounded-full text-[8px] uppercase tracking-widest text-white">
                -{discount}%
              </span>
            </div>
          )}

          {/* New/Featured Badge - Optional */}
          {index < 2 && !hasDiscount && (
            <div className="absolute top-6 left-6">
              <span className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[8px] uppercase tracking-widest text-white">
                New Arrival
              </span>
            </div>
          )}
        </div>
        
        <div className="space-y-3 px-2">
          <div className="flex flex-col gap-1">
            <span className="text-white/40 text-[9px] uppercase tracking-[0.3em]">
              {product.category || "Premium Collection"}
            </span>
            <h4 className="text-xl md:text-2xl font-medium tracking-tight group-hover:text-white/80 transition-colors">
              {product.name}
            </h4>
          </div>
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              {hasDiscount && (
                <span className="text-white/40 text-sm font-light line-through">
                  ₹{priceValue.toLocaleString("en-IN")}
                </span>
              )}
              <p className={`font-light text-lg ${hasDiscount ? 'text-rose-400' : 'text-white/60'}`}>
                ₹{Math.round(finalPrice).toLocaleString("en-IN")}
              </p>
            </div>
            {product.volume && (
              <span className="text-white/60 text-[9px] uppercase tracking-[0.2em]">
                {product.volume} ml
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
