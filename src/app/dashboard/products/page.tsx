import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { ProductsDashboard } from "@/components/dashboard/products-dashboard"
import { createClient } from "@/lib/supabase/server"
import { requireAdmin } from "@/lib/auth"
import { redirect } from "next/navigation"
import { TooltipProvider } from "@/components/ui/tooltip"

export const dynamic = "force-dynamic";

export default async function Page() {
  const auth = await requireAdmin();
  if (!auth) redirect("/login");

  const supabase = await createClient();

  // Fetch products
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("id", { ascending: true });

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
                  <ProductsDashboard initialProducts={products || []} />
                </div>
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </TooltipProvider>
  )
}
