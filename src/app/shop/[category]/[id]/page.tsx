"use client";

import { useShop } from "@/lib/hooks/useShop";
import { useCart } from "@/lib/store/useCart";
import Image from "next/image";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

export default function ProductDetailPage() {
  const params = useParams();
  const { products, loading } = useShop();
  const { addItem } = useCart();

  const product = products.find(p => p.id === Number(params.id));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-2 border-white/10 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return <div className="text-center py-40 text-white/40">Product not found.</div>;
  }

  const priceValue = parseFloat(product.price.replace(/,/g, '')) || 0;
  const discount = product.discount_percent || 0;
  const finalPrice = discount > 0 ? priceValue * (1 - discount / 100) : priceValue;

  return (
    <div className="space-y-8 py-12">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link 
          href={`/shop/${params.category}`}
          className="inline-flex items-center gap-4 text-[10px] uppercase tracking-[0.4em] text-white/30 hover:text-white transition-colors group"
        >
          <ArrowLeftIcon className="size-4 transition-transform group-hover:-translate-x-1" />
          Back to Collection
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
        {/* Product Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="aspect-[4/5] relative rounded-[3rem] overflow-hidden bg-neutral-900"
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
          />
        </motion.div>

        {/* Product Info */}
        <div className="flex flex-col justify-center space-y-12">
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
          >
              <span className="text-white/30 text-[10px] uppercase tracking-[0.5em]">{product.category}</span>
              <h1 className="text-5xl md:text-7xl font-medium leading-none">{product.name}</h1>
              <div className="flex items-center gap-5 flex-wrap">
                {discount > 0 && (
                  <span className="text-3xl text-white/40 font-medium line-through">₹{priceValue.toLocaleString("en-IN")}</span>
                )}
                <p className={`text-4xl font-bold ${discount > 0 ? 'text-rose-400' : 'text-white/60'}`}>
                  ₹{Math.round(finalPrice).toLocaleString("en-IN")}
                </p>
                {discount > 0 && (
                  <span className="px-5 py-2 bg-rose-600 text-white text-lg font-bold rounded-full shadow-lg shadow-rose-500/30">
                    -{discount}% OFF
                  </span>
                )}
              </div>
          </motion.div>

          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-8"
          >
              <p className="text-white/40 text-lg leading-relaxed font-light italic">
                  {product.notes || "A premium fragrance for the discerning individual."}
              </p>

              {product.volume && (
                <div className="space-y-2">
                  <h4 className="text-[10px] uppercase tracking-[0.3em] text-white/20">Volume</h4>
                  <p className="text-white/60">{product.volume} ml</p>
                </div>
              )}

              <div className="pt-8">
                  <Button 
                      onClick={() => addItem({
                          id: product.id,
                          name: product.name,
                          price: String(Math.round(finalPrice)),
                          image: product.image,
                          volume: product.volume
                      })}
                      className="w-full md:w-auto px-16 py-8 bg-white text-black hover:bg-neutral-200 rounded-full font-bold uppercase tracking-[0.4em] text-[10px] transition-transform hover:scale-105"
                  >
                      Add to Collection
                  </Button>
              </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
