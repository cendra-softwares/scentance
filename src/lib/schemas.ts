import { z } from 'zod';

// ─── Order Schemas ───────────────────────────────────────────────────────────

export const OrderItemSchema = z.object({
  id: z.number().positive('Product ID must be positive'),
  name: z.string().min(1, 'Product name is required').max(200, 'Product name too long'),
  price: z.string().min(1, 'Price is required'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1').max(99, 'Quantity too high'),
  volume: z.string().nullable().optional(),
});

export const CreateOrderSchema = z.object({
  items: z.array(OrderItemSchema).min(1, 'Order must have at least one item').max(50, 'Too many items'),
  customer_name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name too long')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes')
    .trim(),
  email: z.string().email('Invalid email address').max(254, 'Email too long'),
  phone: z
    .string()
    .regex(/^\d{10}$/, 'Phone must be exactly 10 digits'),
  address: z
    .string()
    .min(5, 'Address too short')
    .max(500, 'Address too long')
    .trim(),
  city: z.string().min(1, 'City is required').max(100, 'City name too long').trim(),
  state: z.string().min(1, 'State is required').max(100, 'State name too long').trim(),
  pincode: z.string().regex(/^\d{6}$/, 'Pincode must be exactly 6 digits'),
});

export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;

// ─── Order Status Schema ─────────────────────────────────────────────────────

export const VALID_ORDER_STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'] as const;

export const UpdateOrderStatusSchema = z.object({
  orderId: z.string().uuid('Invalid order ID'),
  status: z.enum(VALID_ORDER_STATUSES, 'Invalid order status'),
});

export type UpdateOrderStatusInput = z.infer<typeof UpdateOrderStatusSchema>;

// ─── Product Schemas ─────────────────────────────────────────────────────────

export const CreateProductSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(200, 'Product name too long').trim(),
  category: z.string().min(1, 'Category is required').max(100, 'Category too long').trim(),
  notes: z.string().max(2000, 'Notes too long').trim().optional().default(''),
  price: z
    .string()
    .min(1, 'Price is required')
    .regex(/^[\d,]+$/, 'Price must be a valid number')
    .transform((val) => val.replace(/,/g, '')),
  volume: z
    .string()
    .max(20, 'Volume too long')
    .nullable()
    .optional()
    .transform((val) => val?.replace(/ml/gi, '').trim() || null),
  image: z.string().url('Invalid image URL').max(2048, 'URL too long'),
  discount_percent: z.number().min(0).max(99).nullable().optional().default(0),
  top_note: z.string().max(100, 'Top note too long').trim().optional().default(''),
  middle_note: z.string().max(100, 'Middle note too long').trim().optional().default(''),
  bottom_note: z.string().max(100, 'Bottom note too long').trim().optional().default(''),
  fragrance_type: z.string().max(100, 'Fragrance type too long').trim().optional().default(''),
  product_type: z.string().max(100, 'Product type too long').trim().optional().default(''),
  strength: z.string().max(50, 'Strength too long').trim().optional().default(''),
  sustainable: z.string().max(50, 'Sustainable too long').trim().optional().default(''),
  preferences: z.string().max(200, 'Preferences too long').trim().optional().default(''),
});

export type CreateProductInput = z.infer<typeof CreateProductSchema>;

export const UpdateProductSchema = CreateProductSchema.partial().extend({
  id: z.number().positive('Product ID must be positive'),
});

export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;

// ─── File Upload Schema ──────────────────────────────────────────────────────

export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/avif',
] as const;

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type as typeof ALLOWED_IMAGE_TYPES[number])) {
    return {
      valid: false,
      error: `Invalid file type: ${file.type}. Allowed: ${ALLOWED_IMAGE_TYPES.join(', ')}`,
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File too large: ${(file.size / 1024 / 1024).toFixed(1)}MB. Maximum: 5MB`,
    };
  }

  return { valid: true };
}

// ─── Contact Form Schema ─────────────────────────────────────────────────────

export const ContactFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name too long')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes')
    .trim(),
  email: z.string().email('Invalid email address').max(254, 'Email too long'),
  message: z
    .string()
    .min(10, 'Message too short (minimum 10 characters)')
    .max(2000, 'Message too long (maximum 2000 characters)')
    .trim(),
});

export type ContactFormInput = z.infer<typeof ContactFormSchema>;
