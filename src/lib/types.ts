export interface Product {
  id: number;
  name: string;
  category: string;
  notes: string;
  price: string;
  volume: string | null;
  image: string;
}

export interface OrderItem {
  id: number;
  order_id: string;
  product_id: number;
  product_name: string;
  product_price: string;
  volume?: string | null;
  quantity: number;
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
