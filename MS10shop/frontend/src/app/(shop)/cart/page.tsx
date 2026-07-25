"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ArrowLeft } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { cart, total, itemCount, fetchCart, updateQuantity, removeItem, isLoading } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) fetchCart();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag size={48} className="mx-auto text-dark-600 mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Connexion requise</h2>
          <p className="text-dark-400 mb-6">Connectez-vous pour accéder à votre panier</p>
          <Link href="/login" className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-semibold transition-colors inline-block">
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  const shippingCost = total >= 500 ? 0 : 30;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-white mb-8">Mon Panier ({itemCount})</h1>

        {!cart?.items || cart.items.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag size={64} className="mx-auto text-dark-700 mb-6" />
            <h2 className="text-xl font-bold text-white mb-2">Votre panier est vide</h2>
            <p className="text-dark-400 mb-8">Découvrez nos produits et ajoutez-les à votre panier</p>
            <Link href="/shop" className="inline-flex items-center gap-2 px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-semibold transition-colors">
              <ShoppingBag size={18} />
              Continuer vos achats
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-4 p-4 bg-dark-900 rounded-2xl border border-white/5"
                >
                  <Link href={`/product/${item.product.slug}`} className="w-24 h-24 bg-dark-800 rounded-xl overflow-hidden shrink-0">
                    {item.product.images?.[0] && (
                      <img src={item.product.images[0].url} alt={item.product.name} className="w-full h-full object-cover" />
                    )}
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link href={`/product/${item.product.slug}`}>
                      <h3 className="text-sm font-semibold text-white hover:text-brand-400 transition-colors truncate">{item.product.name}</h3>
                    </Link>
                    <p className="text-xs text-dark-400 mt-0.5">{item.product.team?.name}</p>
                    <p className="text-xs text-brand-400 mt-1">Taille: {item.size}</p>
                    {item.customName && (
                      <div className="flex items-center gap-2 mt-1.5 px-2 py-1 bg-brand-500/10 rounded-lg inline-flex">
                        <span className="text-xs text-brand-400 font-medium">
                          ✏️ {item.customName} #{item.customNumber || "—"}
                        </span>
                        <span className="text-xs text-dark-400">(+{formatPrice(item.customizationPrice || 0)})</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-3">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 bg-dark-800 rounded-lg flex items-center justify-center hover:bg-dark-700 transition-colors"><Minus size={14} /></button>
                        <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 bg-dark-800 rounded-lg flex items-center justify-center hover:bg-dark-700 transition-colors"><Plus size={14} /></button>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-base font-bold text-white">{formatPrice(((item.product.salePrice || item.product.price) + (item.customizationPrice || 0)) * item.quantity)}</span>
                        <button onClick={() => removeItem(item.id)} className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 size={14} className="text-red-400" /></button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              <Link href="/shop" className="inline-flex items-center gap-2 text-sm text-brand-400 hover:text-brand-300 font-medium mt-4">
                <ArrowLeft size={16} /> Continuer vos achats
              </Link>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-dark-900 rounded-2xl border border-white/5 p-6 sticky top-24 space-y-4">
                <h2 className="text-lg font-bold text-white">Résumé</h2>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-dark-400">Sous-total ({itemCount} articles)</span>
                    <span className="text-white">{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-dark-400">Livraison</span>
                    <span className={shippingCost === 0 ? "text-green-400" : "text-white"}>
                      {shippingCost === 0 ? "Gratuite" : formatPrice(shippingCost)}
                    </span>
                  </div>
                  {total < 500 && (
                    <p className="text-xs text-brand-400">Ajoutez {formatPrice(500 - total)} pour la livraison gratuite</p>
                  )}
                  <div className="flex justify-between pt-3 border-t border-white/10">
                    <span className="text-white font-bold">Total</span>
                    <span className="text-white font-bold text-xl">{formatPrice(total >= 500 ? total : total + shippingCost)}</span>
                  </div>
                </div>
                <Link href="/checkout" className="flex items-center justify-center gap-2 w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-semibold transition-all duration-300">
                  Passer à la caisse
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
