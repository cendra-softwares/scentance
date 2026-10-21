"use client";

import { useState, useEffect } from "react";

export interface AttributeDefinition {
  id: string;
  category_id: string;
  name: string;
  data_type: string;
}

export function useAttributes(categorySlug?: string) {
  const [attributes, setAttributes] = useState<AttributeDefinition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAttributes() {
      try {
        const query = categorySlug ? `?category=${encodeURIComponent(categorySlug)}` : "";
        const response = await fetch(`/api/attributes${query}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch attributes (${response.status})`);
        }
        const data: unknown = await response.json();

        setAttributes(Array.isArray(data) ? (data as AttributeDefinition[]) : []);
      } catch (err) {
        // Silent fail - attributes are optional
      } finally {
        setLoading(false);
      }
    }

    fetchAttributes();
  }, [categorySlug]);

  return { attributes, loading };
}
