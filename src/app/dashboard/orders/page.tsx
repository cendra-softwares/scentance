import { inArray, desc } from "drizzle-orm"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { OrdersDashboard } from "@/components/dashboard/orders-dashboard"
import { getDb } from "@/db"
import { orderItems as orderItemsTable, orders as ordersTable } from "@/db/schema"
import { requireAdmin } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Order, OrderItem } from "@/lib/types"
import { TooltipProvider } from "@/components/ui/tooltip"

export const dynamic = "force-dynamic";

export default async function Page() {
  const auth = await requireAdmin();
  if (!auth) redirect("/login");

  const db = await getDb();

  let orderRows: (typeof ordersTable.$inferSelect)[] = [];
  try {
    orderRows = await db
      .select()
      .from(ordersTable)
      .orderBy(desc(ordersTable.createdAt));
  } catch (error) {
    console.error("Error fetching orders:", error);
  }

  const orderIds = orderRows.map((order) => order.id);
  let itemRows: (typeof orderItemsTable.$inferSelect)[] = [];
  if (orderIds.length) {
    try {
      itemRows = await db
        .select()
        .from(orderItemsTable)
        .where(inArray(orderItemsTable.orderId, orderIds));
    } catch (error) {
      console.error("Error fetching order items:", error);
    }
  }

  const itemsByOrder = new Map<string, OrderItem[]>();
  for (const item of itemRows) {
    if (!item.orderId) continue;
    const list = itemsByOrder.get(item.orderId) ?? [];
    list.push({
      id: item.id,
      order_id: item.orderId,
      product_id: item.productId ?? 0,
      product_name: item.productName,
      product_price: item.productPrice,
      volume: item.volume,
      quantity: item.quantity,
    });
    itemsByOrder.set(item.orderId, list);
  }

  const orders: Order[] = orderRows.map((order) => ({
    id: order.id,
    customer_name: order.customerName,
    email: order.email ?? undefined,
    phone: order.phone,
    address: order.address,
    city: order.city,
    state: order.state,
    pincode: order.pincode,
    status: order.status ?? "pending",
    total_amount: order.totalAmount ?? 0,
    created_at: new Date(order.createdAt ?? 0).toISOString(),
    order_items: itemsByOrder.get(order.id) ?? [],
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
          <SiteHeader title="Orders" />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <OrdersDashboard initialOrders={orders} />
              </div>
            </div>
          </div>
        </SidebarInset>
        </SidebarProvider>
      </div>
    </TooltipProvider>
  )
}
