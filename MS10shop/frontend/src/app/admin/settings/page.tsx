"use client";

import { useState, useEffect } from "react";
import { Settings, Save, Shield, Bell, Globe, PenTool } from "lucide-react";
import { settingsAPI } from "@/lib/api";
import toast from "react-hot-toast";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    siteName: "MS10Shop",
    siteDescription: "Premium Sports Jerseys & Kits",
    currency: "MAD",
    freeShippingThreshold: "500",
    shippingCost: "30",
    contactEmail: "support@ms10shop.com",
    contactPhone: "+212 6XX XXX XXX",
  });
  const [customization, setCustomization] = useState({
    enabled: true,
    price: 50,
    label: "Impression nom & numéro",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await settingsAPI.getSettings();
        if (data.settings.customization_enabled !== undefined) {
          setCustomization({
            enabled: data.settings.customization_enabled,
            price: data.settings.customization_price || 50,
            label: data.settings.customization_label || "Impression nom & numéro",
          });
        }
      } catch {}
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      await settingsAPI.updateSettings({
        customization_enabled: customization.enabled,
        customization_price: customization.price,
        customization_label: customization.label,
      });
      toast.success("Paramètres sauvegardés");
    } catch {
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Paramètres</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-dark-900 rounded-2xl border border-white/5 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Globe size={20} className="text-brand-400" />
              <h2 className="text-lg font-bold text-white">Général</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-1.5">Nom du site</label>
                <input type="text" value={settings.siteName} onChange={(e) => setSettings((p) => ({ ...p, siteName: e.target.value }))} className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-1.5">Description</label>
                <textarea value={settings.siteDescription} onChange={(e) => setSettings((p) => ({ ...p, siteDescription: e.target.value }))} rows={2} className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-500 resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-1.5">Devise</label>
                <select value={settings.currency} onChange={(e) => setSettings((p) => ({ ...p, currency: e.target.value }))} className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-500 appearance-none">
                  <option value="MAD">MAD - Dirham Marocain</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="USD">USD - Dollar</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-dark-900 rounded-2xl border border-white/5 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Bell size={20} className="text-brand-400" />
              <h2 className="text-lg font-bold text-white">Livraison</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-1.5">Seuil livraison gratuite (MAD)</label>
                <input type="number" value={settings.freeShippingThreshold} onChange={(e) => setSettings((p) => ({ ...p, freeShippingThreshold: e.target.value }))} className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-1.5">Frais de livraison (MAD)</label>
                <input type="number" value={settings.shippingCost} onChange={(e) => setSettings((p) => ({ ...p, shippingCost: e.target.value }))} className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-500" />
              </div>
            </div>
          </div>

          <div className="bg-dark-900 rounded-2xl border border-white/5 p-6">
            <div className="flex items-center gap-3 mb-6">
              <PenTool size={20} className="text-brand-400" />
              <h2 className="text-lg font-bold text-white">Personnalisation</h2>
            </div>
            <p className="text-sm text-dark-400 mb-4">Permettre aux clients d&apos;ajouter un nom et numéro personnalisés sur les maillots.</p>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-dark-800 rounded-xl">
                <div>
                  <p className="text-sm font-medium text-white">Impression nom & numéro</p>
                  <p className="text-xs text-dark-400 mt-0.5">Activer / désactiver la personnalisation</p>
                </div>
                <button
                  onClick={() => setCustomization((p) => ({ ...p, enabled: !p.enabled }))}
                  className={cn(
                    "relative w-12 h-6 rounded-full transition-colors",
                    customization.enabled ? "bg-brand-600" : "bg-dark-600"
                  )}
                >
                  <span className={cn(
                    "absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform",
                    customization.enabled ? "left-6" : "left-0.5"
                  )} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-1.5">Prix de la personnalisation (MAD)</label>
                  <input
                    type="number"
                    min="0"
                    value={customization.price}
                    onChange={(e) => setCustomization((p) => ({ ...p, price: parseInt(e.target.value) || 0 }))}
                    className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-1.5">Libellé affiché</label>
                  <input
                    type="text"
                    value={customization.label}
                    onChange={(e) => setCustomization((p) => ({ ...p, label: e.target.value }))}
                    className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-dark-900 rounded-2xl border border-white/5 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Shield size={20} className="text-brand-400" />
              <h2 className="text-lg font-bold text-white">Contact</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-1.5">Email</label>
                <input type="email" value={settings.contactEmail} onChange={(e) => setSettings((p) => ({ ...p, contactEmail: e.target.value }))} className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-1.5">Téléphone</label>
                <input type="tel" value={settings.contactPhone} onChange={(e) => setSettings((p) => ({ ...p, contactPhone: e.target.value }))} className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-500" />
              </div>
            </div>
          </div>

          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 disabled:bg-dark-700 text-white rounded-xl text-sm font-semibold transition-colors">
            <Save size={16} /> {saving ? "Enregistrement..." : "Enregistrer les paramètres"}
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-dark-900 rounded-2xl border border-white/5 p-6">
            <h3 className="text-sm font-bold text-white mb-4">Informations système</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-dark-400">Version</span><span className="text-white">1.0.0</span></div>
              <div className="flex justify-between"><span className="text-dark-400">Framework</span><span className="text-white">Next.js 15</span></div>
              <div className="flex justify-between"><span className="text-dark-400">Backend</span><span className="text-white">Express + Prisma</span></div>
              <div className="flex justify-between"><span className="text-dark-400">Base de données</span><span className="text-white">PostgreSQL</span></div>
            </div>
          </div>

          <div className="bg-dark-900 rounded-2xl border border-white/5 p-6">
            <h3 className="text-sm font-bold text-white mb-4">Personnalisation</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-dark-800 rounded-xl">
                <span className="text-sm text-dark-300">Statut</span>
                <span className={`px-2 py-0.5 text-xs rounded-full font-semibold ${customization.enabled ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                  {customization.enabled ? "Actif" : "Inactif"}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-dark-800 rounded-xl">
                <span className="text-sm text-dark-300">Prix</span>
                <span className="text-sm font-bold text-white">{customization.price} MAD</span>
              </div>
            </div>
          </div>

          <div className="bg-dark-900 rounded-2xl border border-white/5 p-6">
            <h3 className="text-sm font-bold text-white mb-4">Paiement</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-dark-800 rounded-xl">
                <span className="text-sm text-dark-300">Cash on Delivery</span>
                <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full font-semibold">Actif</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-dark-800 rounded-xl">
                <span className="text-sm text-dark-300">Carte de crédit</span>
                <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded-full font-semibold">Bientôt</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
