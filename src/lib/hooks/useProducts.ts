"use client";

import { useState, useEffect } from "react";

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
        const response = await fetch("/api/products");
        if (!response.ok) {
          throw new Error(`Failed to fetch products (${response.status})`);
        }
        const data: unknown = await response.json();
        setProducts(Array.isArray(data) ? (data as Product[]) : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch products");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return { products, loading, error };
}
