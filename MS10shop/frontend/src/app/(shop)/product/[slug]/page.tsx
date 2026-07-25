"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShoppingCart, Heart, Star, Minus, Plus, Truck, Shield, RotateCcw,
  ChevronRight, Check, PenTool, X
} from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import { productAPI, settingsAPI } from "@/lib/api";
import { Product, Review } from "@/types";
import { useCartStore } from "@/store/cartStore";
import { formatPrice, cn } from "@/lib/utils";
import Badge from "@/components/ui/Badge";

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "reviews">("description");
  const [enableCustomization, setEnableCustomization] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customNumber, setCustomNumber] = useState("");
  const [customizationPrice, setCustomizationPrice] = useState(50);
  const [customizationEnabled, setCustomizationEnabled] = useState(true);
  const { addToCart } = useCartStore();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await productAPI.getProduct(params.slug as string);
        setProduct(data.product);
        setRelatedProducts(data.relatedProducts || []);
        if (data.product.sizes?.length) {
          const available = data.product.sizes.find((s: any) => s.stock > 0);
          if (available) setSelectedSize(available.size);
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
      }
    };
    const fetchSettings = async () => {
      try {
        const { data } = await settingsAPI.getCustomizationSettings();
        setCustomizationEnabled(data.enabled);
        setCustomizationPrice(data.price);
      } catch {}
    };
    if (params.slug) {
      fetchProduct();
      fetchSettings();
    }
  }, [params.slug]);

  const handleAddToCart = async () => {
    if (!product || !selectedSize) return;
    try {
      const customData: any = {};
      if (enableCustomization && customName) {
        customData.customName = customName;
        customData.customNumber = customNumber ? parseInt(customNumber) : null;
        customData.customizationPrice = customizationPrice;
      }
      await addToCart(product.id, selectedSize, quantity, customData);
    } catch {}
  };

  if (!product) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const currentPrice = product.salePrice || product.price;
  const discount = product.comparePrice && product.price
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-sm text-dark-400 mb-8">
          <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
          <ChevronRight size={14} />
          <Link href="/shop" className="hover:text-white transition-colors">Boutique</Link>
          <ChevronRight size={14} />
          {product.category && (
            <>
              <Link href={`/shop?category=${product.category.slug}`} className="hover:text-white transition-colors">
                {product.category.name}
              </Link>
              <ChevronRight size={14} />
            </>
          )}
          <span className="text-white truncate">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-dark-900 mb-4">
              {product.images[selectedImage] && (
                <img
                  src={product.images[selectedImage].url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isOnSale && <Badge variant="sale">-{discount}%</Badge>}
                {product.isNewArrival && <Badge variant="new">Nouveau</Badge>}
                {product.isBestSeller && <Badge variant="hot">Best-seller</Badge>}
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(i)}
                  className={cn(
                    "aspect-square rounded-xl overflow-hidden border-2 transition-all",
                    selectedImage === i ? "border-brand-500" : "border-transparent hover:border-white/20"
                  )}
                >
                  <img src={img.url} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            {product.team && (
              <p className="text-sm text-brand-400 font-medium uppercase tracking-wider">{product.team.name}</p>
            )}
            <h1 className="text-3xl lg:text-4xl font-bold text-white">{product.name}</h1>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={cn(
                      i < Math.round(product.avgRating || 0) ? "text-yellow-400 fill-yellow-400" : "text-dark-600"
                    )}
                  />
                ))}
              </div>
              <span className="text-sm text-dark-400">({product.reviewCount || 0} avis)</span>
              <span className="text-sm text-dark-500">|</span>
              <span className="text-sm text-dark-400">{product.soldCount} vendus</span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-white">{formatPrice(currentPrice)}</span>
              {product.isOnSale && product.comparePrice && (
                <span className="text-lg text-dark-500 line-through">{formatPrice(product.comparePrice)}</span>
              )}
              {enableCustomization && customName && (
                <span className="text-sm text-brand-400">+ {formatPrice(customizationPrice)}</span>
              )}
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-white">Taille</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => size.stock > 0 && setSelectedSize(size.size)}
                    disabled={size.stock === 0}
                    className={cn(
                      "min-w-[52px] px-4 py-2.5 rounded-xl text-sm font-medium border transition-all",
                      selectedSize === size.size
                        ? "bg-brand-600 border-brand-500 text-white"
                        : size.stock === 0
                        ? "border-dark-700 text-dark-600 cursor-not-allowed line-through"
                        : "border-white/10 text-dark-300 hover:border-white/20 hover:text-white"
                    )}
                  >
                    {size.size}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-white">Quantité</p>
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-dark-900 border border-white/10 rounded-xl">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-white/5 rounded-l-xl transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-6 py-3 font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-white/5 rounded-r-xl transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <span className="text-sm text-dark-400">
                  {product.stock > 0 ? `${product.stock} en stock` : "Rupture de stock"}
                </span>
              </div>
            </div>

            {customizationEnabled && (
              <div className="space-y-3 p-4 bg-dark-800/50 rounded-2xl border border-white/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <PenTool size={16} className="text-brand-400" />
                    <p className="text-sm font-medium text-white">Personnalisation</p>
                  </div>
                  <span className="text-xs text-brand-400 font-medium">+{formatPrice(customizationPrice)}</span>
                </div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enableCustomization}
                    onChange={(e) => {
                      setEnableCustomization(e.target.checked);
                      if (!e.target.checked) { setCustomName(""); setCustomNumber(""); }
                    }}
                    className="w-4 h-4 rounded border-dark-600 text-brand-600 focus:ring-brand-500"
                  />
                  <span className="text-sm text-dark-300">Ajouter un nom et numéro personnalisés</span>
                </label>
                {enableCustomization && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-3">
                    <div>
                      <label className="block text-xs text-dark-400 mb-1">Nom du joueur</label>
                      <input
                        type="text"
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        maxLength={20}
                        placeholder="Ex: Ronaldo"
                        className="w-full bg-dark-900 border border-dark-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-dark-500 focus:outline-none focus:border-brand-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-dark-400 mb-1">Numéro (1-99)</label>
                      <input
                        type="number"
                        min="1"
                        max="99"
                        value={customNumber}
                        onChange={(e) => setCustomNumber(e.target.value)}
                        placeholder="Ex: 7"
                        className="w-full bg-dark-900 border border-dark-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-dark-500 focus:outline-none focus:border-brand-500"
                      />
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={!selectedSize || product.stock === 0}
                className="flex-1 flex items-center justify-center gap-2 py-4 bg-brand-600 hover:bg-brand-700 disabled:bg-dark-700 disabled:text-dark-500 text-white rounded-xl font-semibold transition-all duration-300"
              >
                <ShoppingCart size={20} />
                Ajouter au panier
              </button>
              <button className="p-4 border border-white/10 hover:border-red-500/30 hover:bg-red-500/5 rounded-xl transition-all">
                <Heart size={20} className="text-dark-400 hover:text-red-400" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2 text-sm text-dark-400">
                <Truck size={16} className="text-brand-400 shrink-0" />
                <span>Livraison gratuite &gt;500 MAD</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-dark-400">
                <Shield size={16} className="text-brand-400 shrink-0" />
                <span>Produit officiel</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-dark-400">
                <RotateCcw size={16} className="text-brand-400 shrink-0" />
                <span>Retour 30 jours</span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-16">
          <div className="flex gap-4 border-b border-white/10 mb-8">
            {(["description", "reviews"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "pb-4 text-sm font-medium border-b-2 transition-all",
                  activeTab === tab ? "border-brand-500 text-white" : "border-transparent text-dark-400 hover:text-white"
                )}
              >
                {tab === "description" ? "Description" : `Avis (${product.reviewCount || 0})`}
              </button>
            ))}
          </div>

          {activeTab === "description" ? (
            <div className="max-w-3xl">
              <p className="text-dark-300 leading-relaxed whitespace-pre-line">{product.description}</p>
            </div>
          ) : (
            <div className="max-w-3xl space-y-6">
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((review: any) => (
                  <div key={review.id} className="p-6 bg-dark-900 rounded-2xl border border-white/5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-brand-500/20 rounded-full flex items-center justify-center">
                          <span className="text-brand-400 text-sm font-bold">
                            {review.user.firstName[0]}{review.user.lastName[0]}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">
                            {review.user.firstName} {review.user.lastName}
                          </p>
                          <div className="flex items-center gap-1 mt-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                size={12}
                                className={cn(i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-dark-600")}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      {review.isVerified && <Badge variant="new">Vérifié</Badge>}
                    </div>
                    {review.title && <h4 className="text-sm font-semibold text-white mb-1">{review.title}</h4>}
                    <p className="text-sm text-dark-300">{review.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-dark-400 text-center py-8">Aucun avis pour ce produit.</p>
              )}
            </div>
          )}
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-bold text-white mb-8">Vous aimerez aussi</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {relatedProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
