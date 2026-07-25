"use client";

import Link from "next/link";
import { Mail, ArrowRight, Instagram, Facebook, Twitter, Youtube } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  const footerLinks = [
    {
      title: t("footer.quickLinks"),
      links: [
        { href: "/shop", label: "Boutique" },
        { href: "/shop?isFeatured=true", label: "Produits Vedettes" },
        { href: "/shop?isNew=true", label: "Nouveautés" },
      ],
    },
    {
      title: t("footer.customerService"),
      links: [
        { href: "/contact", label: t("footer.contact") },
        { href: "/faq", label: t("footer.faq") },
        { href: "/shipping", label: t("footer.shippingPolicy") },
        { href: "/returns", label: t("footer.returnPolicy") },
        { href: "/terms", label: t("footer.termsConditions") },
      ],
    },
  ];

  return (
    <footer className="bg-dark-950 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl flex items-center justify-center">
                <span className="text-white font-black text-lg">M</span>
              </div>
              <span className="text-xl font-black">
                <span className="text-white">MS10</span>
                <span className="text-brand-500">Shop</span>
              </span>
            </Link>
            <p className="text-dark-400 text-sm leading-relaxed">{t("footer.description")}</p>
            <div className="flex items-center gap-3">
              {[Instagram, Facebook, Twitter, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 bg-dark-900 hover:bg-white/10 rounded-xl flex items-center justify-center transition-colors"
                >
                  <Icon size={18} className="text-dark-400" />
                </a>
              ))}
            </div>
          </div>

          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-6">{group.title}</h3>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-dark-400 hover:text-white text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-6">
              {t("footer.newsletter")}
            </h3>
            <p className="text-dark-400 text-sm mb-4">{t("footer.newsletterDesc")}</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder={t("footer.emailPlaceholder")}
                className="flex-1 bg-dark-900 border border-dark-700 rounded-xl px-4 py-3 text-sm text-white placeholder:text-dark-500 focus:outline-none focus:border-brand-500 transition-colors"
              />
              <button className="w-12 bg-brand-600 hover:bg-brand-700 rounded-xl flex items-center justify-center transition-colors shrink-0">
                <ArrowRight size={16} className="text-white" />
              </button>
            </div>
          </div>
        </div>

        <div className="py-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-dark-500 text-sm">{t("footer.copyright")}</p>
          <div className="flex items-center gap-4 text-dark-600 text-xs">
            <span>Paiement sécurisé</span>
            <span>|</span>
            <span>Livraison rapide</span>
            <span>|</span>
            <span>Retour gratuit 30 jours</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
