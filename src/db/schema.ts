import { sql } from 'drizzle-orm';
import { index, integer, real, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

/**
 * D1 (SQLite) schema for Scentance.
 *
 * Port notes from the Supabase/Postgres schema:
 * - uuid -> text, generated with crypto.randomUUID() at the call site
 * - timestamptz -> integer ({ mode: 'timestamp_ms' }) holding unix epoch millis
 * - boolean -> integer ({ mode: 'boolean' })
 * - jsonb -> text ({ mode: 'json' })
 * - numeric(10,2) -> real (only the unused normalized-catalog columns)
 * - products.price / order_items.product_price stay text: the app parses rupee integers out of them
 */

const now = sql`(unixepoch() * 1000)`;

export const categories = sqliteTable(
  'categories',
  {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    name: text('name').notNull(),
    slug: text('slug').notNull(),
    description: text('description'),
    imageUrl: text('image_url'),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).default(now),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).default(now),
  },
  (t) => [uniqueIndex('categories_slug_idx').on(t.slug)]
);

export const productTemplates = sqliteTable(
  'product_templates',
  {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    categoryId: text('category_id').references(() => categories.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    slug: text('slug').notNull(),
    description: text('description').notNull(),
    basePrice: real('base_price'),
    featuredImage: text('featured_image'),
    isActive: integer('is_active', { mode: 'boolean' }).default(true),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).default(now),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).default(now),
    discountPercent: integer('discount_percent').default(0),
  },
  (t) => [uniqueIndex('product_templates_slug_idx').on(t.slug)]
);

export const attributeDefinitions = sqliteTable('attribute_definitions', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  categoryId: text('category_id').references(() => categories.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  dataType: text('data_type').default('text'),
  isFilterable: integer('is_filterable', { mode: 'boolean' }).default(true),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).default(now),
});

export const productVariants = sqliteTable(
  'product_variants',
  {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    productId: text('product_id').references(() => productTemplates.id, { onDelete: 'cascade' }),
    sku: text('sku'),
    priceOverride: real('price_override'),
    stockQuantity: integer('stock_quantity').default(0),
    isActive: integer('is_active', { mode: 'boolean' }).default(true),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).default(now),
  },
  (t) => [uniqueIndex('product_variants_sku_idx').on(t.sku)]
);

export const variantAttributeValues = sqliteTable('variant_attribute_values', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  variantId: text('variant_id').references(() => productVariants.id, { onDelete: 'cascade' }),
  attributeId: text('attribute_id').references(() => attributeDefinitions.id, { onDelete: 'cascade' }),
  value: text('value').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).default(now),
});

export const products = sqliteTable('products', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  category: text('category').notNull(),
  notes: text('notes'),
  price: text('price').notNull(),
  image: text('image').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).default(now),
  volume: text('volume'),
  discountPercent: integer('discount_percent').default(0),
  slug: text('slug'),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  topNote: text('top_note'),
  middleNote: text('middle_note'),
  bottomNote: text('bottom_note'),
  fragranceType: text('fragrance_type'),
  productType: text('product_type'),
  strength: text('strength'),
  sustainable: text('sustainable'),
  preferences: text('preferences'),
});

export const orders = sqliteTable(
  'orders',
  {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    customerName: text('customer_name').notNull(),
    phone: text('phone').notNull(),
    address: text('address').notNull(),
    city: text('city').notNull(),
    state: text('state').notNull(),
    pincode: text('pincode').notNull(),
    status: text('status').default('pending'),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).default(now),
    totalAmount: integer('total_amount').default(0),
    email: text('email'),
    userId: text('user_id').references(() => user.id),
  },
  (t) => [index('orders_user_id_idx').on(t.userId), index('orders_created_at_idx').on(t.createdAt)]
);

export const orderItems = sqliteTable(
  'order_items',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    orderId: text('order_id').references(() => orders.id, { onDelete: 'cascade' }),
    productId: integer('product_id').references(() => products.id),
    productName: text('product_name').notNull(),
    productPrice: text('product_price').notNull(),
    quantity: integer('quantity').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).default(now),
    volume: text('volume'),
  },
  (t) => [index('order_items_order_id_idx').on(t.orderId)]
);

export const profiles = sqliteTable('profiles', {
  id: text('id')
    .primaryKey()
    .references(() => user.id, { onDelete: 'cascade' }),
  email: text('email'),
  role: text('role', { enum: ['admin', 'customer'] }).notNull().default('customer'),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).default(now),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).default(now),
  isGuest: integer('is_guest', { mode: 'boolean' }).default(false),
});

export const auditLogs = sqliteTable(
  'audit_logs',
  {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: text('user_id'),
    userEmail: text('user_email'),
    action: text('action').notNull(),
    resourceType: text('resource_type').notNull(),
    resourceId: text('resource_id'),
    details: text('details', { mode: 'json' }),
    ipAddress: text('ip_address'),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).default(now),
  },
  (t) => [index('audit_logs_created_at_idx').on(t.createdAt)]
);

export const contactMessages = sqliteTable('contact_messages', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  email: text('email').notNull(),
  message: text('message').notNull(),
  isRead: integer('is_read', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).default(now),
});

export const guestSessions = sqliteTable(
  'guest_sessions',
  {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    sessionToken: text('session_token')
      .notNull()
      .$defaultFn(() => crypto.randomUUID()),
    email: text('email'),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).default(now),
    expiresAt: integer('expires_at', { mode: 'timestamp_ms' }),
    lastActivity: integer('last_activity', { mode: 'timestamp_ms' }).default(now),
    metadata: text('metadata', { mode: 'json' }).default({}),
  },
  (t) => [uniqueIndex('guest_sessions_token_idx').on(t.sessionToken)]
);

// ─── Better Auth core tables ────────────────────────────────────────────────
// Column names intentionally match Better Auth's default schema (camelCase).

export const user = sqliteTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: integer('email_verified', { mode: 'boolean' }).notNull().default(false),
  image: text('image'),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull().default(now),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull().default(now),
});

export const session = sqliteTable(
  'session',
  {
    id: text('id').primaryKey(),
    expiresAt: integer('expires_at', { mode: 'timestamp_ms' }).notNull(),
    token: text('token').notNull().unique(),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull().default(now),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull().default(now),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
  },
  (t) => [index('session_user_id_idx').on(t.userId)]
);

export const account = sqliteTable(
  'account',
  {
    id: text('id').primaryKey(),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: integer('access_token_expires_at', { mode: 'timestamp_ms' }),
    refreshTokenExpiresAt: integer('refresh_token_expires_at', { mode: 'timestamp_ms' }),
    scope: text('scope'),
    password: text('password'),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull().default(now),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull().default(now),
  },
  (t) => [index('account_user_id_idx').on(t.userId)]
);

export const verification = sqliteTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: integer('expires_at', { mode: 'timestamp_ms' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).default(now),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).default(now),
});
