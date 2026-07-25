"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ShoppingCart, DollarSign, Package, Users, TrendingUp, Clock,
  CheckCircle, XCircle, Truck, ArrowUpRight, ArrowDownRight
} from "lucide-react";
import { orderAPI } from "@/lib/api";
import { DashboardStats, Order } from "@/types";
import { formatPrice, formatDate, getStatusColor, getStatusLabel } from "@/lib/utils";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await orderAPI.getOrderStats();
        setStats(data.stats);
        setRecentOrders(data.recentOrders);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-dark-900 rounded-2xl border border-white/5 p-6">
              <div className="h-4 w-24 shimmer rounded mb-4" />
              <div className="h-8 w-32 shimmer rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Commandes",
      value: stats?.totalOrders || 0,
      icon: ShoppingCart,
      color: "from-blue-500 to-blue-700",
      change: "+12%",
      up: true,
    },
    {
      title: "Revenu Total",
      value: formatPrice(stats?.totalRevenue || 0),
      icon: DollarSign,
      color: "from-green-500 to-green-700",
      change: "+8%",
      up: true,
    },
    {
      title: "Total Produits",
      value: stats?.totalProducts || 0,
      icon: Package,
      color: "from-purple-500 to-purple-700",
      change: "+5%",
      up: true,
    },
    {
      title: "Total Clients",
      value: stats?.totalCustomers || 0,
      icon: Users,
      color: "from-orange-500 to-orange-700",
      change: "+15%",
      up: true,
    },
  ];

  const orderStatusCards = [
    { title: "En attente", value: stats?.pendingOrders || 0, icon: Clock, color: "text-yellow-400" },
    { title: "Confirmées", value: stats?.confirmedOrders || 0, icon: CheckCircle, color: "text-blue-400" },
    { title: "Livrées", value: stats?.deliveredOrders || 0, icon: Truck, color: "text-green-400" },
    { title: "Annulées", value: stats?.cancelledOrders || 0, icon: XCircle, color: "text-red-400" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Tableau de bord</h1>
          <p className="text-dark-400 text-sm mt-1">Vue d&apos;ensemble de votre boutique</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-dark-900 rounded-2xl border border-white/5 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                <card.icon size={22} className="text-white" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium ${card.up ? "text-green-400" : "text-red-400"}`}>
                {card.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {card.change}
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{card.value}</p>
            <p className="text-sm text-dark-400 mt-1">{card.title}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {orderStatusCards.map((card) => (
          <div key={card.title} className="bg-dark-900 rounded-2xl border border-white/5 p-4">
            <div className="flex items-center gap-3">
              <card.icon size={20} className={card.color} />
              <div>
                <p className="text-xl font-bold text-white">{card.value}</p>
                <p className="text-xs text-dark-400">{card.title}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-dark-900 rounded-2xl border border-white/5">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h2 className="text-lg font-bold text-white">Commandes Récentes</h2>
          <Link
            href="/admin/orders"
            className="text-sm text-brand-400 hover:text-brand-300 font-medium"
          >
            Voir tout
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-dark-400 uppercase tracking-wider">
                <th className="px-6 py-3">Commande</th>
                <th className="px-6 py-3">Client</th>
                <th className="px-6 py-3">Montant</th>
                <th className="px-6 py-3">Statut</th>
                <th className="px-6 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <Link href={`/admin/orders`} className="text-sm font-semibold text-brand-400 hover:text-brand-300">
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-white">{order.firstName} {order.lastName}</p>
                    <p className="text-xs text-dark-400">{order.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-white">{formatPrice(order.total)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-dark-400">{formatDate(order.createdAt)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {recentOrders.length === 0 && (
            <div className="text-center py-12">
              <p className="text-dark-400">Aucune commande pour le moment</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
