-- Migration: Normalized Ecommerce Schema (Additive & Future-Proof)
-- Created: 2026-03-14
-- Strategy: Side-by-side (Non-destructive to existing 'products' table)

-- 1. Create Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create Product Templates (The parent product)
CREATE TABLE IF NOT EXISTS public.product_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    base_price NUMERIC(10, 2),
    featured_image TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Create Attribute Definitions (e.g., "Volume", "Size", "Material")
CREATE TABLE IF NOT EXISTS public.attribute_definitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    data_type TEXT DEFAULT 'text', -- 'text', 'number', 'color'
    is_filterable BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Create Product Variants (The actual buyable items)
CREATE TABLE IF NOT EXISTS public.product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.product_templates(id) ON DELETE CASCADE,
    sku TEXT UNIQUE,
    price_override NUMERIC(10, 2), -- If variant has a different price
    stock_quantity INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Create Variant Attributes (Link variant to its specific values)
CREATE TABLE IF NOT EXISTS public.variant_attribute_values (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE CASCADE,
    attribute_id UUID REFERENCES public.attribute_definitions(id) ON DELETE CASCADE,
    value TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_product_templates_updated_at BEFORE UPDATE ON public.product_templates FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- COMMENT ON THE OLD TABLE (Safety)
COMMENT ON TABLE public.products IS 'DEPRECATED: Use categories -> product_templates -> product_variants instead.';
