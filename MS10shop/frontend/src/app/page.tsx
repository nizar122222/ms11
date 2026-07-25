"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Truck, Shield, CreditCard, Headphones, ArrowRight, Star,
  ChevronRight, Zap, Trophy, Shirt, ShoppingBag
} from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import { productAPI, teamAPI } from "@/lib/api";
import { Product, Team } from "@/types";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatPrice } from "@/lib/utils";

const features = [
  { icon: Truck, title: "Livraison Rapide", desc: "Gratuite dès 500 MAD", color: "from-blue-500 to-blue-700" },
  { icon: Shield, title: "Qualité Premium", desc: "Articles officiels 100%", color: "from-green-500 to-green-700" },
  { icon: CreditCard, title: "Paiement Sécurisé", desc: "CB & Cash on Delivery", color: "from-purple-500 to-purple-700" },
  { icon: Headphones, title: "Support 24/7", desc: "Service client dédié", color: "from-orange-500 to-orange-700" },
];

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [topTeams, setTopTeams] = useState<Team[]>([]);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [feat, newer, best, teams] = await Promise.all([
          productAPI.getProducts({ isFeatured: true, limit: 8 }),
          productAPI.getProducts({ isNew: true, limit: 8 }),
          productAPI.getProducts({ isBestSeller: true, limit: 8 }),
          teamAPI.getTeams({ limit: 20 }),
        ]);
        setFeaturedProducts(feat.data.products);
        setNewProducts(newer.data.products);
        setBestSellers(best.data.products);
        setTopTeams(teams.data.teams);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-20 left-20 w-72 h-72 bg-brand-500/20 rounded-full blur-[128px] animate-float" />
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-brand-700/15 rounded-full blur-[128px] animate-float" style={{ animationDelay: "3s" }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-600/10 rounded-full blur-[200px]" />
          </div>
          <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-[0.03]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-500/10 border border-brand-500/20 rounded-full mb-8"
            >
              <Zap size={14} className="text-brand-400" />
              <span className="text-sm text-brand-400 font-medium">Collection 2024/2025 disponible</span>
            </motion.div>

            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight mb-6 leading-[0.95]">
              <span className="text-white">L&apos;élégance</span>
              <br />
              <span className="bg-gradient-to-r from-brand-400 via-brand-500 to-brand-600 bg-clip-text text-transparent">
                du sport
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-dark-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              {t("home.heroSubtitle")}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/shop"
                className="group flex items-center gap-2 px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-lg hover:shadow-brand-600/25"
              >
                <ShoppingBag size={20} />
                {t("home.shopNow")}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/shop?isFeatured=true"
                className="flex items-center gap-2 px-8 py-4 border border-white/20 hover:border-white/40 hover:bg-white/5 text-white rounded-xl font-semibold text-lg transition-all duration-300"
              >
                <Trophy size={20} />
                Produits Vedettes
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-16 flex items-center justify-center gap-8 text-dark-500 text-sm"
          >
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-dark-700 border-2 border-dark-950 flex items-center justify-center text-xs font-bold text-dark-400">
                    {["RM", "FC", "MU", "PSG"][i - 1]}
                  </div>
                ))}
              </div>
              <span>+1000 équipes</span>
            </div>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
              ))}
              <span className="ml-1">4.9/5</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-6 bg-dark-900 rounded-2xl border border-white/5 hover:border-white/10 transition-all duration-500"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon size={22} className="text-white" />
                </div>
                <h3 className="text-white font-bold text-sm mb-1">{feature.title}</h3>
                <p className="text-dark-400 text-xs">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Football Shirts</h2>
                <p className="text-dark-400">Maillots officiels des meilleurs clubs et sélections</p>
              </div>
              <Link
                href="/shop"
                className="flex items-center gap-1 text-brand-400 hover:text-brand-300 text-sm font-medium transition-colors"
              >
                {t("common.viewAll")} <ChevronRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
              {topTeams.slice(0, 8).map((team, i) => (
                <motion.div
                  key={team.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={`/shop?team=${team.slug}`}
                    className="block group p-6 bg-dark-900 rounded-2xl border border-white/5 hover:border-brand-500/30 transition-all duration-500 text-center"
                  >
                    <div className="w-14 h-14 mx-auto mb-3 bg-brand-500/10 rounded-xl flex items-center justify-center group-hover:bg-brand-500/20 transition-colors overflow-hidden">
                      {team.logo ? (
                        <img src={team.logo} alt={team.name} className="w-full h-full object-cover" />
                      ) : (
                        <Shirt size={24} className="text-brand-400" />
                      )}
                    </div>
                    <h3 className="text-sm font-semibold text-white group-hover:text-brand-400 transition-colors">
                      {team.name}
                    </h3>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-20 bg-dark-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">{t("home.featuredProducts")}</h2>
                <p className="text-dark-400">Les coups de cœur de nos clients</p>
              </div>
              <Link
                href="/shop?isFeatured=true"
                className="flex items-center gap-1 text-brand-400 hover:text-brand-300 text-sm font-medium transition-colors"
              >
                {t("common.viewAll")} <ChevronRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {featuredProducts.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Popular Teams */}
      {topTeams.length > 0 && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-2">{t("home.popularTeams")}</h2>
              <p className="text-dark-400">Retrouvez les maillots de vos équipes préférées</p>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-10 gap-3">
              {topTeams.slice(0, 20).map((team, i) => (
                <motion.div
                  key={team.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.03 }}
                >
                  <Link
                    href={`/shop?team=${team.slug}`}
                    className="flex flex-col items-center gap-2 p-3 bg-dark-900 rounded-xl border border-white/5 hover:border-brand-500/30 transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 bg-dark-800 rounded-full flex items-center justify-center group-hover:bg-brand-500/10 transition-colors overflow-hidden">
                      {team.logo ? (
                        <img src={team.logo} alt={team.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs font-bold text-dark-400 group-hover:text-brand-400 transition-colors">
                          {team.name.substring(0, 2).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-dark-400 text-center leading-tight group-hover:text-white transition-colors line-clamp-2">
                      {team.name}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* New Arrivals */}
      {newProducts.length > 0 && (
        <section className="py-20 bg-dark-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">{t("home.newArrivals")}</h2>
                <p className="text-dark-400">Les dernières sorties fraîchement arrivées</p>
              </div>
              <Link
                href="/shop?isNew=true"
                className="flex items-center gap-1 text-brand-400 hover:text-brand-300 text-sm font-medium transition-colors"
              >
                {t("common.viewAll")} <ChevronRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {newProducts.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Best Sellers */}
      {bestSellers.length > 0 && (
        <section className="py-20 bg-dark-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">{t("home.bestSellers")}</h2>
                <p className="text-dark-400">Les produits les plus plébiscités</p>
              </div>
              <Link
                href="/shop?isBestSeller=true"
                className="flex items-center gap-1 text-brand-400 hover:text-brand-300 text-sm font-medium transition-colors"
              >
                {t("common.viewAll")} <ChevronRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {bestSellers.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 p-12 lg:p-16">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px]" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-[120px]" />
            </div>
            <div className="relative text-center">
              <h2 className="text-3xl lg:text-5xl font-black text-white mb-4">
                Rejoignez l&apos;élite sportive
              </h2>
              <p className="text-white/70 text-lg max-w-xl mx-auto mb-8">
                Plus de 1000 clubs et sélections nationales. Trouvez le maillot parfait pour montrer votre passion.
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-brand-700 rounded-xl font-bold text-lg hover:bg-white/90 transition-all duration-300"
              >
                Explorer la collection
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
