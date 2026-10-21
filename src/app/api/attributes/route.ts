import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

import { getDb } from '@/db';
import { attributeDefinitions, categories } from '@/db/schema';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const categorySlug = request.nextUrl.searchParams.get('category');
    const db = await getDb();

    let categoryId: string | null = null;
    if (categorySlug) {
      const [category] = await db
        .select({ id: categories.id })
        .from(categories)
        .where(eq(categories.slug, categorySlug))
        .limit(1);

      if (!category) return NextResponse.json([]);
      categoryId = category.id;
    }

    const rows = await db
      .select({
        id: attributeDefinitions.id,
        category_id: attributeDefinitions.categoryId,
        name: attributeDefinitions.name,
        data_type: attributeDefinitions.dataType,
      })
      .from(attributeDefinitions)
      .where(categoryId ? eq(attributeDefinitions.categoryId, categoryId) : undefined);

    return NextResponse.json(rows);
  } catch (error) {
    // Attributes are optional in the UI; fail silently with an empty list.
    console.error('Error fetching attributes:', error);
    return NextResponse.json([]);
  }
}
