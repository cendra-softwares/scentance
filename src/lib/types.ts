export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
}

export interface Attribute {
  id: string;
  name: string;
  value: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  sku: string;
  price_override?: number;
  stock_quantity: number;
  attributes: Attribute[];
}

export interface ProductTemplate {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string;
  base_price: number;
  featured_image: string;
  category?: Category;
  variants?: ProductVariant[];
  discount_percent?: number;
}

// Keep Legacy Product for backward compatibility while we refactor UI
export interface Product {
  id: number;
  name: string;
  category: string;
  notes: string;
  price: string;
  volume: string | null;
  image: string;
  discount_percent?: number;
  slug?: string;
  is_active?: boolean;
  top_note?: string;
  middle_note?: string;
  bottom_note?: string;
  fragrance_type?: string;
  product_type?: string;
  strength?: string;
  sustainable?: string;
  preferences?: string;
}

export interface CartItem {
  id: number;
  name: string;
  price: string;
  image: string;
  volume?: string | null;
  quantity: number;
}

export interface OrderItem {
  id: number;
  order_id: string;
  product_id: number;
  product_name: string;
  product_price: string;
  volume?: string | null;
  quantity: number;
  variant_id?: string; // Added for new system
}

export interface Order {
  id: string;
  customer_name: string;
  email?: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  status: string;
  total_amount: number;
  created_at: string;
  order_items?: OrderItem[];
}
