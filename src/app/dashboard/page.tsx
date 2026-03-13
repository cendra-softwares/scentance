import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { OrdersDashboard } from "@/components/dashboard/orders-dashboard"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Order } from "@/lib/types"
import { TooltipProvider } from "@/components/ui/tooltip"

export const dynamic = "force-dynamic";

export default async function Page() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/login");
  }

  const { data: orders, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching orders:", error);
  }

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
          <SiteHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <OrdersDashboard initialOrders={(orders as Order[]) || []} />
              </div>
            </div>
          </div>
        </SidebarInset>
        </SidebarProvider>
      </div>
    </TooltipProvider>
  )
}
