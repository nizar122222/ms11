"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Package, Heart, LogOut, Save } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { authAPI, orderAPI } from "@/lib/api";
import { Order } from "@/types";
import { formatPrice, formatDate, getStatusColor, getStatusLabel, cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function AccountPage() {
  const { user, setUser, logout } = useAuthStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"profile" | "orders">("profile");
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phone: user?.phone || "",
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await orderAPI.getOrders({ limit: 50 });
        setOrders(data.orders);
      } catch {} finally { setIsLoading(false); }
    };
    if (user) {
      setForm({ firstName: user.firstName, lastName: user.lastName, phone: user.phone || "" });
      fetchOrders();
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await authAPI.updateProfile(form);
      setUser(data.user, localStorage.getItem("token") || "");
      toast.success("Profil mis à jour");
    } catch { toast.error("Erreur de mise à jour"); }
  };

  const handleLogout = () => { logout(); router.push("/"); };

  if (!user) return null;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-brand-600/20 rounded-2xl flex items-center justify-center">
            <span className="text-brand-400 text-2xl font-bold">{user.firstName[0]}{user.lastName[0]}</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{user.firstName} {user.lastName}</h1>
            <p className="text-dark-400 text-sm">{user.email}</p>
          </div>
        </div>

        <div className="flex gap-4 mb-8">
          {[
            { key: "profile", label: "Profil", icon: User },
            { key: "orders", label: "Commandes", icon: Package },
          ].map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setActiveTab(key as any)} className={cn("flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all", activeTab === key ? "bg-brand-600/20 border-brand-500/30 text-brand-400" : "bg-dark-900 border-white/10 text-dark-400 hover:text-white")}>
              <Icon size={16} /> {label}
            </button>
          ))}
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border border-red-500/20 text-red-400 hover:bg-red-500/5 ml-auto">
            <LogOut size={16} /> Déconnexion
          </button>
        </div>

        {activeTab === "profile" && (
          <form onSubmit={handleUpdateProfile} className="bg-dark-900 rounded-2xl border border-white/5 p-6 space-y-4">
            <h2 className="text-lg font-bold text-white mb-4">Informations personnelles</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-1.5">Prénom</label>
                <input type="text" value={form.firstName} onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))} className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-1.5">Nom</label>
                <input type="text" value={form.lastName} onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))} className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1.5">Email</label>
              <input type="email" value={user.email} disabled className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-dark-400 text-sm cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1.5">Téléphone</label>
              <input type="tel" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-500" />
            </div>
            <button type="submit" className="flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-semibold transition-colors">
              <Save size={16} /> Enregistrer
            </button>
          </form>
        )}

        {activeTab === "orders" && (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-dark-900 rounded-2xl border border-white/5 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-bold text-brand-400">{order.orderNumber}</p>
                    <p className="text-xs text-dark-400">{formatDate(order.createdAt)}</p>
                  </div>
                  <span className={cn("px-3 py-1 rounded-full text-xs font-semibold border", getStatusColor(order.status))}>
                    {getStatusLabel(order.status)}
                  </span>
                </div>
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <span className="text-dark-300">{item.productName} ({item.size}) × {item.quantity}</span>
                      <span className="text-white font-medium">{formatPrice(item.total)}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between pt-3 mt-3 border-t border-white/10">
                  <span className="text-dark-400 text-sm">Total</span>
                  <span className="text-white font-bold">{formatPrice(order.total)}</span>
                </div>
              </div>
            ))}
            {orders.length === 0 && <p className="text-center py-12 text-dark-400">Aucune commande</p>}
          </div>
        )}
      </div>
    </div>
  );
}
