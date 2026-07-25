"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingBag } from "lucide-react";
import { wishlistAPI } from "@/lib/api";
import { WishlistItem } from "@/types";
import ProductCard from "@/components/product/ProductCard";
import { useAuthStore } from "@/store/authStore";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const { data } = await wishlistAPI.getWishlist();
        setWishlist(data.wishlist);
      } catch {} finally { setIsLoading(false); }
    };
    if (isAuthenticated) fetchWishlist();
    else setIsLoading(false);
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <Heart size={48} className="mx-auto text-dark-600 mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Connexion requise</h2>
          <Link href="/login" className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-semibold transition-colors inline-block mt-4">Se connecter</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-white mb-8">Mes Favoris ({wishlist.length})</h1>
        {wishlist.length === 0 ? (
          <div className="text-center py-20">
            <Heart size={64} className="mx-auto text-dark-700 mb-6" />
            <h2 className="text-xl font-bold text-white mb-2">Aucun favori</h2>
            <p className="text-dark-400 mb-8">Ajoutez des produits à vos favoris pour les retrouver ici</p>
            <Link href="/shop" className="inline-flex items-center gap-2 px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-semibold"><ShoppingBag size={18} /> Parcourir la boutique</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {wishlist.map((item, i) => (
              <ProductCard key={item.id} product={item.product} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
