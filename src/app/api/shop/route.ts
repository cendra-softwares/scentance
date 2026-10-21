import { NextRequest, NextResponse } from 'next/server';
import { and, desc, eq } from 'drizzle-orm';

import { getDb } from '@/db';
import { products } from '@/db/schema';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const category = request.nextUrl.searchParams.get('category');

    const filters = [eq(products.isActive, true)];
    // The legacy shop query compared the free-text category column to the slug.
    if (category && category !== 'all') {
      filters.push(eq(products.category, category));
    }

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
      })
      .from(products)
      .where(and(...filters))
      .orderBy(desc(products.createdAt));

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching shop products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
