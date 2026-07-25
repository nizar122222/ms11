"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Package, ShoppingCart, Users, Trophy,
  BarChart3, Settings, LogOut, Menu, X, ChevronRight, Bell, Search, Shirt
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";

const sidebarLinks = [
  { href: "/admin/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Commandes", icon: ShoppingCart },
  { href: "/admin/products", label: "Produits", icon: Package },
  { href: "/admin/customers", label: "Clients", icon: Users },
  { href: "/admin/inventory", label: "Inventaire", icon: BarChart3 },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAdmin, isAuthenticated, isLoading, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isAdmin)) {
      router.push("/login");
    }
  }, [isAuthenticated, isAdmin, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-950">
        <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) return null;

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-dark-950 flex">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-dark-900 border-r border-white/5 flex flex-col transition-transform duration-300 lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/5">
          <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl flex items-center justify-center">
            <span className="text-white font-black text-lg">M</span>
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">MS10Shop</h2>
            <p className="text-xs text-dark-400">Admin Panel</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-brand-600/20 text-brand-400 border border-brand-500/20"
                    : "text-dark-400 hover:text-white hover:bg-white/5"
                )}
              >
                <link.icon size={18} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-4 py-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-4 py-3 mb-2 bg-dark-800 rounded-xl">
            <div className="w-9 h-9 bg-brand-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">{user?.firstName?.[0]}{user?.lastName?.[0]}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-dark-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/5 transition-colors"
          >
            <LogOut size={18} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 lg:ml-64">
        <header className="sticky top-0 z-30 bg-dark-950/90 backdrop-blur-xl border-b border-white/5">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-white/5 rounded-xl transition-colors"
            >
              <Menu size={20} />
            </button>

            <div className="flex-1 max-w-lg mx-4">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="w-full bg-dark-900 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-dark-500 focus:outline-none focus:border-brand-500 transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="relative p-2.5 hover:bg-white/5 rounded-xl transition-colors">
                <Bell size={18} className="text-dark-400" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <Link
                href="/"
                className="p-2.5 hover:bg-white/5 rounded-xl transition-colors text-dark-400 hover:text-white"
              >
                <Shirt size={18} />
              </Link>
            </div>
          </div>
        </header>

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
