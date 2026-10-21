import { NextResponse } from 'next/server';
import { asc } from 'drizzle-orm';

import { getDb } from '@/db';
import { products } from '@/db/schema';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = await getDb();
    const rows = await db
      .select({
        id: products.id,
        name: products.name,
        category: products.category,
        notes: products.notes,
        price: products.price,
        volume: products.volume,
        image: products.image,
        discount_percent: products.discountPercent,
        top_note: products.topNote,
        middle_note: products.middleNote,
        bottom_note: products.bottomNote,
        fragrance_type: products.fragranceType,
        product_type: products.productType,
        strength: products.strength,
        sustainable: products.sustainable,
        preferences: products.preferences,
        is_active: products.isActive,
      })
      .from(products)
      .orderBy(asc(products.id));

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
