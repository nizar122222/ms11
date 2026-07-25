import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number | undefined | null, currency: string = "MAD"): string {
  const value = typeof price === "number" && !isNaN(price) ? price : 0;
  return new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(value);
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function truncate(str: string, length: number): string {
  return str.length > length ? str.substring(0, length) + "..." : str;
}

export function generateOrderNumber(): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const random = Math.floor(1000 + Math.random() * 9000);
  return `MS10-${year}${month}-${random}`;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    PENDING: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    CONFIRMED: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    PREPARING: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    SHIPPING: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    DELIVERED: "bg-green-500/20 text-green-400 border-green-500/30",
    CANCELLED: "bg-red-500/20 text-red-400 border-red-500/30",
  };
  return colors[status] || "bg-dark-500/20 text-dark-400";
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    PENDING: "En attente",
    CONFIRMED: "Confirmée",
    PREPARING: "Préparation",
    SHIPPING: "En livraison",
    DELIVERED: "Livrée",
    CANCELLED: "Annulée",
  };
  return labels[status] || status;
}

export function debounce<T extends (...args: any[]) => any>(fn: T, ms: number) {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}
