"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export interface Product {
  id: number;
  name: string;
  category: string;
  notes: string;
  price: string;
  volume: string | null;
  image: string;
  discount_percent?: number;
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        console.log("Fetching products from Supabase...");
        const supabase = createClient();
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("id", { ascending: true });

        if (error) {
          console.error("Supabase error fetching products:", error);
          throw error;
        }
        console.log("Products fetched successfully:", data?.length, "items");
        setProducts(data || []);
      } catch (err: any) {
        console.error("Error fetching products:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return { products, loading, error };
}
