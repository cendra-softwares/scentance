"use client";

import { 
  Users, 
  ShoppingBag, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownRight,
  Package,
  Clock,
  CheckCircle,
  TrendingUp,
  Activity
} from "lucide-react";
import { motion } from "framer-motion";

export function OverviewDashboard() {
  const stats = [
    { 
      label: "Total Revenue", 
      value: "₹1,28,430", 
      change: "+12.5%", 
      trend: "up", 
      icon: CreditCard,
      color: "text-indigo-600",
      bg: "bg-indigo-500/10"
    },
    { 
      label: "Total Orders", 
      value: "156", 
      change: "+18.2%", 
      trend: "up", 
      icon: ShoppingBag,
      color: "text-emerald-600",
      bg: "bg-emerald-500/10"
    },
    { 
      label: "Active Customers", 
      value: "2,420", 
      change: "-3.1%", 
      trend: "down", 
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-500/10"
    },
    { 
      label: "Conversion Rate", 
      value: "4.2%", 
      change: "+1.2%", 
      trend: "up", 
      icon: TrendingUp,
      color: "text-orange-600",
      bg: "bg-orange-500/10"
    },
  ];

  const recentActivity = [
    { id: 1, type: "order", title: "New order #8241", description: "Rahul Sharma purchased 'Velvet Oud'", time: "5 mins ago", icon: Package, iconColor: "text-indigo-500" },
    { id: 2, type: "user", title: "New user registered", description: "Priya Singh created an account", time: "12 mins ago", icon: Users, iconColor: "text-blue-500" },
    { id: 3, type: "status", title: "Order #8238 shipped", description: "Status updated by Admin", time: "45 mins ago", icon: CheckCircle, iconColor: "text-emerald-500" },
    { id: 4, type: "order", title: "New order #8240", description: "Vikram Mehta purchased 'Sandalwood Bliss'", time: "1 hour ago", icon: Package, iconColor: "text-indigo-500" },
    { id: 5, type: "system", title: "Inventory Alert", description: "'Rose Noir' is running low on stock", time: "2 hours ago", icon: Clock, iconColor: "text-orange-500" },
  ];

  return (
    <div className="flex flex-col gap-8 px-4 md:px-8 pb-12 font-sans">
      {/* Welcome Header */}
      <div>
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Dashboard Overview</h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.label}
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold ${stat.trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
                {stat.change}
                {stat.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              </div>
            </div>
            <div>
              <p className="text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area (Chart Placeholder) */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm h-[400px] flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">Revenue Analytics</h4>
              <select className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>Last Year</option>
              </select>
            </div>
            
            <div className="flex-1 flex items-end gap-2 px-2 pb-4">
              {[40, 65, 45, 90, 55, 80, 70].map((height, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ delay: i * 0.1 + 0.5, duration: 1, ease: [0.23, 1, 0.32, 1] }}
                    className="w-full bg-indigo-500/20 group-hover:bg-indigo-500/40 rounded-t-lg relative flex justify-center transition-all"
                  >
                    <div className="absolute top-0 -translate-y-full mb-2 bg-zinc-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      ₹{height * 100}
                    </div>
                  </motion.div>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">Day {i + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar/Activity Area */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <Activity size={16} className="text-indigo-500" />
            <h4 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">Recent Activity</h4>
          </div>
          
          <div className="flex flex-col gap-6">
            {recentActivity.map((activity, i) => (
              <div key={activity.id} className="flex gap-4">
                <div className={`mt-1 p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 shrink-0 h-fit`}>
                  <activity.icon size={14} className={activity.iconColor} />
                </div>
                <div className="flex flex-col gap-1">
                  <h5 className="text-[11px] font-bold text-zinc-900 dark:text-white uppercase tracking-wide leading-none">{activity.title}</h5>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-tight">{activity.description}</p>
                  <span className="text-[9px] text-zinc-400 font-medium uppercase tracking-tighter mt-1">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>

          <button className="mt-4 w-full py-3 border border-zinc-200 dark:border-zinc-800 rounded-xl text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest hover:bg-zinc-50 dark:hover:bg-white/5 transition-all">
            View All Activity
          </button>
        </div>
      </div>
    </div>
  );
}
