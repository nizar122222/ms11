import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (data: { email: string; password: string }) => api.post("/auth/login", data),
  register: (data: any) => api.post("/auth/register", data),
  getMe: () => api.get("/auth/me"),
  updateProfile: (data: any) => api.put("/auth/profile", data),
  changePassword: (data: any) => api.put("/auth/change-password", data),
  logout: () => api.post("/auth/logout"),
};

export const productAPI = {
  getProducts: (params?: any) => api.get("/products", { params }),
  getProduct: (slug: string) => api.get(`/products/${slug}`),
  createProduct: (data: any) => api.post("/products", data),
  updateProduct: (id: string, data: any) => api.put(`/products/${id}`, data),
  deleteProduct: (id: string) => api.delete(`/products/${id}`),
};

export const categoryAPI = {
  getCategories: () => api.get("/categories"),
  getCategory: (slug: string) => api.get(`/categories/${slug}`),
  createCategory: (data: any) => api.post("/categories", data),
  updateCategory: (id: string, data: any) => api.put(`/categories/${id}`, data),
  deleteCategory: (id: string) => api.delete(`/categories/${id}`),
};

export const teamAPI = {
  getTeams: (params?: any) => api.get("/teams", { params }),
  getTeam: (slug: string) => api.get(`/teams/${slug}`),
  createTeam: (data: any) => api.post("/teams", data),
  updateTeam: (id: string, data: any) => api.put(`/teams/${id}`, data),
  deleteTeam: (id: string) => api.delete(`/teams/${id}`),
};

export const orderAPI = {
  createOrder: (data: any) => api.post("/orders", data),
  getOrders: (params?: any) => api.get("/orders", { params }),
  getOrder: (id: string) => api.get(`/orders/${id}`),
  updateOrderStatus: (id: string, status: string) => api.put(`/orders/${id}/status`, { status }),
  getOrderStats: () => api.get("/orders/stats"),
};

export const cartAPI = {
  getCart: () => api.get("/cart"),
  addToCart: (data: { productId: string; size: string; quantity: number; customName?: string; customNumber?: number; customizationPrice?: number }) =>
    api.post("/cart/add", data),
  updateCartItem: (itemId: string, quantity: number) =>
    api.put(`/cart/item/${itemId}`, { quantity }),
  removeFromCart: (itemId: string) => api.delete(`/cart/item/${itemId}`),
  clearCart: () => api.delete("/cart/clear"),
};

export const settingsAPI = {
  getSettings: () => api.get("/settings"),
  updateSettings: (settings: Record<string, any>) => api.put("/settings", { settings }),
  getCustomizationSettings: () => api.get("/settings/customization"),
};

export const wishlistAPI = {
  getWishlist: () => api.get("/wishlist"),
  toggleWishlist: (productId: string) => api.post("/wishlist/toggle", { productId }),
};

export const reviewAPI = {
  getReviews: (params?: any) => api.get("/reviews", { params }),
  createReview: (data: any) => api.post("/reviews", data),
  approveReview: (id: string) => api.put(`/reviews/${id}/approve`),
  deleteReview: (id: string) => api.delete(`/reviews/${id}`),
};

export const customerAPI = {
  getCustomers: (params?: any) => api.get("/customers", { params }),
  getCustomer: (id: string) => api.get(`/customers/${id}`),
  toggleCustomerStatus: (id: string) => api.put(`/customers/${id}/toggle-status`),
  getCustomerStats: () => api.get("/customers/stats"),
};

export const brandAPI = {
  getBrands: (params?: any) => api.get("/brands", { params }),
  createBrand: (data: any) => api.post("/brands", data),
  updateBrand: (id: string, data: any) => api.put(`/brands/${id}`, data),
  deleteBrand: (id: string) => api.delete(`/brands/${id}`),
};

export default api;
