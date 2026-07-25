"use client";

import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "sale" | "new" | "hot" | "default";
  className?: string;
}

export default function Badge({ children, variant = "default", className }: BadgeProps) {
  const variants = {
    sale: "bg-red-500/20 text-red-400 border-red-500/30",
    new: "bg-green-500/20 text-green-400 border-green-500/30",
    hot: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    default: "bg-dark-700/50 text-dark-300 border-dark-600/30",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
