"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Product } from "@/lib/types";

export function useShop(categorySlug?: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const supabase = createClient();
        
        let query = supabase
          .from("products")
          .select("*")
          .eq("is_active", true);

        if (categorySlug) {
          query = query.eq("category", categorySlug);
        }

        const { data: prodData, error: prodError } = await query.order("created_at", { ascending: false });

        if (prodError) throw prodError;
        setProducts(prodData || []);
      } catch (err: any) {
        console.error("Error fetching shop data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [categorySlug]);

  return { products, loading, error };
}
