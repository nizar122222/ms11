"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Settings,
  Package,
  Globe,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { useLanguage } from "@/contexts/LanguageContext";
import { productAPI } from "@/lib/api";
import { cn, formatPrice } from "@/lib/utils";
import { Product } from "@/types";
import CartDrawer from "@/components/cart/CartDrawer";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { itemCount, toggleCart } = useCartStore();
  const { user, isAuthenticated, isAdmin, logout } = useAuthStore();
  const { locale, setLocale, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  }, [pathname]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    searchTimeout.current = setTimeout(async () => {
      try {
        const { data } = await productAPI.getProducts({ search: query, limit: 6 });
        setSearchResults(data.products);
      } catch {}
    }, 300);
  };

  const navLinks = [
    { href: "/", label: t("common.home") },
    { href: "/shop", label: t("common.shop") },
    { href: "/shop?isFeatured=true", label: t("home.featuredProducts") },
    { href: "/shop?isNew=true", label: t("home.newArrivals") },
    { href: "/shop?isSale=true", label: t("home.onSale") },
  ];

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    router.push("/");
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          isScrolled
            ? "bg-dark-950/90 backdrop-blur-xl border-b border-white/5 shadow-2xl shadow-black/50"
            : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl flex items-center justify-center">
                <span className="text-white font-black text-lg">M</span>
              </div>
              <span className="text-xl font-black tracking-tight hidden sm:block">
                <span className="text-white">MS10</span>
                <span className="text-brand-500">Shop</span>
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                    pathname === link.href
                      ? "text-brand-400 bg-brand-500/10"
                      : "text-dark-300 hover:text-white hover:bg-white/5"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2.5 rounded-xl hover:bg-white/5 transition-colors"
              >
                <Search size={20} className="text-dark-300" />
              </button>

              <div className="relative">
                <button
                  onClick={() => setIsLangOpen(!isLangOpen)}
                  className="p-2.5 rounded-xl hover:bg-white/5 transition-colors flex items-center gap-1"
                >
                  <Globe size={20} className="text-dark-300" />
                  <span className="text-xs font-medium text-dark-400 uppercase">{locale}</span>
                </button>
                <AnimatePresence>
                  {isLangOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-40 bg-dark-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                    >
                      {[
                        { code: "fr", label: "Français" },
                        { code: "ar", label: "العربية" },
                        { code: "en", label: "English" },
                      ].map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setLocale(lang.code as any);
                            setIsLangOpen(false);
                          }}
                          className={cn(
                            "w-full px-4 py-3 text-left text-sm hover:bg-white/5 transition-colors",
                            locale === lang.code ? "text-brand-400 bg-brand-500/10" : "text-dark-300"
                          )}
                        >
                          {lang.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {isAuthenticated && (
                <Link href="/wishlist" className="p-2.5 rounded-xl hover:bg-white/5 transition-colors hidden sm:flex">
                  <Heart size={20} className="text-dark-300" />
                </Link>
              )}

              <button
                onClick={toggleCart}
                className="relative p-2.5 rounded-xl hover:bg-white/5 transition-colors"
              >
                <ShoppingCart size={20} className="text-dark-300" />
                {itemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-brand-600 rounded-full text-white text-xs flex items-center justify-center font-bold"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </button>

              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 p-2 rounded-xl hover:bg-white/5 transition-colors"
                  >
                    <div className="w-8 h-8 bg-brand-600/20 rounded-full flex items-center justify-center">
                      <span className="text-brand-400 text-sm font-bold">
                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                      </span>
                    </div>
                    <ChevronDown size={16} className="text-dark-400 hidden sm:block" />
                  </button>
                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-56 bg-dark-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                      >
                        <div className="px-4 py-3 border-b border-white/10">
                          <p className="text-sm font-semibold text-white">{user?.firstName} {user?.lastName}</p>
                          <p className="text-xs text-dark-400">{user?.email}</p>
                        </div>
                        {isAdmin && (
                          <Link
                            href="/admin/dashboard"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-sm text-dark-300 hover:bg-white/5 transition-colors"
                          >
                            <Settings size={16} />
                            {t("common.admin")}
                          </Link>
                        )}
                        <Link
                          href="/account"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-dark-300 hover:bg-white/5 transition-colors"
                        >
                          <User size={16} />
                          {t("common.account")}
                        </Link>
                        <Link
                          href="/shop"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-dark-300 hover:bg-white/5 transition-colors"
                        >
                          <Package size={16} />
                          Mes commandes
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/5 w-full transition-colors"
                        >
                          <LogOut size={16} />
                          {t("common.logout")}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold transition-all duration-300"
                >
                  <User size={16} />
                  {t("common.login")}
                </Link>
              )}

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2.5 rounded-xl hover:bg-white/5 transition-colors lg:hidden"
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-white/5 bg-dark-950/95 backdrop-blur-xl"
            >
              <div className="max-w-3xl mx-auto px-4 py-4">
                <div className="relative">
                  <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder={t("common.searchPlaceholder")}
                    autoFocus
                    className="w-full bg-dark-900 border border-dark-700 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-dark-500 focus:outline-none focus:border-brand-500 text-lg"
                  />
                </div>
                {searchResults.length > 0 && (
                  <div className="mt-3 bg-dark-900 border border-white/10 rounded-xl overflow-hidden">
                    {searchResults.map((product) => (
                      <Link
                        key={product.id}
                        href={`/product/${product.slug}`}
                        onClick={() => {
                          setIsSearchOpen(false);
                          setSearchQuery("");
                          setSearchResults([]);
                        }}
                        className="flex items-center gap-4 px-4 py-3 hover:bg-white/5 transition-colors"
                      >
                        <div className="w-12 h-12 bg-dark-800 rounded-lg overflow-hidden shrink-0">
                          {product.images?.[0] && (
                            <img
                              src={product.images[0].url}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{product.name}</p>
                          <p className="text-xs text-dark-400">{product.team?.name}</p>
                        </div>
                        <p className="text-sm font-bold text-brand-400">{formatPrice(product.salePrice || product.price)}</p>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-white/5 bg-dark-950/95 backdrop-blur-xl"
            >
              <div className="px-4 py-4 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "block px-4 py-3 rounded-xl text-sm font-medium transition-all",
                      pathname === link.href ? "text-brand-400 bg-brand-500/10" : "text-dark-300 hover:bg-white/5"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                {!isAuthenticated && (
                  <Link
                    href="/login"
                    className="block px-4 py-3 rounded-xl text-sm font-semibold text-brand-400 hover:bg-brand-500/10"
                  >
                    {t("common.login")} / {t("common.register")}
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <CartDrawer />
    </>
  );
}
