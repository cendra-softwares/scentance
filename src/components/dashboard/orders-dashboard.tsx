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
  MapPin,
  Phone,
  LayoutDashboard,
  Filter,
  RotateCcw,
  Printer,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateOrderStatus, deleteOrder, sendOrderConfirmationEmail } from "@/lib/actions";
import { motion, AnimatePresence } from "framer-motion";
import Papa from "papaparse";
import { jsPDF } from "jspdf";
import { applyPlugin } from "jspdf-autotable";
import ExcelJS from "exceljs";

// Initialize the plugin
applyPlugin(jsPDF);

interface OrdersDashboardProps {
  initialOrders: Order[];
}

export function OrdersDashboard({ initialOrders }: OrdersDashboardProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string[]>(["all"]);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [exportScope, setExportScope] = useState<"current" | "all" | "confirmed">("current");

  // Custom Dropdown Component
  const CustomDropdown = ({ 
    value, 
    onChange, 
    options, 
    icon: Icon, 
    label,
    className = "",
    multiple = false
  }: { 
    value: any; 
    onChange: (val: any) => void; 
    options: { label: string; value: any }[]; 
    icon?: any;
    label?: string;
    className?: string;
    multiple?: boolean;
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    const handleSelect = (optionValue: any) => {
      if (!multiple) {
        onChange(optionValue);
        setIsOpen(false);
        return;
      }

      // Multi-select logic
      if (optionValue === "all") {
        onChange(["all"]);
        return;
      }

      const newValue = Array.isArray(value) ? [...value] : [];
      const allIndex = newValue.indexOf("all");
      if (allIndex > -1) newValue.splice(allIndex, 1);

      const index = newValue.indexOf(optionValue);
      if (index > -1) {
        newValue.splice(index, 1);
      } else {
        newValue.push(optionValue);
      }

      if (newValue.length === 0) {
        onChange(["all"]);
      } else {
        onChange(newValue);
      }
    };

    const isSelected = (optionValue: any) => {
      if (multiple && Array.isArray(value)) {
        return value.includes(optionValue);
      }
      return value === optionValue;
    };

    const getDisplayLabel = () => {
      if (multiple && Array.isArray(value)) {
        if (value.includes("all")) return "All Status";
        if (value.length === 1) return options.find(o => o.value === value[0])?.label || label;
        return `${value.length} Statuses Selected`;
      }
      return options.find(o => o.value === value)?.label || label;
    };

    return (
      <div className={`relative ${className}`}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm min-w-[160px] justify-between group h-11"
        >
          <div className="flex items-center gap-2.5">
            {Icon && <Icon className="w-4 h-4 text-zinc-400 group-hover:text-indigo-500 transition-colors" />}
            <span className="text-zinc-600 dark:text-zinc-300 font-bold uppercase tracking-widest text-[10px] truncate">
              {getDisplayLabel()}
            </span>
          </div>
          <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-500 ease-in-out ${isOpen ? 'rotate-180 text-indigo-500' : ''}`} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60]" 
                onClick={() => setIsOpen(false)} 
              />
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.95, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: 12, scale: 0.95, filter: "blur(4px)" }}
                transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                className="absolute top-full mt-2 left-0 right-0 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl z-[70] overflow-hidden py-2 min-w-[200px]"
              >
                {options.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className={`w-full text-left px-5 py-3 text-[10px] uppercase tracking-widest transition-all ${
                      isSelected(option.value)
                      ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-500/5 font-black' 
                      : 'text-zinc-600 dark:text-zinc-400 font-bold hover:bg-zinc-50 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {multiple && (
                          <div className={`w-3 h-3 rounded border flex items-center justify-center transition-colors ${
                            isSelected(option.value) 
                            ? 'bg-indigo-500 border-indigo-500' 
                            : 'border-zinc-300 dark:border-zinc-600'
                          }`}>
                            {isSelected(option.value) && <CheckCircle size={8} className="text-white" />}
                          </div>
                        )}
                        {option.label}
                      </div>
                      {!multiple && isSelected(option.value) && (
                        <motion.div layoutId="active-indicator" className="w-1 h-1 rounded-full bg-indigo-500" />
                      )}
                    </div>
                  </button>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  };


  const filteredOrders = orders.filter(order => {
    const orderIdShort = order.id.slice(0, 8).toLowerCase();
    const matchesSearch = 
      order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phone.includes(searchTerm) ||
      orderIdShort.includes(searchTerm.toLowerCase()) ||
      order.order_items?.some(item => item.product_name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = 
      filterStatus.includes("all") || 
      filterStatus.includes(order.status);
    
    return matchesSearch && matchesStatus;
  });

  const handleConfirmOrder = async (orderId: string) => {
    if (!confirm("Confirm this order? This will send a confirmation email to the customer.")) return;
    
    setIsUpdating(orderId);
    const result = await updateOrderStatus(orderId, "confirmed");
    if (result.success) {
      // Send the confirmation email
      await sendOrderConfirmationEmail(orderId);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: "confirmed" } : o));
    } else {
      alert("Failed to confirm order");
    }
    setIsUpdating(null);
  };

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

  const getOrdersToExport = () => {
    if (exportScope === "all") return orders;
    if (exportScope === "confirmed") return orders.filter(o => o.status === "confirmed");
    return filteredOrders;
  };

  const exportCSV = () => {
    const dataToExport = getOrdersToExport();
    const data = dataToExport.flatMap(o => 
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
    link.setAttribute("download", `orders_${exportScope}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportExcel = async () => {
    const dataToExport = getOrdersToExport();
    const data = dataToExport.flatMap(o => 
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

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Orders');
    
    // Add headers
    worksheet.columns = [
      { header: 'OrderID', key: 'OrderID', width: 40 },
      { header: 'Date', key: 'Date', width: 12 },
      { header: 'Customer', key: 'Customer', width: 20 },
      { header: 'Phone', key: 'Phone', width: 15 },
      { header: 'Product', key: 'Product', width: 25 },
      { header: 'Price', key: 'Price', width: 10 },
      { header: 'Qty', key: 'Qty', width: 8 },
      { header: 'TotalAmount', key: 'TotalAmount', width: 12 },
      { header: 'Address', key: 'Address', width: 40 },
      { header: 'Status', key: 'Status', width: 12 },
    ];
    
    // Add rows
    data.forEach(row => worksheet.addRow(row));
    
    // Style header row
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF33365C' }
    };
    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    
    // Generate and download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `orders_${exportScope}_${new Date().toISOString().split('T')[0]}.xlsx`;
    link.click();
  };

  const exportPDF = () => {
    const dataToExport = getOrdersToExport();
    const doc = new jsPDF();
    doc.setFont("helvetica");
    doc.text("Scentence Orders Report", 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()} (${exportScope} view)`, 14, 22);
    
    const tableData = dataToExport.map(o => [
      new Date(o.created_at).toLocaleDateString(),
      o.customer_name || 'N/A',
      (o.order_items || []).map(i => `${i.product_name} (x${i.quantity})`).join(", ") || 'No items',
      `₹${(o.total_amount || 0).toLocaleString()}`,
      o.status || 'pending'
    ]);

    (doc as any).autoTable({
      startY: 30,
      head: [['Date', 'Customer', 'Items', 'Total', 'Status']],
      body: tableData,
      theme: 'grid',
      styles: { fontSize: 8, font: "helvetica" },
      headStyles: { fillColor: [51, 65, 85] }
    });

    doc.save(`orders_${exportScope}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const exportShippingPDF = (order: Order) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(79, 70, 229); // Indigo-600
    doc.text("SCENTENCE", 14, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139); // Slate-500
    doc.setFont("helvetica", "normal");
    doc.text("SHIPPING DETAILS", 14, 26);
    
    // Order Info Box
    doc.setDrawColor(226, 232, 240); // Slate-200
    doc.setFillColor(248, 250, 252); // Slate-50
    doc.roundedRect(14, 35, 182, 25, 2, 2, "FD");
    
    doc.setFont("helvetica", "bold");
    doc.setTextColor(51, 65, 85); // Slate-800
    doc.text("Order ID:", 20, 45);
    doc.text("Date:", 20, 52);
    
    doc.setFont("helvetica", "normal");
    doc.text(`#${order.id.toUpperCase()}`, 45, 45);
    doc.text(new Date(order.created_at).toLocaleString(), 45, 52);

    // Shipping To Section
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(30, 41, 59); // Slate-900
    doc.text("SHIP TO:", 14, 75);
    
    doc.setLineWidth(0.5);
    doc.line(14, 78, 196, 78);

    doc.setFontSize(11);
    doc.text(order.customer_name, 14, 88);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105); // Slate-600
    
    // Split address if too long
    const addressLines = doc.splitTextToSize(order.address || '', 100);
    doc.text(addressLines, 14, 95);
    
    const nextY = 95 + (addressLines.length * 5);
    doc.text(`${order.city}, ${order.state} - ${order.pincode}`, 14, nextY);
    doc.setFont("helvetica", "bold");
    doc.text(`Phone: ${order.phone}`, 14, nextY + 7);

    // Items Table
    doc.setFontSize(12);
    doc.setTextColor(30, 41, 59);
    doc.text("PACKAGE CONTENTS:", 14, nextY + 25);
    
    const itemData = (order.order_items || []).map(item => [
      item.product_name || 'N/A',
      `x ${item.quantity || 1}`
    ]);

    (doc as any).autoTable({
      startY: nextY + 30,
      head: [['Product Description', 'Quantity']],
      body: itemData,
      theme: 'striped',
      headStyles: { fillColor: [51, 65, 85], textColor: 255, fontStyle: 'bold' },
      bodyStyles: { textColor: 51 },
      columnStyles: {
        0: { cellWidth: 140 },
        1: { cellWidth: 42, halign: 'center' }
      }
    });

    // Footer / Instructions
    const finalY = (doc as any).lastAutoTable?.cursor?.y || (nextY + 80);
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(148, 163, 184); // Slate-400
    doc.text("Please handle with care. Fragile items inside.", 14, finalY);
    
    // Sanitize filename - remove/replace special characters
    const sanitizeFilename = (name: string): string => {
      return name
        .replace(/[^a-zA-Z0-9]/g, '_')  // Replace non-alphanumeric with underscore
        .replace(/_+/g, '_')              // Collapse multiple underscores
        .replace(/^_|_$/g, '');           // Trim leading/trailing underscores
    };

    const safeCustomerName = sanitizeFilename(order.customer_name || 'customer');
    doc.save(`shipping_${safeCustomerName}_${order.id.slice(0,8)}.pdf`);
  };

  const statusColors: Record<string, string> = {
    pending: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    confirmed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    shipped: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    cancelled: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
  };

  return (
    <div className="flex flex-col gap-8 px-4 md:px-8 pb-12 font-sans">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Orders", value: orders.length, icon: Package, color: "text-zinc-900 dark:text-white", status: ["all"] },
          { label: "Pending", value: orders.filter(o => o.status === "pending").length, icon: Clock, color: "text-orange-600", status: ["pending"] },
          { label: "Confirmed", value: orders.filter(o => o.status === "confirmed").length, icon: CheckCircle, color: "text-emerald-600", status: ["confirmed"] },
          { 
            label: "Confirmed Revenue", 
            value: `₹${orders
              .filter(o => o.status === "confirmed" || o.status === "shipped")
              .reduce((acc, o) => acc + o.total_amount, 0)
              .toLocaleString()}`, 
            icon: LayoutDashboard, 
            color: "text-indigo-600",
            status: ["all"]
          }
        ].map((stat, i) => (
          <button 
            key={i} 
            onClick={() => setFilterStatus(stat.status)}
            className={`bg-white dark:bg-zinc-900 border rounded-2xl p-4 md:p-6 shadow-sm text-left transition-all hover:ring-2 hover:ring-indigo-500/20 ${
              JSON.stringify(filterStatus) === JSON.stringify(stat.status) ? 'ring-2 ring-indigo-500 border-indigo-500/30' : 'border-zinc-200 dark:border-zinc-800'
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
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input 
            type="text" 
            placeholder="Search by customer, phone, or product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-11 pr-4 h-11 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <CustomDropdown
            value={filterStatus}
            onChange={setFilterStatus}
            icon={Filter}
            multiple={true}
            options={[
              { label: "All Status", value: "all" },
              { label: "Pending", value: "pending" },
              { label: "Confirmed", value: "confirmed" },
              { label: "Shipped", value: "shipped" },
              { label: "Cancelled", value: "cancelled" },
            ]}
          />

          <div className="flex items-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-1.5 shadow-sm h-11">
            <CustomDropdown
              value={exportScope}
              onChange={setExportScope}
              className="[&>button]:border-none [&>button]:shadow-none [&>button]:bg-transparent [&>button]:min-w-[150px]"
              options={[
                { label: "Current View", value: "current" },
                { label: "All Orders", value: "all" },
                { label: "Confirmed Only", value: "confirmed" },
              ]}
            />
            <div className="w-px h-5 bg-zinc-200 dark:bg-zinc-800 mx-2" />
            <div className="flex items-center gap-1 pr-1">
              <button onClick={exportCSV} title="Export CSV" className="p-2 text-zinc-400 hover:text-indigo-500 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-lg transition-all"><TableIcon size={16} /></button>
              <button onClick={exportExcel} title="Export Excel" className="p-2 text-zinc-400 hover:text-emerald-500 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-lg transition-all"><Download size={16} /></button>
              <button onClick={exportPDF} title="Export PDF" className="p-2 text-zinc-400 hover:text-rose-500 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-lg transition-all"><FileText size={16} /></button>
            </div>
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
                          <button onClick={() => handleConfirmOrder(order.id)} className="p-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-lg transition-all" title="Confirm"><CheckCircle size={18} /></button>
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
                        <button 
                          onClick={() => exportShippingPDF(order)} 
                          className="p-2 text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg transition-all" 
                          title="Print Shipping PDF"
                        >
                          <Printer size={18} />
                        </button>
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
                      <Button onClick={() => handleConfirmOrder(order.id)} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-11 text-xs font-bold shadow-lg shadow-indigo-500/20">
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
                    <Button onClick={() => exportShippingPDF(order)} variant="outline" className="flex-1 border-indigo-200 dark:border-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-xl h-11 text-xs font-bold shadow-sm shadow-indigo-500/5 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-all">
                      <Printer size={16} className="mr-2" /> Shipping Label
                    </Button>
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
  );
}
