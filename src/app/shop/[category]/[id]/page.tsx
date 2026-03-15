"use client";

import { useShop } from "@/lib/hooks/useShop";
import { useCart } from "@/lib/store/useCart";
import Image from "next/image";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ChevronDown, Plus, Sparkles, CircleCheck } from "lucide-react";
import { toast } from "sonner";

export default function ProductDetailPage() {
  const params = useParams();
  const { products, loading } = useShop();
  const { addItem, setForceCartUp } = useCart();
  const [isAddButtonVisible, setIsAddButtonVisible] = useState(true);
  const [isSpecsOpen, setIsSpecsOpen] = useState(false);

  const product = products.find(p => p.id === Number(params.id));

  const similarProducts = products
    .filter(p => p.category === product?.category && p.id !== product?.id)
    .slice(0, 6);

  useEffect(() => {
    const checkButtonVisibility = () => {
      const button = document.getElementById('main-add-button');
      if (!button) return;
      
      const rect = button.getBoundingClientRect();
      const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
      setIsAddButtonVisible(!isVisible);
      setForceCartUp(!isVisible);
    };

    checkButtonVisibility();
    window.addEventListener('scroll', checkButtonVisibility);
    window.addEventListener('resize', checkButtonVisibility);
    
    return () => {
      window.removeEventListener('scroll', checkButtonVisibility);
      window.removeEventListener('resize', checkButtonVisibility);
      setForceCartUp(false);
    };
  }, [product, setForceCartUp]);

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

  const handleAddToCart = (productId: number, productName: string, productPrice: string, productImage: string, productVolume: string | null) => {
    const discountedPrice = String(Math.round(parseFloat(productPrice) * (1 - (product?.discount_percent || 0) / 100)));
    addItem({
      id: productId,
      name: productName,
      price: discountedPrice,
      image: productImage,
      volume: productVolume
    });
    toast.success(`${productName} added to collection`, {
      icon: <CircleCheck className="w-5 h-5 text-emerald-400" />,
      style: {
        background: 'rgba(0,0,0,0.9)',
        border: '1px solid rgba(255,255,255,0.1)',
        color: '#fff',
      },
      className: 'font-medium',
    });
  };

  return (
    <div className="space-y-8 py-12">
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
        <div className="flex flex-col justify-center space-y-10">
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

              <div className="pt-4">
                  <Button 
                    id="main-add-button"
                      onClick={() => handleAddToCart(product.id, product.name, product.price, product.image, product.volume)}
                      className="w-full md:w-auto px-16 py-8 bg-white text-black hover:bg-neutral-200 rounded-full font-bold uppercase tracking-[0.4em] text-[10px] transition-transform hover:scale-105"
                  >
                      Add to Collection
                  </Button>
              </div>
          </motion.div>
        </div>
      </div>

      {/* Collapsible Specifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="border-t border-white/10 pt-8"
      >
        <button
          onClick={() => setIsSpecsOpen(!isSpecsOpen)}
          className="w-full flex items-center justify-between py-4 text-left group"
        >
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-white/40" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/60">Product Specifications</span>
          </div>
          <motion.div
            animate={{ rotate: isSpecsOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="w-5 h-5 text-white/40" />
          </motion.div>
        </button>

        <AnimatePresence>
          {isSpecsOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-6 py-6">
                {product.top_note && (
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-widest text-white/20">Top Note</span>
                    <p className="text-white/60 text-sm">{product.top_note}</p>
                  </div>
                )}
                {product.middle_note && (
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-widest text-white/20">Middle Note</span>
                    <p className="text-white/60 text-sm">{product.middle_note}</p>
                  </div>
                )}
                {product.bottom_note && (
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-widest text-white/20">Bottom Note</span>
                    <p className="text-white/60 text-sm">{product.bottom_note}</p>
                  </div>
                )}
                {product.fragrance_type && (
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-widest text-white/20">Fragrance</span>
                    <p className="text-white/60 text-sm">{product.fragrance_type}</p>
                  </div>
                )}
                {product.product_type && (
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-widest text-white/20">Type</span>
                    <p className="text-white/60 text-sm">{product.product_type}</p>
                  </div>
                )}
                {product.strength && (
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-widest text-white/20">Strength</span>
                    <p className="text-white/60 text-sm">{product.strength}</p>
                  </div>
                )}
                {product.sustainable && (
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-widest text-white/20">Sustainable</span>
                    <p className="text-white/60 text-sm">{product.sustainable}</p>
                  </div>
                )}
                {product.preferences && (
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-widest text-white/20">Preferences</span>
                    <p className="text-white/60 text-sm">{product.preferences}</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Similar Products - Horizontal Scroll */}
      {similarProducts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="pt-12 border-t border-white/10"
        >
          <div className="flex items-center gap-3 mb-8">
            <Sparkles className="w-5 h-5 text-white/40" />
            <h2 className="text-[10px] uppercase tracking-[0.3em] text-white/60">You May Also Like</h2>
          </div>

          <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
            <div className="flex gap-6 pb-4" style={{ scrollSnapType: 'x mandatory' }}>
              {similarProducts.map((similarProduct, index) => {
                const simPriceValue = parseFloat(similarProduct.price.replace(/,/g, '')) || 0;
                const simDiscount = similarProduct.discount_percent || 0;
                const simFinalPrice = simDiscount > 0 ? simPriceValue * (1 - simDiscount / 100) : simPriceValue;

                return (
                  <motion.div
                    key={similarProduct.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                    className="flex-shrink-0 w-[280px] md:w-[320px]"
                    style={{ scrollSnapAlign: 'start' }}
                  >
                    <Link href={`/shop/${similarProduct.category.toLowerCase()}/${similarProduct.id}`}>
                      <div className="group relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-neutral-900 mb-4">
                        <Image
                          src={similarProduct.image}
                          alt={similarProduct.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        {similarProduct.discount_percent && similarProduct.discount_percent > 0 && (
                          <div className="absolute top-4 left-4 px-3 py-1 bg-rose-600 text-white text-xs font-bold rounded-full">
                            -{similarProduct.discount_percent}%
                          </div>
                        )}

                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleAddToCart(similarProduct.id, similarProduct.name, similarProduct.price, similarProduct.image, similarProduct.volume);
                          }}
                          className="absolute bottom-4 right-4 w-12 h-12 bg-white text-black rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-neutral-200"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                    </Link>

                    <div className="space-y-2">
                      <span className="text-white/20 text-[8px] uppercase tracking-[0.3em]">{similarProduct.category}</span>
                      <h3 className="text-lg font-medium truncate">{similarProduct.name}</h3>
                      <div className="flex items-center gap-2">
                        {simDiscount > 0 && (
                          <span className="text-white/40 text-sm line-through">₹{simPriceValue.toLocaleString("en-IN")}</span>
                        )}
                        <span className={`text-lg font-bold ${simDiscount > 0 ? 'text-rose-400' : 'text-white/60'}`}>
                          ₹{Math.round(simFinalPrice).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      {/* Sticky Bottom Add to Cart Button */}
      <motion.div 
        initial={{ opacity: 0, y: 100 }}
        animate={{ 
          opacity: isAddButtonVisible ? 1 : 0,
          y: isAddButtonVisible ? 0 : 100,
          pointerEvents: isAddButtonVisible ? 'auto' : 'none'
        }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/90 to-transparent md:hidden"
        style={{ paddingBottom: '2rem' }}
      >
        <Button 
          onClick={() => handleAddToCart(product.id, product.name, product.price, product.image, product.volume)}
          className="w-full py-6 bg-white text-black hover:bg-neutral-200 rounded-full font-bold uppercase tracking-[0.4em] text-[11px] shadow-lg shadow-white/10"
        >
          Add to Collection
        </Button>
      </motion.div>
    </div>
  );
}
