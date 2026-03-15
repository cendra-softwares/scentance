"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

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
        const supabase = createClient();
        
        let query = supabase.from("attribute_definitions").select("*");

        if (categorySlug) {
          // Find category ID
          const { data: category } = await supabase
            .from("categories")
            .select("id")
            .eq("slug", categorySlug)
            .single();
          
          if (category) {
            query = query.eq("category_id", category.id);
          }
        }

        const { data, error } = await query;

        if (error) throw error;
        setAttributes(data || []);
      } catch (err) {
        console.error("Error fetching attributes:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAttributes();
  }, [categorySlug]);

  return { attributes, loading };
}
