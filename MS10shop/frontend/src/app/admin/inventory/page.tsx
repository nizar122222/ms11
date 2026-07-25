"use client";

import { useEffect, useState } from "react";
import { Search, Package, AlertTriangle, TrendingDown, BarChart3 } from "lucide-react";
import { productAPI } from "@/lib/api";
import { Product } from "@/types";
import { formatPrice, cn } from "@/lib/utils";

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "low" | "out">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const params: any = { limit: 200 };
      if (searchQuery) params.search = searchQuery;
      const { data } = await productAPI.getProducts(params);
      setProducts(data.products);
    } catch {} finally { setIsLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, [searchQuery]);

  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 5);
  const outOfStock = products.filter((p) => p.stock === 0);
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);

  const filteredProducts = filter === "low" ? lowStock : filter === "out" ? outOfStock : products;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Inventaire</h1>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-dark-900 rounded-2xl border border-white/5 p-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mb-3"><Package size={18} className="text-white" /></div>
          <p className="text-2xl font-bold text-white">{totalStock}</p>
          <p className="text-xs text-dark-400 mt-1">Stock Total</p>
        </div>
        <div className="bg-dark-900 rounded-2xl border border-white/5 p-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center mb-3"><AlertTriangle size={18} className="text-white" /></div>
          <p className="text-2xl font-bold text-orange-400">{lowStock.length}</p>
          <p className="text-xs text-dark-400 mt-1">Stock Faible</p>
        </div>
        <div className="bg-dark-900 rounded-2xl border border-white/5 p-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center mb-3"><TrendingDown size={18} className="text-white" /></div>
          <p className="text-2xl font-bold text-red-400">{outOfStock.length}</p>
          <p className="text-xs text-dark-400 mt-1">Rupture de Stock</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative max-w-md flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
          <input type="text" placeholder="Rechercher..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-dark-900 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-dark-500 focus:outline-none focus:border-brand-500" />
        </div>
        {(["all", "low", "out"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={cn("px-4 py-2 rounded-xl text-xs font-medium border transition-all", filter === f ? "bg-brand-600/20 border-brand-500/30 text-brand-400" : "bg-dark-900 border-white/10 text-dark-400 hover:text-white")}>
            {f === "all" ? "Tout" : f === "low" ? "Stock Faible" : "Épuisé"}
          </button>
        ))}
      </div>

      <div className="bg-dark-900 rounded-2xl border border-white/5 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs text-dark-400 uppercase tracking-wider border-b border-white/5">
              <th className="px-6 py-3">Produit</th>
              <th className="px-6 py-3">Prix</th>
              <th className="px-6 py-3">Stock</th>
              <th className="px-6 py-3">Vendus</th>
              <th className="px-6 py-3">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredProducts.map((p) => (
              <tr key={p.id} className="hover:bg-white/[0.02]">
                <td className="px-6 py-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-dark-800 rounded-lg overflow-hidden shrink-0">
                    {p.images?.[0] && <img src={p.images[0].url} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <span className="text-sm text-white truncate max-w-[200px]">{p.name}</span>
                </td>
                <td className="px-6 py-4 text-sm text-white font-medium">{formatPrice(p.price)}</td>
                <td className="px-6 py-4">
                  <span className={cn("text-sm font-semibold", p.stock === 0 ? "text-red-400" : p.stock <= 5 ? "text-orange-400" : "text-white")}>{p.stock}</span>
                </td>
                <td className="px-6 py-4 text-sm text-dark-300">{p.soldCount}</td>
                <td className="px-6 py-4">
                  {p.stock === 0 ? (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30">Épuisé</span>
                  ) : p.stock <= 5 ? (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/20 text-orange-400 border border-orange-500/30">Critique</span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/30">OK</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredProducts.length === 0 && <p className="text-center py-12 text-dark-400">Aucun produit</p>}
      </div>
    </div>
  );
}
