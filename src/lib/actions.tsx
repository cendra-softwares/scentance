'use server';

import { eq, inArray } from 'drizzle-orm';
import { Resend } from 'resend';

import { requireAdmin } from '@/lib/auth';
import { logAuditEvent } from '@/lib/audit';
import { getDb } from '@/db';
import { contactMessages, orderItems, orders, products } from '@/db/schema';
import { readEnv } from '@/lib/env';
import { deleteImageIfUnused } from '@/lib/media';
import { OrderReceivedEmail } from '@/components/emails/order-received';
import { OrderConfirmedEmail } from '@/components/emails/order-confirmed';
import {
  CreateOrderSchema,
  UpdateOrderStatusSchema,
  CreateProductSchema,
  UpdateProductSchema,
  ContactFormSchema,
  type CreateOrderInput,
} from '@/lib/schemas';
import type { Product } from '@/lib/types';

function getResend() {
  return new Resend(readEnv('RESEND_API_KEY'));
}

// ─── Helper: Generic error response ──────────────────────────────────────────

function errorResponse(message: string): { success: false; error: string } {
  return { success: false, error: message };
}

// ─── Helper: DB row -> legacy snake_case Product shape ───────────────────────

type ProductRow = typeof products.$inferSelect;

function toProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    notes: row.notes ?? '',
    price: row.price,
    volume: row.volume,
    image: row.image,
    discount_percent: row.discountPercent ?? 0,
    slug: row.slug ?? undefined,
    is_active: row.isActive ?? undefined,
    top_note: row.topNote ?? undefined,
    middle_note: row.middleNote ?? undefined,
    bottom_note: row.bottomNote ?? undefined,
    fragrance_type: row.fragranceType ?? undefined,
    product_type: row.productType ?? undefined,
    strength: row.strength ?? undefined,
    sustainable: row.sustainable ?? undefined,
    preferences: row.preferences ?? undefined,
  };
}

// ─── Order Actions ───────────────────────────────────────────────────────────

export async function createOrder(rawData: unknown): Promise<{ success: true; orderId: string } | { success: false; error: string }> {
  // 1. Validate input
  const parsed = CreateOrderSchema.safeParse(rawData);
  if (!parsed.success) {
    const errors = parsed.error.format();
    console.error('Order validation failed:', JSON.stringify(errors, null, 2));
    const firstError = parsed.error.issues[0]?.message ?? 'Invalid input';
    return errorResponse(firstError);
  }

  const data: CreateOrderInput = parsed.data;
  const db = await getDb();

  // 2. Look up actual prices from database (NEVER trust client prices)
  const productIds = data.items.map((item) => item.id);
  let dbProducts: { id: number; price: string; discountPercent: number | null }[];
  try {
    dbProducts = await db
      .select({ id: products.id, price: products.price, discountPercent: products.discountPercent })
      .from(products)
      .where(inArray(products.id, productIds));
  } catch (error) {
    console.error('Error fetching product prices:', error);
    return errorResponse('Could not verify product prices');
  }

  // 3. Build a price map from DB
  const priceMap = new Map(
    dbProducts.map((p) => [p.id, { price: p.price, discount: p.discountPercent ?? 0 }])
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

  // 5. Create the main order and its items atomically
  const orderId = crypto.randomUUID();
  const orderedItems = verifiedItems.map((item) => ({
    orderId,
    productId: item.id,
    productName: item.name,
    productPrice: item.verifiedPriceString,
    volume: item.volume ?? null,
    quantity: item.quantity,
  }));

  try {
    await db.batch([
      db.insert(orders).values({
        id: orderId,
        customerName: data.customer_name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        status: 'pending',
        totalAmount,
        userId: data.user_id ?? null,
      }),
      db.insert(orderItems).values(orderedItems),
    ]);
  } catch (error) {
    console.error('Error creating order:', error);
    return errorResponse('Failed to create order');
  }

  // 6. Send confirmation email (best-effort)
  try {
    const resend = getResend();
    await resend.emails.send({
      from: 'Scentence <orders@scentenceparfum.com>',
      to: [data.email],
      subject: `Order Received - ${orderId.slice(0, 8).toUpperCase()}`,
      react: (
        <OrderReceivedEmail
          customerName={data.customer_name}
          orderId={orderId}
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

  return { success: true, orderId };
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

  const db = await getDb();

  let data: { id: string }[];
  try {
    data = await db
      .update(orders)
      .set({ status: parsed.data.status })
      .where(eq(orders.id, parsed.data.orderId))
      .returning({ id: orders.id });
  } catch (error) {
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

  const db = await getDb();

  // 3. Fetch order details with items
  let order: typeof orders.$inferSelect | undefined;
  let items: (typeof orderItems.$inferSelect)[] = [];
  try {
    [order] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
    if (order) {
      items = await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
    }
  } catch (error) {
    console.error('Error fetching order for confirmation email:', error);
    return errorResponse('Order not found or email missing');
  }

  if (!order || !order.email) {
    return errorResponse('Order not found or email missing');
  }

  try {
    const resend = getResend();
    await resend.emails.send({
      from: 'Scentence <orders@scentenceparfum.com>',
      to: [order.email],
      subject: `Order Confirmed - ${order.id.slice(0, 8).toUpperCase()}`,
      react: (
        <OrderConfirmedEmail
          customerName={order.customerName}
          orderId={order.id}
          items={items.map((item) => ({
            name: item.productName,
            quantity: item.quantity,
            price: item.productPrice,
          }))}
          totalAmount={order.totalAmount ?? 0}
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

  const db = await getDb();

  let data: { id: string }[];
  try {
    data = await db.delete(orders).where(eq(orders.id, orderId)).returning({ id: orders.id });
  } catch (error) {
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

  const db = await getDb();
  const input = parsed.data;

  let data: ProductRow | undefined;
  try {
    [data] = await db
      .insert(products)
      .values({
        name: input.name,
        category: input.category,
        notes: input.notes,
        price: input.price,
        volume: input.volume,
        image: input.image,
        discountPercent: input.discount_percent,
        topNote: input.top_note,
        middleNote: input.middle_note,
        bottomNote: input.bottom_note,
        fragranceType: input.fragrance_type,
        productType: input.product_type,
        strength: input.strength,
        sustainable: input.sustainable,
        preferences: input.preferences,
      })
      .returning();
  } catch (error) {
    console.error('Error creating product:', error);
    return errorResponse('Failed to create product');
  }

  if (!data) {
    return errorResponse('Failed to create product');
  }

  // Log the admin action
  await logAuditEvent('create_product', 'product', String(data.id), { name: data.name });

  return { success: true, product: toProduct(data) };
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

  const db = await getDb();

  // Remove id from updates
  const { id: _id, ...updates } = parsed.data;

  const changes: Partial<typeof products.$inferInsert> = {};
  if (updates.name !== undefined) changes.name = updates.name;
  if (updates.category !== undefined) changes.category = updates.category;
  if (updates.notes !== undefined) changes.notes = updates.notes;
  if (updates.price !== undefined) changes.price = updates.price;
  if (updates.volume !== undefined) changes.volume = updates.volume;
  if (updates.image !== undefined) changes.image = updates.image;
  if (updates.discount_percent !== undefined) changes.discountPercent = updates.discount_percent;
  if (updates.top_note !== undefined) changes.topNote = updates.top_note;
  if (updates.middle_note !== undefined) changes.middleNote = updates.middle_note;
  if (updates.bottom_note !== undefined) changes.bottomNote = updates.bottom_note;
  if (updates.fragrance_type !== undefined) changes.fragranceType = updates.fragrance_type;
  if (updates.product_type !== undefined) changes.productType = updates.product_type;
  if (updates.strength !== undefined) changes.strength = updates.strength;
  if (updates.sustainable !== undefined) changes.sustainable = updates.sustainable;
  if (updates.preferences !== undefined) changes.preferences = updates.preferences;

  const [previous] = await db
    .select({ image: products.image })
    .from(products)
    .where(eq(products.id, id))
    .limit(1);

  let data: ProductRow | undefined;
  try {
    if (Object.keys(changes).length === 0) {
      [data] = await db.select().from(products).where(eq(products.id, id)).limit(1);
    } else {
      [data] = await db.update(products).set(changes).where(eq(products.id, id)).returning();
    }
  } catch (error) {
    console.error('Error updating product:', error);
    return errorResponse('Failed to update product');
  }

  if (!data) {
    return errorResponse('Failed to update product');
  }

  if (previous?.image && previous.image !== data.image) {
    await deleteImageIfUnused(db, previous.image);
  }

  // Log the admin action
  await logAuditEvent('update_product', 'product', String(id), { updates: rawUpdates });

  return { success: true, product: toProduct(data) };
}

export async function deleteProduct(id: number) {
  // 1. Validate id
  if (!id || typeof id !== 'number' || id <= 0) {
    return errorResponse('Invalid product ID');
  }

  // 2. Require admin
  const auth = await requireAdmin();
  if (!auth) return errorResponse('Unauthorized');

  const db = await getDb();

  const [existing] = await db
    .select({ image: products.image })
    .from(products)
    .where(eq(products.id, id))
    .limit(1);

  try {
    await db.delete(products).where(eq(products.id, id));
  } catch (error) {
    console.error('Error deleting product:', error);
    return errorResponse('Failed to delete product');
  }

  // Drop the uploaded image from the repository once nothing references it.
  await deleteImageIfUnused(db, existing?.image);

  // Log the admin action
  await logAuditEvent('delete_product', 'product', String(id));

  return { success: true };
}

// ─── Contact Form Action ───────────────────────────────────────────────────────

export async function submitContactForm(
  rawData: unknown
): Promise<{ success: true } | { success: false; error: string }> {
  // 1. Validate input
  const parsed = ContactFormSchema.safeParse(rawData);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? 'Invalid input';
    return errorResponse(firstError);
  }

  const { name, email, message } = parsed.data;

  // 2. Store in database (optional - can also just send email)
  try {
    const db = await getDb();
    await db.insert(contactMessages).values({ name, email, message });
  } catch (insertError) {
    console.error('Error storing contact message:', insertError);
    // Don't fail - still try to send confirmation email
  }

  // 3. Send confirmation email to customer
  try {
    const resend = getResend();
    await resend.emails.send({
      from: 'Scentence <support@scentenceparfum.com>',
      to: [email],
      subject: 'Thank you for contacting Scentence',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1a1a1a;">Thank you, ${name}!</h1>
          <p style="color: #4a4a4a; line-height: 1.6;">
            We have received your message and will get back to you within 24-48 hours.
          </p>
          <p style="color: #4a4a4a; line-height: 1.6;">
            Here's a copy of your message:
          </p>
          <blockquote style="background: #f5f5f5; padding: 15px; border-left: 4px solid #8b5cf6; margin: 20px 0;">
            ${message}
          </blockquote>
          <p style="color: #6a6a6a; font-size: 14px;">
            Best regards,<br/>
            The Scentence Team
          </p>
        </div>
      `,
    });
  } catch (emailError) {
    console.error('Error sending contact confirmation email:', emailError);
    // Don't fail - message was stored
  }

  return { success: true };
}
