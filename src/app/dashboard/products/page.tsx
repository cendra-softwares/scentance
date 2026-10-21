import { asc } from "drizzle-orm"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { ProductsDashboard } from "@/components/dashboard/products-dashboard"
import { getDb } from "@/db"
import { products as productsTable } from "@/db/schema"
import { requireAdmin } from "@/lib/auth"
import { redirect } from "next/navigation"
import type { Product } from "@/lib/types"
import { TooltipProvider } from "@/components/ui/tooltip"

export const dynamic = "force-dynamic";

export default async function Page() {
  const auth = await requireAdmin();
  if (!auth) redirect("/login");

  const db = await getDb();

  let productRows: (typeof productsTable.$inferSelect)[] = [];
  try {
    productRows = await db
      .select()
      .from(productsTable)
      .orderBy(asc(productsTable.id));
  } catch (error) {
    console.error("Error fetching products:", error);
  }

  const products: Product[] = productRows.map((row) => ({
    id: row.id,
    name: row.name,
    category: row.category,
    notes: row.notes ?? "",
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
  }));

  return (
    <TooltipProvider>
      <div className="font-sans">
        <SidebarProvider
          style={
            {
              "--sidebar-width": "calc(var(--spacing) * 72)",
              "--header-height": "calc(var(--spacing) * 12)",
            } as React.CSSProperties
          }
        >
          <AppSidebar variant="inset" />
          <SidebarInset>
            <SiteHeader title="Product Management" />
            <div className="flex flex-1 flex-col">
              <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                  <ProductsDashboard initialProducts={products} />
                </div>
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </TooltipProvider>
  )
}
