"use client";

import { useEffect, useState } from "react";
import { Search, Users as UsersIcon, UserCheck, UserX, TrendingUp } from "lucide-react";
import { customerAPI } from "@/lib/api";
import { formatDate, cn } from "@/lib/utils";
import toast from "react-hot-toast";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({ totalCustomers: 0, activeCustomers: 0, newThisMonth: 0 });

  const fetchCustomers = async () => {
    try {
      const params: any = { limit: 100 };
      if (searchQuery) params.search = searchQuery;
      const { data } = await customerAPI.getCustomers(params);
      setCustomers(data.customers);
    } catch {} finally { setIsLoading(false); }
  };

  const fetchStats = async () => {
    try {
      const { data } = await customerAPI.getCustomerStats();
      setStats(data);
    } catch {}
  };

  useEffect(() => { fetchCustomers(); fetchStats(); }, [searchQuery]);

  const toggleStatus = async (id: string) => {
    try {
      await customerAPI.toggleCustomerStatus(id);
      toast.success("Statut mis à jour");
      fetchCustomers();
    } catch { toast.error("Erreur"); }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Clients</h1>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Clients", value: stats.totalCustomers, icon: UsersIcon, color: "from-blue-500 to-blue-700" },
          { label: "Clients Actifs", value: stats.activeCustomers, icon: UserCheck, color: "from-green-500 to-green-700" },
          { label: "Nouveaux ce mois", value: stats.newThisMonth, icon: TrendingUp, color: "from-purple-500 to-purple-700" },
        ].map((s) => (
          <div key={s.label} className="bg-dark-900 rounded-2xl border border-white/5 p-5">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}>
              <s.icon size={18} className="text-white" />
            </div>
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className="text-xs text-dark-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
        <input
          type="text"
          placeholder="Rechercher un client..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-dark-900 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-dark-500 focus:outline-none focus:border-brand-500"
        />
      </div>

      <div className="bg-dark-900 rounded-2xl border border-white/5 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs text-dark-400 uppercase tracking-wider border-b border-white/5">
              <th className="px-6 py-3">Client</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Téléphone</th>
              <th className="px-6 py-3">Commandes</th>
              <th className="px-6 py-3">Inscrit</th>
              <th className="px-6 py-3">Statut</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {customers.map((c) => (
              <tr key={c.id} className="hover:bg-white/[0.02]">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-brand-600/20 rounded-full flex items-center justify-center">
                      <span className="text-brand-400 text-xs font-bold">{c.firstName[0]}{c.lastName[0]}</span>
                    </div>
                    <span className="text-sm text-white font-medium">{c.firstName} {c.lastName}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-dark-300">{c.email}</td>
                <td className="px-6 py-4 text-sm text-dark-400">{c.phone || "—"}</td>
                <td className="px-6 py-4 text-sm text-dark-300">{c._count?.orders || 0}</td>
                <td className="px-6 py-4 text-xs text-dark-400">{formatDate(c.createdAt)}</td>
                <td className="px-6 py-4">
                  <span className={cn("px-3 py-1 rounded-full text-xs font-semibold border", c.isActive ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-red-500/20 text-red-400 border-red-500/30")}>
                    {c.isActive ? "Actif" : "Inactif"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button onClick={() => toggleStatus(c.id)} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium border transition-all", c.isActive ? "border-red-500/30 text-red-400 hover:bg-red-500/5" : "border-green-500/30 text-green-400 hover:bg-green-500/5")}>
                    {c.isActive ? "Désactiver" : "Activer"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {customers.length === 0 && <p className="text-center py-12 text-dark-400">Aucun client trouvé</p>}
      </div>
    </div>
  );
}
