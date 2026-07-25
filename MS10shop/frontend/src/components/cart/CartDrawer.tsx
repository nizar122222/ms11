"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";

export default function CartDrawer() {
  const { cart, total, isOpen, closeCart, updateQuantity, removeItem } = useCartStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            onClick={closeCart}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-dark-950 border-l border-white/10 z-[70] flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} className="text-brand-400" />
                <h2 className="text-lg font-bold text-white">
                  Panier ({cart?.items?.length || 0})
                </h2>
              </div>
              <button
                onClick={closeCart}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors"
              >
                <X size={20} className="text-dark-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {!cart?.items || cart.items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag size={48} className="text-dark-700 mb-4" />
                  <p className="text-dark-400 text-lg font-medium mb-2">Votre panier est vide</p>
                  <p className="text-dark-600 text-sm mb-6">Ajoutez des produits pour commencer</p>
                  <button
                    onClick={closeCart}
                    className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-semibold transition-colors"
                  >
                    Continuer vos achats
                  </button>
                </div>
              ) : (
                cart.items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex gap-4 p-4 bg-dark-900 rounded-xl border border-white/5"
                  >
                    <div className="w-20 h-20 bg-dark-800 rounded-lg overflow-hidden shrink-0">
                      {item.product.images?.[0] && (
                        <img
                          src={item.product.images[0].url}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-white truncate">{item.product.name}</h3>
                      <p className="text-xs text-dark-400 mt-0.5">{item.product.team?.name}</p>
                      <p className="text-xs text-brand-400 mt-1">Taille: {item.size}</p>
                      {item.customName && (
                        <p className="text-xs text-brand-300 mt-0.5">✏️ {item.customName} #{item.customNumber || "—"}</p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 bg-dark-800 rounded-lg flex items-center justify-center hover:bg-dark-700 transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 bg-dark-800 rounded-lg flex items-center justify-center hover:bg-dark-700 transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-white">
                            {formatPrice(((item.product.salePrice || item.product.price) + (item.customizationPrice || 0)) * item.quantity)}
                          </span>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-1.5 hover:bg-red-500/10 rounded-lg transition-colors"
                          >
                            <Trash2 size={14} className="text-red-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {cart?.items && cart.items.length > 0 && (
              <div className="border-t border-white/10 p-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-dark-400">Sous-total</span>
                    <span className="text-white font-medium">{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-dark-400">Livraison</span>
                    <span className="text-green-400 font-medium">
                      {total >= 500 ? "Gratuite" : formatPrice(30)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-white/10">
                    <span className="text-white font-bold">Total</span>
                    <span className="text-white font-bold text-lg">
                      {formatPrice(total >= 500 ? total : total + 30)}
                    </span>
                  </div>
                </div>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="flex items-center justify-center gap-2 w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-semibold transition-all duration-300"
                >
                  Passer à la caisse
                  <ArrowRight size={16} />
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
