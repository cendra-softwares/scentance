'use server';

import { createClient } from '@/lib/supabase/server';

export async function createOrder(data: {
  items: any[];
  customer_name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}) {
  const supabase = await createClient();

  const totalAmount = data.items.reduce((acc, item) => {
    const price = parseInt(item.price.replace(/[^\d]/g, ''));
    return acc + price * item.quantity;
  }, 0);

  // 1. Create the main order
  const { data: orderData, error: orderError } = await supabase
    .from('orders')
    .insert({
      customer_name: data.customer_name,
      phone: data.phone,
      address: data.address,
      city: data.city,
      state: data.state,
      pincode: data.pincode,
      status: 'pending',
      total_amount: totalAmount
    })
    .select()
    .single();

  if (orderError) {
    console.error('Error creating order:', orderError);
    return { success: false, error: orderError.message };
  }

  // 2. Create the order items
  const orderItems = data.items.map((item) => ({
    order_id: orderData.id,
    product_id: item.id,
    product_name: item.name,
    product_price: item.price,
    quantity: item.quantity,
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);

  if (itemsError) {
    console.error('Error creating order items:', itemsError);
    // Note: In a production app, you might want to rollback the order creation here
    return { success: false, error: itemsError.message };
  }

  return { success: true, orderId: orderData.id };
}

export async function updateOrderStatus(orderId: string, status: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Unauthorized' };
  }

  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)
    .select();

  if (error) {
    console.error('Error updating order status:', error);
    return { success: false, error: error.message };
  }

  if (!data || data.length === 0) {
    return { success: false, error: 'No order updated (check RLS policies)' };
  }

  return { success: true };
}

export async function deleteOrder(orderId: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Unauthorized' };
  }

  const { data, error } = await supabase
    .from('orders')
    .delete()
    .eq('id', orderId)
    .select();

  if (error) {
    console.error('Error deleting order:', error);
    return { success: false, error: error.message };
  }

  if (!data || data.length === 0) {
    return { success: false, error: 'No order deleted (check RLS policies)' };
  }

  return { success: true };
}
