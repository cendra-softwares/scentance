'use server';

import { createClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/auth';
import { logAuditEvent } from '@/lib/audit';
import { Resend } from 'resend';
import { OrderReceivedEmail } from '@/components/emails/order-received';
import { OrderConfirmedEmail } from '@/components/emails/order-confirmed';
import {
  CreateOrderSchema,
  UpdateOrderStatusSchema,
  CreateProductSchema,
  UpdateProductSchema,
  type CreateOrderInput,
} from '@/lib/schemas';
import type { Product } from '@/lib/types';

const resend = new Resend(process.env.RESEND_API_KEY);

// ─── Helper: Generic error response ──────────────────────────────────────────

function errorResponse(message: string): { success: false; error: string } {
  return { success: false, error: message };
}

// ─── Order Actions ───────────────────────────────────────────────────────────

export async function createOrder(rawData: unknown): Promise<{ success: true; orderId: string } | { success: false; error: string }> {
  // 1. Validate input
  const parsed = CreateOrderSchema.safeParse(rawData);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? 'Invalid input';
    return errorResponse(firstError);
  }

  const data: CreateOrderInput = parsed.data;
  const supabase = await createClient();

  // 2. Look up actual prices from database (NEVER trust client prices)
  const productIds = data.items.map((item) => item.id);
  const { data: dbProducts, error: productsError } = await supabase
    .from('products')
    .select('id, price, discount_percent')
    .in('id', productIds);

  if (productsError || !dbProducts) {
    console.error('Error fetching product prices:', productsError);
    return errorResponse('Could not verify product prices');
  }

  // 3. Build a price map from DB
  const priceMap = new Map(
    dbProducts.map((p) => [p.id, { price: p.price, discount: p.discount_percent ?? 0 }])
  );

  // 4. Verify all items exist and calculate total from DB prices
  let totalAmount = 0;
  const verifiedItems = data.items.map((item) => {
    const dbProduct = priceMap.get(item.id);
    if (!dbProduct) {
      throw new Error(`Product ${item.id} not found`);
    }

    const basePrice = parseInt(dbProduct.price.replace(/[^\d]/g, ''), 10);
    const discount = dbProduct.discount;
    const finalPrice = Math.round(basePrice * (1 - discount / 100));
    totalAmount += finalPrice * item.quantity;

    return {
      ...item,
      verifiedPrice: finalPrice,
      verifiedPriceString: String(finalPrice),
    };
  });

  // 5. Create the main order
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
      total_amount: totalAmount,
    })
    .select()
    .single();

  if (orderError) {
    console.error('Error creating order:', orderError);
    return errorResponse('Failed to create order');
  }

  // 6. Create order items with verified prices
  const orderItems = verifiedItems.map((item) => ({
    order_id: orderData.id,
    product_id: item.id,
    product_name: item.name,
    product_price: item.verifiedPriceString,
    volume: item.volume,
    quantity: item.quantity,
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);

  if (itemsError) {
    console.error('Error creating order items:', itemsError);
    return errorResponse('Failed to create order items');
  }

  // 7. Send confirmation email
  try {
    await resend.emails.send({
      from: 'Scentence <orders@scentenceparfum.com>',
      to: [data.email],
      subject: `Order Received - ${orderData.id.slice(0, 8).toUpperCase()}`,
      react: (
        <OrderReceivedEmail
          customerName={data.customer_name}
          orderId={orderData.id}
          items={verifiedItems.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            price: item.verifiedPriceString,
            volume: item.volume,
          }))}
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
    // Don't fail the order — email is best-effort
  }

  return { success: true, orderId: orderData.id };
}

export async function updateOrderStatus(orderId: string, status: string) {
  // 1. Validate input
  const parsed = UpdateOrderStatusSchema.safeParse({ orderId, status });
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? 'Invalid input';
    return errorResponse(firstError);
  }

  // 2. Require admin
  const auth = await requireAdmin();
  if (!auth) return errorResponse('Unauthorized');

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('orders')
    .update({ status: parsed.data.status })
    .eq('id', parsed.data.orderId)
    .select();

  if (error) {
    console.error('Error updating order status:', error);
    return errorResponse('Failed to update order status');
  }

  if (!data || data.length === 0) {
    return errorResponse('Order not found');
  }

  // Log the admin action
  await logAuditEvent(
    'update_order_status',
    'order',
    parsed.data.orderId,
    { new_status: parsed.data.status }
  );

  return { success: true };
}

export async function sendOrderConfirmationEmail(orderId: string) {
  // 1. Validate orderId format
  if (!orderId || typeof orderId !== 'string') {
    return errorResponse('Invalid order ID');
  }

  // 2. Require admin
  const auth = await requireAdmin();
  if (!auth) return errorResponse('Unauthorized');

  const supabase = await createClient();

  // 3. Fetch order details with items
  const { data: order, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('id', orderId)
    .single();

  if (error || !order || !order.email) {
    console.error('Error fetching order for confirmation email:', error);
    return errorResponse('Order not found or email missing');
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
          items={order.order_items.map((item: { product_name: string; quantity: number; product_price: string }) => ({
            name: item.product_name,
            quantity: item.quantity,
            price: item.product_price,
          }))}
          totalAmount={order.total_amount}
        />
      ),
    });

    // Log the admin action
    await logAuditEvent('send_confirmation_email', 'order', orderId, { recipient: order.email });

    return { success: true };
  } catch (emailError) {
    console.error('Error sending confirmation email:', emailError);
    return errorResponse('Failed to send email');
  }
}

export async function deleteOrder(orderId: string) {
  // 1. Validate orderId format
  if (!orderId || typeof orderId !== 'string') {
    return errorResponse('Invalid order ID');
  }

  // 2. Require admin
  const auth = await requireAdmin();
  if (!auth) return errorResponse('Unauthorized');

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('orders')
    .delete()
    .eq('id', orderId)
    .select();

  if (error) {
    console.error('Error deleting order:', error);
    return errorResponse('Failed to delete order');
  }

  if (!data || data.length === 0) {
    return errorResponse('Order not found');
  }

  // Log the admin action
  await logAuditEvent('delete_order', 'order', orderId);

  return { success: true };
}

// ─── Product Actions ─────────────────────────────────────────────────────────

export async function createProduct(rawProduct: unknown): Promise<{ success: true; product: Product } | { success: false; error: string }> {
  // 1. Validate input
  const parsed = CreateProductSchema.safeParse(rawProduct);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? 'Invalid product data';
    return errorResponse(firstError);
  }

  // 2. Require admin
  const auth = await requireAdmin();
  if (!auth) return errorResponse('Unauthorized');

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('products')
    .insert(parsed.data)
    .select()
    .single();

  if (error) {
    console.error('Error creating product:', error);
    return errorResponse('Failed to create product');
  }

  // Log the admin action
  await logAuditEvent('create_product', 'product', String(data.id), { name: data.name });

  return { success: true, product: data };
}

export async function updateProduct(id: number, rawUpdates: Record<string, unknown>): Promise<{ success: true; product: Product } | { success: false; error: string }> {
  // 1. Validate input
  const parsed = UpdateProductSchema.safeParse({ id, ...rawUpdates });
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? 'Invalid product data';
    return errorResponse(firstError);
  }

  // 2. Require admin
  const auth = await requireAdmin();
  if (!auth) return errorResponse('Unauthorized');

  const supabase = await createClient();

  // Remove id from updates
  const { id: _, ...updates } = parsed.data;

  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating product:', error);
    return errorResponse('Failed to update product');
  }

  // Log the admin action
  await logAuditEvent('update_product', 'product', String(id), { updates: rawUpdates });

  return { success: true, product: data };
}

export async function deleteProduct(id: number) {
  // 1. Validate id
  if (!id || typeof id !== 'number' || id <= 0) {
    return errorResponse('Invalid product ID');
  }

  // 2. Require admin
  const auth = await requireAdmin();
  if (!auth) return errorResponse('Unauthorized');

  const supabase = await createClient();

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting product:', error);
    return errorResponse('Failed to delete product');
  }

  // Log the admin action
  await logAuditEvent('delete_product', 'product', String(id));

  return { success: true };
}
