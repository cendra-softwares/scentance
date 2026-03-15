'use server';

import { createClient } from '@/lib/supabase/server';
import { Resend } from 'resend';
import { OrderReceivedEmail } from '@/components/emails/order-received';
import { OrderConfirmedEmail } from '@/components/emails/order-confirmed';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function createOrder(data: {
  items: any[];
  customer_name: string;
  email: string;
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
      email: data.email,
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
    volume: item.volume,
    quantity: item.quantity,
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);

  if (itemsError) {
    console.error('Error creating order items:', itemsError);
    return { success: false, error: itemsError.message };
  }

  // 3. Send confirmation email
  try {
    await resend.emails.send({
      from: 'Scentence <orders@scentenceparfum.com>',
      to: [data.email],
      subject: `Order Received - ${orderData.id.slice(0, 8).toUpperCase()}`,
      react: (
        <OrderReceivedEmail
          customerName={data.customer_name}
          orderId={orderData.id}
          items={data.items}
          totalAmount={totalAmount}
          shippingAddress={{
            address: data.address,
            city: data.city,
            state: data.state,
            pincode: data.pincode,
          }}
        />
      ),
    });
  } catch (emailError) {
    console.error('Error sending confirmation email:', emailError);
    // We don't return false here because the order was successfully created in the DB
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

export async function sendOrderConfirmationEmail(orderId: string) {
  const supabase = await createClient();

  // Fetch order details with items
  const { data: order, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('id', orderId)
    .single();

  if (error || !order || !order.email) {
    console.error('Error fetching order for confirmation email:', error);
    return { success: false, error: 'Order not found or email missing' };
  }

  try {
    await resend.emails.send({
      from: 'Scentence <orders@scentenceparfum.com>',
      to: [order.email],
      subject: `Order Confirmed - ${order.id.slice(0, 8).toUpperCase()}`,
      react: (
        <OrderConfirmedEmail
          customerName={order.customer_name}
          orderId={order.id}
          items={order.order_items.map((item: any) => ({
            name: item.product_name,
            quantity: item.quantity,
            price: item.product_price,
          }))}
          totalAmount={order.total_amount}
        />
      ),
    });
    return { success: true };
  } catch (emailError) {
    console.error('Error sending confirmation email:', emailError);
    return { success: false, error: 'Failed to send email' };
  }
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

export async function createProduct(product: {
  name: string;
  category: string;
  notes: string;
  price: string;
  volume: string | null;
  image: string;
  top_note?: string;
  middle_note?: string;
  bottom_note?: string;
  fragrance_type?: string;
  product_type?: string;
  strength?: string;
  sustainable?: string;
  preferences?: string;
}) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  const { data, error } = await supabase
    .from('products')
    .insert(product)
    .select()
    .single();

  if (error) {
    console.error('Error creating product:', error);
    return { success: false, error: error.message };
  }

  return { success: true, product: data };
}

export async function updateProduct(id: number, updates: Partial<{
  name: string;
  category: string;
  notes: string;
  price: string;
  volume: string | null;
  image: string;
  top_note?: string;
  middle_note?: string;
  bottom_note?: string;
  fragrance_type?: string;
  product_type?: string;
  strength?: string;
  sustainable?: string;
  preferences?: string;
}>) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating product:', error);
    return { success: false, error: error.message };
  }

  return { success: true, product: data };
}

export async function deleteProduct(id: number) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting product:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}
