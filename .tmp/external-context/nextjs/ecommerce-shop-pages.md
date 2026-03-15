---
source: Context7 API / Vercel Commerce
library: Next.js
package: nextjs
topic: ecommerce-shop-pages
fetched: 2026-03-14T10:00:00Z
official_docs: https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating
---

# Ecommerce Shop Pages Best Practices (Filtering & Pagination)

In Next.js 15, shop pages benefit from Server Components and specialized data fetching patterns.

## Filtering and Sorting

Filtering is typically handled by passing `searchParams` to Server Components. Note that in Next.js 15, `searchParams` is a Promise and must be awaited.

### Implementation Example
Using a pattern from Next.js Commerce:

```typescript
import { getProducts } from 'lib/shopify';
import { sorting, defaultSort } from 'lib/constants';

export default async function ShopPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ sort?: string; q?: string }> 
}) {
  const { sort, q } = await searchParams;
  const sortOption = sorting.find(s => s.slug === sort) || defaultSort;

  const products = await getProducts({
    query: q,
    sortKey: sortOption.sortKey,
    reverse: sortOption.reverse
  });

  return (
    <div>
      <SortMenu options={sorting} current={sortOption} />
      <ProductGrid products={products} />
    </div>
  );
}
```

### Key Principles
- **URL-Driven State**: Keep filters and sorting in the URL query string. This enables shareable links and proper browser history.
- **Server-Side Fetching**: Fetch filtered data on the server to reduce client-side bundle size and improve SEO.
- **Caching with Tags**: Use Next.js `cache` tags (ISR) to revalidate product listings when inventory changes.

## Pagination

Pagination should also be URL-driven using a `page` parameter.

```typescript
export default async function ShopPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ page?: string }> 
}) {
  const { page = '1' } = await searchParams;
  const pageNumber = parseInt(page);
  
  // Fetch products for specific page
  const products = await getProducts({ page: pageNumber });
  
  return (
    <>
      <ProductList products={products} />
      <Pagination current={pageNumber} />
    </>
  );
}
```
