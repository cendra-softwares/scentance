---
source: Context7 API / Next.js Docs
library: Next.js
package: nextjs
topic: shared-layouts-categories
fetched: 2026-03-14T10:00:00Z
official_docs: https://nextjs.org/docs/app/building-your-application/routing/layouts-and-templates
---

# Shared Layouts for Product Categories

Next.js App Router allows nesting layouts to share UI elements across specific branches of your route tree.

## Structure for Ecommerce
For a shop with categories like perfumes and clothes:

```
app/
  shop/
    layout.tsx (Shared shop sidebar/navigation)
    [category]/
      layout.tsx (Category-specific header or filters)
      page.tsx (Category listing)
      [id]/
        page.tsx (Product detail)
```

## Accessing Category in Layout
In Next.js 15, `params` in layouts is a Promise and must be awaited.

```tsx
// app/shop/[category]/layout.tsx
export default async function CategoryLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  return (
    <section>
      <header className="category-banner">
        <h1>Exploring {category}</h1>
      </header>
      <div className="category-content">
        {children}
      </div>
    </section>
  );
}
```

## Performance Benefits
- **Partial Rendering**: When navigating between products in the same category, the category layout persists and does not re-render.
- **Shared Data Fetching**: You can fetch category-wide metadata or configuration in the category layout.
