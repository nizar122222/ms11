"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingCart, Star, Eye } from "lucide-react";
import { Product } from "@/types";
import { formatPrice, cn } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import { useCartStore } from "@/store/cartStore";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addToCart } = useCartStore();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const defaultSize = product.sizes?.find((s) => s.stock > 0)?.size || "M";
    try {
      await addToCart(product.id, defaultSize, 1);
    } catch {}
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const discount = product.comparePrice && product.price
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link href={`/product/${product.slug}`}>
        <div
          className="group relative bg-dark-900 rounded-2xl overflow-hidden border border-white/5 hover:border-white/10 transition-all duration-500 hover:shadow-2xl hover:shadow-black/50"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="relative aspect-square overflow-hidden bg-dark-800">
            {product.images?.[0] && (
              <img
                src={product.images[0].url}
                alt={product.name}
                className={cn(
                  "w-full h-full object-cover transition-transform duration-700",
                  isHovered ? "scale-110" : "scale-100"
                )}
              />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {product.isOnSale && <Badge variant="sale">-{discount}%</Badge>}
              {product.isNewArrival && <Badge variant="new">Nouveau</Badge>}
              {product.isBestSeller && <Badge variant="hot">Best-seller</Badge>}
            </div>

            <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
              <button
                onClick={handleWishlist}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                  isWishlisted
                    ? "bg-red-500 text-white"
                    : "bg-white/10 backdrop-blur-sm text-white hover:bg-white/20"
                )}
              >
                <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} />
              </button>
              <button
                onClick={handleAddToCart}
                className="w-10 h-10 bg-brand-600 hover:bg-brand-700 text-white rounded-full flex items-center justify-center transition-all duration-300"
              >
                <ShoppingCart size={16} />
              </button>
              <Link
                href={`/product/${product.slug}`}
                className="w-10 h-10 bg-white/10 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300"
                onClick={(e) => e.stopPropagation()}
              >
                <Eye size={16} />
              </Link>
            </div>

            {product.stock <= 5 && product.stock > 0 && (
              <div className="absolute bottom-3 left-3">
                <Badge variant="default">Stock limité ({product.stock})</Badge>
              </div>
            )}
            {product.stock === 0 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white font-bold text-lg">Rupture de stock</span>
              </div>
            )}
          </div>

          <div className="p-4 space-y-2">
            {product.team && (
              <p className="text-xs text-dark-400 font-medium uppercase tracking-wider">
                {product.team.name}
              </p>
            )}
            <h3 className="text-sm font-semibold text-white group-hover:text-brand-400 transition-colors line-clamp-2">
              {product.name}
            </h3>
            <p className="text-xs text-dark-500">{product.category?.name}</p>

            {product.reviewCount && product.reviewCount > 0 && (
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    className={cn(
                      i < Math.round(product.avgRating || 0)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-dark-600"
                    )}
                  />
                ))}
                <span className="text-xs text-dark-400 ml-1">({product.reviewCount})</span>
              </div>
            )}

            <div className="flex items-center gap-2 pt-1">
              <span className="text-lg font-bold text-white">
                {formatPrice(product.salePrice || product.price)}
              </span>
              {product.isOnSale && product.comparePrice && (
                <span className="text-sm text-dark-500 line-through">
                  {formatPrice(product.comparePrice)}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
