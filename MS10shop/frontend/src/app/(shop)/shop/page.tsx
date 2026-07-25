"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { SlidersHorizontal, X, ChevronDown, ChevronUp, Grid3X3, LayoutGrid } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import { productAPI, teamAPI } from "@/lib/api";
import { Product, Team, Pagination } from "@/types";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

const SIZES = ["S", "M", "L", "XL", "XXL", "3XL"];
const SORT_OPTIONS = [
  { value: "createdAt:desc", label: "Plus récents" },
  { value: "price:asc", label: "Prix croissant" },
  { value: "price:desc", label: "Prix décroissant" },
  { value: "soldCount:desc", label: "Populaires" },
];

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 24, total: 0, pages: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [gridCols, setGridCols] = useState<3 | 4>(4);

  const [filters, setFilters] = useState({
    team: searchParams.get("team") || "",
    size: searchParams.get("size") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    sort: searchParams.get("sort") || "createdAt",
    order: searchParams.get("order") || "desc",
    isNew: searchParams.get("isNew") || "",
    isSale: searchParams.get("isSale") || "",
    isFeatured: searchParams.get("isFeatured") || "",
    isBestSeller: searchParams.get("isBestSeller") || "",
    search: searchParams.get("search") || "",
  });

  const fetchProducts = useCallback(async (page = 1) => {
    try {
      setIsLoading(true);
      const params: any = { page, limit: 24 };
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params[key] = value;
      });
      const { data } = await productAPI.getProducts(params);
      setProducts(data.products);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tms = await teamAPI.getTeams({ limit: 50 });
        setTeams(tms.data.teams);
      } catch {}
    };
    fetchData();
  }, []);

  useEffect(() => {
    fetchProducts(1);
  }, [fetchProducts]);

  const updateFilter = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      team: "", size: "", minPrice: "", maxPrice: "",
      sort: "createdAt", order: "desc", isNew: "", isSale: "",
      isFeatured: "", isBestSeller: "", search: "",
    });
  };

  const activeFilterCount = Object.values(filters).filter(
    (v) => v && v !== "createdAt" && v !== "desc"
  ).length;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">{t("shop.title")}</h1>
          <p className="text-dark-400">
            {pagination.total} {t("shop.productsFound")}
          </p>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all",
                showFilters
                  ? "bg-brand-600/20 border-brand-500/30 text-brand-400"
                  : "bg-dark-900 border-white/10 text-dark-300 hover:border-white/20"
              )}
            >
              <SlidersHorizontal size={16} />
              {t("shop.filters")}
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 bg-brand-600 rounded-full text-white text-xs flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => setGridCols(4)}
                className={cn("p-2 rounded-lg transition-colors", gridCols === 4 ? "bg-white/10 text-white" : "text-dark-500 hover:text-white")}
              >
                <Grid3X3 size={16} />
              </button>
              <button
                onClick={() => setGridCols(3)}
                className={cn("p-2 rounded-lg transition-colors", gridCols === 3 ? "bg-white/10 text-white" : "text-dark-500 hover:text-white")}
              >
                <LayoutGrid size={16} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={`${filters.sort}:${filters.order}`}
              onChange={(e) => {
                const [sort, order] = e.target.value.split(":");
                updateFilter("sort", sort);
                updateFilter("order", order);
              }}
              className="bg-dark-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white appearance-none cursor-pointer focus:outline-none focus:border-brand-500"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-8">
          {showFilters && (
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-64 shrink-0 hidden lg:block"
            >
              <div className="space-y-6 sticky top-24">
                {activeFilterCount > 0 && (
                  <button onClick={clearFilters} className="text-sm text-brand-400 hover:text-brand-300">
                    {t("shop.clearFilters")}
                  </button>
                )}

                <div>
                  <h3 className="text-sm font-semibold text-white mb-3">{t("shop.team")}</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {teams.map((team) => (
                      <button
                        key={team.id}
                        onClick={() => updateFilter("team", filters.team === team.slug ? "" : team.slug)}
                        className={cn(
                          "block w-full text-left text-sm px-3 py-2 rounded-lg transition-colors truncate",
                          filters.team === team.slug ? "bg-brand-500/20 text-brand-400" : "text-dark-400 hover:bg-white/5 hover:text-white"
                        )}
                      >
                        {team.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-white mb-3">{t("shop.size")}</h3>
                  <div className="flex flex-wrap gap-2">
                    {SIZES.map((size) => (
                      <button
                        key={size}
                        onClick={() => updateFilter("size", filters.size === size ? "" : size)}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                          filters.size === size
                            ? "bg-brand-500/20 border-brand-500/30 text-brand-400"
                            : "border-white/10 text-dark-400 hover:border-white/20 hover:text-white"
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-white mb-3">{t("shop.price")}</h3>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={(e) => updateFilter("minPrice", e.target.value)}
                      className="w-full bg-dark-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-dark-500 focus:outline-none focus:border-brand-500"
                    />
                    <span className="text-dark-600">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice}
                      onChange={(e) => updateFilter("maxPrice", e.target.value)}
                      className="w-full bg-dark-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-dark-500 focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-white mb-3">Promotions</h3>
                  <div className="space-y-2">
                    {[
                      { key: "isNew", label: "Nouveautés" },
                      { key: "isSale", label: "En promotion" },
                      { key: "isFeatured", label: "En vedette" },
                      { key: "isBestSeller", label: "Meilleures ventes" },
                    ].map(({ key, label }) => (
                      <button
                        key={key}
                        onClick={() => updateFilter(key, filters[key as keyof typeof filters] === "true" ? "" : "true")}
                        className={cn(
                          "block w-full text-left text-sm px-3 py-2 rounded-lg transition-colors",
                          filters[key as keyof typeof filters] === "true"
                            ? "bg-brand-500/20 text-brand-400"
                            : "text-dark-400 hover:bg-white/5 hover:text-white"
                        )}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.aside>
          )}

          <div className="flex-1">
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {Object.entries(filters).map(([key, value]) => {
                  if (!value || key === "sort" || key === "order") return null;
                  return (
                    <span
                      key={key}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-brand-500/10 border border-brand-500/20 rounded-full text-xs text-brand-400"
                    >
                      {value}
                      <button onClick={() => updateFilter(key, "")}>
                        <X size={12} />
                      </button>
                    </span>
                  );
                })}
              </div>
            )}

            {isLoading ? (
              <div className={cn(
                "grid gap-4 lg:gap-6",
                gridCols === 4 ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-2 md:grid-cols-3"
              )}>
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="bg-dark-900 rounded-2xl overflow-hidden">
                    <div className="aspect-square shimmer" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 w-3/4 shimmer rounded" />
                      <div className="h-3 w-1/2 shimmer rounded" />
                      <div className="h-5 w-1/3 shimmer rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-dark-400 text-lg mb-4">{t("shop.noProducts")}</p>
                <button onClick={clearFilters} className="text-brand-400 hover:text-brand-300 text-sm font-medium">
                  {t("shop.clearFilters")}
                </button>
              </div>
            ) : (
              <>
                <div className={cn(
                  "grid gap-4 lg:gap-6",
                  gridCols === 4 ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-2 md:grid-cols-3"
                )}>
                  {products.map((product, i) => (
                    <ProductCard key={product.id} product={product} index={i} />
                  ))}
                </div>

                {pagination.pages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-12">
                    {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => fetchProducts(page)}
                        className={cn(
                          "w-10 h-10 rounded-xl text-sm font-medium transition-all",
                          page === pagination.page
                            ? "bg-brand-600 text-white"
                            : "bg-dark-900 text-dark-400 hover:bg-white/5 hover:text-white border border-white/5"
                        )}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-24 flex items-center justify-center"><div className="text-dark-400">Chargement...</div></div>}>
      <ShopContent />
    </Suspense>
  );
}
