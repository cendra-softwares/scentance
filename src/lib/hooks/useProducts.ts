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
  top_note?: string;
  middle_note?: string;
  bottom_note?: string;
  fragrance_type?: string;
  product_type?: string;
  strength?: string;
  sustainable?: string;
  preferences?: string;
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("products")
          .select("id, name, category, notes, price, volume, image, discount_percent, top_note, middle_note, bottom_note, fragrance_type, product_type, strength, sustainable, preferences, is_active")
          .order("id", { ascending: true });

        if (error) {
          throw error;
        }
        setProducts(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return { products, loading, error };
}
