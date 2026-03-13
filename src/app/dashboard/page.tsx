import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { OverviewDashboard } from "@/components/dashboard/overview-dashboard"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { TooltipProvider } from "@/components/ui/tooltip"

export const dynamic = "force-dynamic";

export default async function Page() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/login");
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
          <SiteHeader title="Dashboard Overview" />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <OverviewDashboard />
              </div>
            </div>
          </div>
        </SidebarInset>
        </SidebarProvider>
      </div>
    </TooltipProvider>
  )
}
