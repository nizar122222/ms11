"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CreditCard, Banknote, Lock, CheckCircle2, AlertCircle } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { orderAPI } from "@/lib/api";
import { formatPrice, cn } from "@/lib/utils";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, total, clearCart } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"CASH_ON_DELIVERY" | "CREDIT_CARD">("CASH_ON_DELIVERY");
  const [form, setForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phone: "",
    email: user?.email || "",
    address: "",
    city: "",
    postalCode: "",
    country: "Maroc",
    notes: "",
  });

  const updateForm = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const shippingCost = total >= 500 ? 0 : 30;
  const orderTotal = total + shippingCost;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Veuillez vous connecter pour passer commande");
      router.push("/login");
      return;
    }
    if (!cart?.items || cart.items.length === 0) return;

    try {
      setIsProcessing(true);
      const orderItems = cart.items.map((item) => ({
        productId: item.productId,
        size: item.size,
        quantity: item.quantity,
        customName: item.customName || undefined,
        customNumber: item.customNumber || undefined,
        customizationPrice: item.customizationPrice || 0,
      }));

      const { data } = await orderAPI.createOrder({
        ...form,
        paymentMethod,
        items: orderItems,
      });

      setOrderNumber(data.order.orderNumber);
      setOrderSuccess(true);
      await clearCart();
      toast.success("Commande passée avec succès !");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Erreur lors de la commande");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="mx-auto text-dark-600 mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Connexion requise</h2>
          <p className="text-dark-400 mb-6">Veuillez vous connecter pour passer commande</p>
          <button
            onClick={() => router.push("/login")}
            className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-semibold transition-colors"
          >
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} className="text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Commande confirmée !</h2>
          <p className="text-dark-400 mb-4">Merci pour votre commande</p>
          <div className="bg-dark-900 rounded-xl p-4 mb-6 border border-white/10">
            <p className="text-sm text-dark-400">Numéro de commande</p>
            <p className="text-xl font-bold text-brand-400">{orderNumber}</p>
          </div>
          <p className="text-sm text-dark-500 mb-6">
            Vous recevrez un email de confirmation avec les détails de votre commande.
          </p>
          <button
            onClick={() => router.push("/shop")}
            className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-semibold transition-colors"
          >
            Continuer vos achats
          </button>
        </motion.div>
      </div>
    );
  }

  if (!cart?.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-white mb-2">Panier vide</h2>
          <p className="text-dark-400 mb-6">Ajoutez des produits avant de passer commande</p>
          <button
            onClick={() => router.push("/shop")}
            className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-semibold transition-colors"
          >
            Aller à la boutique
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-white mb-8">Passer à la caisse</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-dark-900 rounded-2xl border border-white/5 p-6">
                <h2 className="text-lg font-bold text-white mb-6">Informations de livraison</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { key: "firstName", label: "Prénom", required: true },
                    { key: "lastName", label: "Nom", required: true },
                    { key: "phone", label: "Téléphone", required: true, type: "tel" },
                    { key: "email", label: "Email", required: true, type: "email" },
                    { key: "address", label: "Adresse", required: true, colSpan: true },
                    { key: "city", label: "Ville", required: true },
                    { key: "postalCode", label: "Code postal", required: true },
                    { key: "country", label: "Pays", required: true },
                  ].map((field) => (
                    <div key={field.key} className={cn(field.colSpan && "sm:col-span-2")}>
                      <label className="block text-sm font-medium text-dark-300 mb-1.5">
                        {field.label} {field.required && <span className="text-red-400">*</span>}
                      </label>
                      <input
                        type={field.type || "text"}
                        required={field.required}
                        value={(form as any)[field.key]}
                        onChange={(e) => updateForm(field.key, e.target.value)}
                        className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white placeholder:text-dark-500 focus:outline-none focus:border-brand-500 transition-colors"
                      />
                    </div>
                  ))}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-dark-300 mb-1.5">
                      Notes (optionnel)
                    </label>
                    <textarea
                      value={form.notes}
                      onChange={(e) => updateForm("notes", e.target.value)}
                      rows={3}
                      placeholder="Instructions spéciales pour la livraison..."
                      className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white placeholder:text-dark-500 focus:outline-none focus:border-brand-500 transition-colors resize-none"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-dark-900 rounded-2xl border border-white/5 p-6">
                <h2 className="text-lg font-bold text-white mb-6">Méthode de paiement</h2>
                <div className="space-y-3">
                  <label
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all",
                      paymentMethod === "CASH_ON_DELIVERY"
                        ? "border-brand-500 bg-brand-500/10"
                        : "border-white/10 hover:border-white/20"
                    )}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="CASH_ON_DELIVERY"
                      checked={paymentMethod === "CASH_ON_DELIVERY"}
                      onChange={() => setPaymentMethod("CASH_ON_DELIVERY")}
                      className="sr-only"
                    />
                    <div className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                      paymentMethod === "CASH_ON_DELIVERY" ? "border-brand-500" : "border-dark-600"
                    )}>
                      {paymentMethod === "CASH_ON_DELIVERY" && <div className="w-2.5 h-2.5 bg-brand-500 rounded-full" />}
                    </div>
                    <Banknote size={20} className="text-green-400" />
                    <div>
                      <p className="text-sm font-semibold text-white">Paiement à la livraison</p>
                      <p className="text-xs text-dark-400">Payez en espèces à la réception</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-4 p-4 rounded-xl border border-white/10 cursor-not-allowed opacity-60">
                    <input type="radio" name="payment" disabled className="sr-only" />
                    <div className="w-5 h-5 rounded-full border-2 border-dark-600" />
                    <CreditCard size={20} className="text-dark-500" />
                    <div>
                      <p className="text-sm font-semibold text-dark-400">Carte de crédit</p>
                      <p className="text-xs text-dark-500">Bientôt disponible</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-dark-900 rounded-2xl border border-white/5 p-6 sticky top-24">
                <h2 className="text-lg font-bold text-white mb-6">Résumé de la commande</h2>
                <div className="space-y-4 mb-6">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-14 h-14 bg-dark-800 rounded-lg overflow-hidden shrink-0">
                        {item.product.images?.[0] && (
                          <img
                            src={item.product.images[0].url}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-white truncate">{item.product.name}</p>
                        <p className="text-xs text-dark-400">Taille: {item.size} × {item.quantity}</p>
                        {item.customName && (
                          <p className="text-xs text-brand-400">✏️ {item.customName} #{item.customNumber || "—"} (+{formatPrice(item.customizationPrice || 0)})</p>
                        )}
                      </div>
                      <span className="text-xs font-semibold text-white">
                        {formatPrice(((item.product.salePrice || item.product.price) + (item.customizationPrice || 0)) * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 pt-4 border-t border-white/10">
                  <div className="flex justify-between text-sm">
                    <span className="text-dark-400">Sous-total</span>
                    <span className="text-white">{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-dark-400">Livraison</span>
                    <span className={cn(shippingCost === 0 ? "text-green-400" : "text-white")}>
                      {shippingCost === 0 ? "Gratuite" : formatPrice(shippingCost)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-white/10">
                    <span className="text-white font-bold">Total</span>
                    <span className="text-white font-bold text-xl">{formatPrice(orderTotal)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full mt-6 py-4 bg-brand-600 hover:bg-brand-700 disabled:bg-dark-700 text-white rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Traitement en cours...
                    </>
                  ) : (
                    <>
                      <Lock size={18} />
                      Passer la commande
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
