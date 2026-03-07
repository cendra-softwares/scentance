"use client";

import { useState } from "react";
import { Order } from "@/lib/types";
import { 
  Download, 
  Trash2, 
  CheckCircle, 
  Clock, 
  Package, 
  Search, 
  FileText, 
  Table as TableIcon,
  LogOut,
  MapPin,
  Phone,
  LayoutDashboard,
  Filter,
  MoreVertical,
  RotateCcw,
  Undo
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateOrderStatus, deleteOrder } from "@/lib/actions";
import { createClient } from "@/lib/supabase/client";
import Papa from "papaparse";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface AdminDashboardProps {
  initialOrders: Order[];
  userEmail: string | undefined;
}

export function AdminDashboard({ initialOrders, userEmail }: AdminDashboardProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const filteredOrders = orders.filter(order => {
    const orderIdShort = order.id.slice(0, 8).toLowerCase();
    const matchesSearch = 
      order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phone.includes(searchTerm) ||
      orderIdShort.includes(searchTerm.toLowerCase()) ||
      order.order_items?.some(item => item.product_name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = 
      filterStatus === "all" || 
      (filterStatus === "confirmed" ? (order.status === "confirmed" || order.status === "shipped") : order.status === filterStatus);
    
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setIsUpdating(orderId);
    const result = await updateOrderStatus(orderId, newStatus);
    if (result.success) {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } else {
      alert("Failed to update status");
    }
    setIsUpdating(null);
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to delete this order?")) return;
    
    setIsUpdating(orderId);
    const result = await deleteOrder(orderId);
    if (result.success) {
      setOrders(prev => prev.filter(o => o.id !== orderId));
    } else {
      alert("Failed to delete order");
    }
    setIsUpdating(null);
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const exportCSV = () => {
    const data = filteredOrders.flatMap(o => 
      o.order_items?.map(item => ({
        OrderID: o.id,
        Date: new Date(o.created_at).toLocaleDateString(),
        Customer: o.customer_name,
        Phone: o.phone,
        Product: item.product_name,
        Price: item.product_price,
        Qty: item.quantity,
        TotalAmount: o.total_amount,
        Address: `${o.address}, ${o.city}, ${o.state} - ${o.pincode}`,
        Status: o.status
      })) || []
    );
    
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `orders_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportExcel = () => {
    const data = filteredOrders.flatMap(o => 
      o.order_items?.map(item => ({
        OrderID: o.id,
        Date: new Date(o.created_at).toLocaleDateString(),
        Customer: o.customer_name,
        Phone: o.phone,
        Product: item.product_name,
        Price: item.product_price,
        Qty: item.quantity,
        TotalAmount: o.total_amount,
        Address: `${o.address}, ${o.city}, ${o.state} - ${o.pincode}`,
        Status: o.status
      })) || []
    );

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
    XLSX.writeFile(workbook, `orders_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica");
    doc.text("Scentance Orders Report", 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22);
    
    const tableData = filteredOrders.map(o => [
      new Date(o.created_at).toLocaleDateString(),
      o.customer_name,
      o.order_items?.map(i => `${i.product_name} (x${i.quantity})`).join(", "),
      `₹${o.total_amount.toLocaleString()}`,
      o.status
    ]);

    doc.autoTable({
      startY: 30,
      head: [['Date', 'Customer', 'Items', 'Total', 'Status']],
      body: tableData,
      theme: 'grid',
      styles: { fontSize: 8, font: "helvetica" },
      headStyles: { fillColor: [51, 65, 85] }
    });

    doc.save(`orders_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const statusColors: Record<string, string> = {
    pending: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    confirmed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    shipped: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    cancelled: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
  };

  return (
    <div 
      className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 p-4 md:p-8"
      style={{ fontFamily: 'var(--font-geist-sans), system-ui, -apple-system, sans-serif' }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <LayoutDashboard size={20} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight">Admin Portal</h1>
              <p className="text-zinc-500 dark:text-zinc-400 text-xs font-medium uppercase tracking-wider">{userEmail}</p>
            </div>
          </div>
          
          <Button 
            onClick={handleLogout}
            variant="ghost" 
            className="rounded-xl text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/50 dark:hover:bg-zinc-800"
          >
            <LogOut size={18} className="mr-2" /> Logout
          </Button>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Orders", value: orders.length, icon: Package, color: "text-zinc-900 dark:text-white", status: "all" },
            { label: "Pending", value: orders.filter(o => o.status === "pending").length, icon: Clock, color: "text-orange-600", status: "pending" },
            { label: "Confirmed", value: orders.filter(o => o.status === "confirmed" || o.status === "shipped").length, icon: CheckCircle, color: "text-emerald-600", status: "confirmed" },
            { 
              label: "Confirmed Revenue", 
              value: `₹${orders
                .filter(o => o.status === "confirmed" || o.status === "shipped")
                .reduce((acc, o) => acc + o.total_amount, 0)
                .toLocaleString()}`, 
              icon: LayoutDashboard, 
              color: "text-indigo-600",
              status: "all"
            }
          ].map((stat, i) => (
            <button 
              key={i} 
              onClick={() => setFilterStatus(stat.status)}
              className={`bg-white dark:bg-zinc-900 border rounded-2xl p-4 md:p-6 shadow-sm text-left transition-all hover:ring-2 hover:ring-indigo-500/20 ${
                filterStatus === stat.status ? 'ring-2 ring-indigo-500 border-indigo-500/30' : 'border-zinc-200 dark:border-zinc-800'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <p className="text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest">{stat.label}</p>
                <stat.icon size={14} className="text-zinc-400" />
              </div>
              <h3 className={`text-xl md:text-2xl font-bold ${stat.color}`}>{stat.value}</h3>
            </button>
          ))}
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search by customer, phone, or product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
            />
          </div>
          
          <div className="flex gap-2">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:border-indigo-500 cursor-pointer shadow-sm appearance-none min-w-[140px]"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="flex bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-1 shadow-sm">
              <button onClick={exportCSV} title="Export CSV" className="p-2.5 text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg transition-all"><TableIcon size={18} /></button>
              <button onClick={exportExcel} title="Export Excel" className="p-2.5 text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg transition-all"><Download size={18} /></button>
              <button onClick={exportPDF} title="Export PDF" className="p-2.5 text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg transition-all"><FileText size={18} /></button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-16 text-center shadow-sm">
            <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-zinc-300 dark:text-zinc-600" />
            </div>
            <h4 className="text-zinc-900 dark:text-white font-bold mb-1">No orders found</h4>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm">Try adjusting your filters or search term.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800">
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Order Details</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Items</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Payment</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Status</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-zinc-900 dark:text-white">{order.customer_name}</span>
                          <span className="text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-500 px-1.5 py-0.5 rounded font-mono font-bold">#{order.id.slice(0, 8).toUpperCase()}</span>
                        </div>
                        <span className="text-xs text-zinc-500 flex items-center gap-1"><Phone size={10} /> {order.phone}</span>

                          <span className="text-[10px] text-zinc-400 mt-2 font-medium">
                            {new Date(order.created_at).toLocaleString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-1.5">
                          {order.order_items?.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                              <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                                {item.product_name} <span className="text-zinc-400 text-[10px] ml-1">×{item.quantity}</span>
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="font-bold text-zinc-900 dark:text-white">₹{order.total_amount.toLocaleString()}</span>
                        <p className="text-[10px] text-zinc-400 uppercase tracking-tighter mt-0.5">Direct Shipping</p>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${statusColors[order.status]}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {order.status === "pending" && (
                            <button onClick={() => handleUpdateStatus(order.id, "confirmed")} className="p-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-lg transition-all" title="Confirm"><CheckCircle size={18} /></button>
                          )}
                          {order.status === "confirmed" && (
                            <>
                              <button onClick={() => handleUpdateStatus(order.id, "shipped")} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-all" title="Ship"><Package size={18} /></button>
                              <button onClick={() => handleUpdateStatus(order.id, "pending")} className="p-2 text-zinc-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-500/10 rounded-lg transition-all" title="Un-confirm"><RotateCcw size={18} /></button>
                            </>
                          )}
                          {order.status === "shipped" && (
                            <button onClick={() => handleUpdateStatus(order.id, "confirmed")} className="p-2 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-all" title="Un-ship"><RotateCcw size={18} /></button>
                          )}
                          {order.status === "cancelled" && (
                            <button onClick={() => handleUpdateStatus(order.id, "pending")} className="p-2 text-zinc-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-500/10 rounded-lg transition-all" title="Un-cancel"><RotateCcw size={18} /></button>
                          )}
                          {order.status !== "cancelled" && (
                            <button onClick={() => handleUpdateStatus(order.id, "cancelled")} className="p-2 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-all" title="Cancel"><Clock size={18} /></button>
                          )}
                          <button onClick={() => handleDeleteOrder(order.id)} className="p-2 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-all" title="Delete"><Trash2 size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile/Tablet Card List */}
            <div className="lg:hidden space-y-4">
              {filteredOrders.map((order) => (
                <div key={order.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
              <div className="p-5 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <h4 className="font-bold text-zinc-900 dark:text-white leading-none">{order.customer_name}</h4>
                    <span className="text-[9px] bg-zinc-100 dark:bg-zinc-800 text-zinc-500 px-1.5 py-0.5 rounded font-mono font-bold">#{order.id.slice(0, 8).toUpperCase()}</span>
                    <span className={`px-2 py-0.5 rounded-md text-[8px] font-bold uppercase tracking-wider ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </div>

                      <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-tighter">
                        {new Date(order.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-zinc-900 dark:text-white">₹{order.total_amount.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div className="p-5 space-y-5">
                    <div className="space-y-2.5">
                      <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Order Items</p>
                      <div className="space-y-2">
                        {order.order_items?.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center text-sm">
                            <span className="text-zinc-700 dark:text-zinc-300 font-medium">{item.product_name}</span>
                            <span className="text-zinc-400 text-xs font-bold bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md">x{item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                      <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Shipping Information</p>
                      <div className="flex items-start gap-3 text-xs">
                        <Phone size={14} className="mt-0.5 text-zinc-400 shrink-0" />
                        <span className="text-zinc-700 dark:text-zinc-300 font-medium">{order.phone}</span>
                      </div>
                      <div className="flex items-start gap-3 text-xs border-t border-zinc-200 dark:border-zinc-700 pt-3">
                        <MapPin size={14} className="mt-0.5 text-zinc-400 shrink-0" />
                        <span className="text-zinc-700 dark:text-zinc-300 font-medium leading-relaxed">
                          {order.address}, {order.city}, {order.state} - {order.pincode}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {order.status === "pending" && (
                        <Button onClick={() => handleUpdateStatus(order.id, "confirmed")} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-11 text-xs font-bold shadow-lg shadow-indigo-500/20">
                          Confirm Order
                        </Button>
                      )}
                      {order.status === "confirmed" && (
                        <>
                          <Button onClick={() => handleUpdateStatus(order.id, "shipped")} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-11 text-xs font-bold shadow-lg shadow-blue-500/20">
                            Mark Shipped
                          </Button>
                          <Button onClick={() => handleUpdateStatus(order.id, "pending")} variant="outline" className="flex-1 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-xl h-11 text-xs font-bold">
                            Un-confirm
                          </Button>
                        </>
                      )}
                      {order.status === "shipped" && (
                        <Button onClick={() => handleUpdateStatus(order.id, "confirmed")} variant="outline" className="flex-1 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-xl h-11 text-xs font-bold">
                          Un-ship
                        </Button>
                      )}
                      {order.status === "cancelled" && (
                        <Button onClick={() => handleUpdateStatus(order.id, "pending")} variant="outline" className="flex-1 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-xl h-11 text-xs font-bold">
                          Un-cancel
                        </Button>
                      )}
                      {order.status !== "cancelled" && (
                        <Button onClick={() => handleUpdateStatus(order.id, "cancelled")} variant="outline" className="flex-1 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-xl h-11 text-xs font-bold">
                          Cancel
                        </Button>
                      )}
                      <Button onClick={() => handleDeleteOrder(order.id)} variant="ghost" className="w-11 h-11 p-0 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl shrink-0">
                        <Trash2 size={20} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <footer className="max-w-7xl mx-auto mt-12 mb-8 text-center">
        <div className="inline-block px-4 py-1.5 bg-zinc-200/50 dark:bg-zinc-800 rounded-full">
          <p className="text-zinc-500 dark:text-zinc-500 text-[9px] uppercase tracking-[0.3em] font-bold">Scentance Archive • Internal Admin Panel</p>
        </div>
      </footer>
    </div>
  );
}
