"use client";

import { useState, useEffect } from "react";
import { Product } from "@/lib/types";

export function useShop(categorySlug?: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const query = categorySlug ? `?category=${encodeURIComponent(categorySlug)}` : "";
        const response = await fetch(`/api/shop${query}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch products (${response.status})`);
        }
        const prodData: unknown = await response.json();

        setProducts(Array.isArray(prodData) ? (prodData as Product[]) : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch products");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [categorySlug]);

  return { products, loading, error };
}
