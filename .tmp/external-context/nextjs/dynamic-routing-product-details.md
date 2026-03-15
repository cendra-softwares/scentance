---
source: Context7 API / Next.js Docs
library: Next.js
package: nextjs
topic: dynamic-routing-product-details
fetched: 2026-03-14T10:00:00Z
official_docs: https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes
---

# Dynamic Routing for Product Details

Implementing `/shop/[category]/[id]` involves handling multiple dynamic segments.

## Route Setup
Create the directory structure: `app/shop/[category]/[id]/page.tsx`.

## Handling Parameters in Next.js 15
Parameters are received as a Promise and must be awaited.

```tsx
// app/shop/[category]/[id]/page.tsx
export default async function ProductPage({
  params
}: {
  params: Promise<{ category: string; id: string }>;
}) {
  const { category, id } = await params;
  
  const product = await getProduct(id);
  
  return (
    <article>
      <span>Category: {category}</span>
      <h1>{product.name}</h1>
      {/* ... */}
    </article>
  );
}
```

## Static Site Generation (SSG)
Use `generateStaticParams` to pre-render product pages at build time for maximum performance.

```tsx
export async function generateStaticParams() {
  const products = await getAllProducts();

  return products.map((product) => ({
    category: product.category,
    id: product.id,
  }));
}
```

## Catch-all Segments (Alternative)
If you have deeply nested categories, you can use `[...slug]`:
- `app/shop/[...slug]/page.tsx` matches `/shop/clothes`, `/shop/clothes/men/shirts`, etc.
- `params.slug` will be an array: `['clothes', 'men', 'shirts']`.
