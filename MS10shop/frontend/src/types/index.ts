export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: "CUSTOMER" | "ADMIN";
  avatar?: string;
  createdAt?: string;
}

export interface ProductImage {
  id: string;
  url: string;
  alt?: string;
  sortOrder: number;
  isPrimary: boolean;
}

export interface ProductSize {
  id: string;
  size: string;
  stock: number;
  isActive: boolean;
}

export interface Category {
  id: string;
  name: string;
  nameAr?: string;
  nameEn?: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  sortOrder?: number;
  isActive?: boolean;
  children?: Category[];
  _count?: { products: number };
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  description?: string;
}

export interface Team {
  id: string;
  name: string;
  nameAr?: string;
  nameEn?: string;
  slug: string;
  logo?: string;
  country?: string;
  countryAr?: string;
  league?: string;
  leagueAr?: string;
  confederation?: string;
  confederationAr?: string;
  stadium?: string;
  stadiumAr?: string;
  founded?: string;
  history?: string;
  historyAr?: string;
  website?: string;
  type: "CLUB" | "NATIONAL";
  _count?: { products: number };
}

export interface Product {
  id: string;
  name: string;
  nameAr?: string;
  nameEn?: string;
  slug: string;
  description: string;
  descriptionAr?: string;
  descriptionEn?: string;
  price: number;
  comparePrice?: number;
  costPrice?: number;
  sku?: string;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  isOnSale: boolean;
  salePrice?: number;
  soldCount: number;
  viewCount: number;
  tags: string[];
  metaTitle?: string;
  metaDesc?: string;
  categoryId: string;
  brandId?: string;
  teamId?: string;
  category?: Category;
  brand?: Brand;
  team?: Team;
  images: ProductImage[];
  sizes: ProductSize[];
  reviews?: Review[];
  avgRating?: number;
  reviewCount?: number;
  createdAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  size: string;
  quantity: number;
  customName?: string;
  customNumber?: number;
  customizationPrice?: number;
  product: Product;
}

export interface Cart {
  id: string;
  items: CartItem[];
  createdAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage?: string;
  size: string;
  quantity: number;
  price: number;
  total: number;
  customName?: string;
  customNumber?: number;
  customizationPrice?: number;
}

export type OrderStatus = "PENDING" | "CONFIRMED" | "PREPARING" | "SHIPPING" | "DELIVERED" | "CANCELLED";
export type PaymentMethod = "CASH_ON_DELIVERY" | "CREDIT_CARD";

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  notes?: string;
  subtotal: number;
  shippingCost: number;
  tax: number;
  discount: number;
  total: number;
  currency: string;
  items: OrderItem[];
  tracking?: string;
  shippedAt?: string;
  deliveredAt?: string;
  user?: { firstName: string; lastName: string; email: string };
  createdAt: string;
}

export interface Review {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  title?: string;
  comment?: string;
  isVerified: boolean;
  isApproved: boolean;
  user: { firstName: string; lastName: string; avatar?: string };
  createdAt: string;
}

export interface WishlistItem {
  id: string;
  productId: string;
  product: Product;
  createdAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  confirmedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  totalProducts: number;
}
