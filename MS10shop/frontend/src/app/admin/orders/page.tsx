"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, ChevronDown, Eye, RefreshCw } from "lucide-react";
import { orderAPI } from "@/lib/api";
import { Order, Pagination } from "@/types";
import { formatPrice, formatDate, getStatusColor, getStatusLabel, cn } from "@/lib/utils";
import Modal from "@/components/ui/Modal";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, pages: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchOrders = async (page = 1) => {
    try {
      setIsLoading(true);
      const params: any = { page, limit: 20 };
      if (statusFilter) params.status = statusFilter;
      const { data } = await orderAPI.getOrders(params);
      setOrders(data.orders);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(1);
  }, [statusFilter]);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingStatus(true);
      await orderAPI.updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus as any } : o))
      );
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus as any } : null));
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const statuses = ["", "PENDING", "CONFIRMED", "PREPARING", "SHIPPING", "DELIVERED", "CANCELLED"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Commandes</h1>
          <p className="text-dark-400 text-sm mt-1">{pagination.total} commandes au total</p>
        </div>
        <button
          onClick={() => fetchOrders(pagination.page)}
          className="flex items-center gap-2 px-4 py-2.5 bg-dark-900 border border-white/10 rounded-xl text-sm text-dark-300 hover:text-white hover:border-white/20 transition-colors"
        >
          <RefreshCw size={16} />
          Actualiser
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {statuses.map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-medium border transition-all",
              statusFilter === status
                ? "bg-brand-600/20 border-brand-500/30 text-brand-400"
                : "bg-dark-900 border-white/10 text-dark-400 hover:border-white/20 hover:text-white"
            )}
          >
            {status ? getStatusLabel(status) : "Toutes"}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-dark-900 rounded-xl p-4 border border-white/5">
              <div className="flex items-center gap-4">
                <div className="h-4 w-24 shimmer rounded" />
                <div className="h-4 w-32 shimmer rounded" />
                <div className="h-4 w-20 shimmer rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-dark-900 rounded-2xl border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-dark-400 uppercase tracking-wider border-b border-white/5">
                  <th className="px-6 py-3">Commande</th>
                  <th className="px-6 py-3">Client</th>
                  <th className="px-6 py-3">Articles</th>
                  <th className="px-6 py-3">Total</th>
                  <th className="px-6 py-3">Paiement</th>
                  <th className="px-6 py-3">Statut</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-brand-400">{order.orderNumber}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-white">{order.firstName} {order.lastName}</p>
                      <p className="text-xs text-dark-400">{order.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-dark-300">{order.items?.length || 0} articles</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-white">{formatPrice(order.total)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-dark-400">
                        {order.paymentMethod === "CASH_ON_DELIVERY" ? "Livraison" : "CB"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                        disabled={updatingStatus}
                        className={cn(
                          "text-xs font-semibold rounded-full px-3 py-1.5 border appearance-none cursor-pointer focus:outline-none",
                          getStatusColor(order.status),
                          "bg-transparent"
                        )}
                      >
                        {["PENDING", "CONFIRMED", "PREPARING", "SHIPPING", "DELIVERED", "CANCELLED"].map((s) => (
                          <option key={s} value={s} className="bg-dark-900 text-white">
                            {getStatusLabel(s)}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-dark-400">{formatDate(order.createdAt)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                      >
                        <Eye size={16} className="text-dark-400" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {orders.length === 0 && (
            <div className="text-center py-12">
              <p className="text-dark-400">Aucune commande trouvée</p>
            </div>
          )}
        </div>
      )}

      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => fetchOrders(page)}
              className={cn(
                "w-10 h-10 rounded-xl text-sm font-medium transition-all",
                page === pagination.page
                  ? "bg-brand-600 text-white"
                  : "bg-dark-900 text-dark-400 hover:bg-white/5 border border-white/5"
              )}
            >
              {page}
            </button>
          ))}
        </div>
      )}

      <Modal isOpen={!!selectedOrder} onClose={() => setSelectedOrder(null)} title="Détails de la commande" size="lg">
        {selectedOrder && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-dark-400 mb-1">Numéro</p>
                <p className="text-sm font-bold text-brand-400">{selectedOrder.orderNumber}</p>
              </div>
              <div>
                <p className="text-xs text-dark-400 mb-1">Statut</p>
                <span className={cn("inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border", getStatusColor(selectedOrder.status))}>
                  {getStatusLabel(selectedOrder.status)}
                </span>
              </div>
              <div>
                <p className="text-xs text-dark-400 mb-1">Client</p>
                <p className="text-sm text-white">{selectedOrder.firstName} {selectedOrder.lastName}</p>
                <p className="text-xs text-dark-400">{selectedOrder.email}</p>
                <p className="text-xs text-dark-400">{selectedOrder.phone}</p>
              </div>
              <div>
                <p className="text-xs text-dark-400 mb-1">Livraison</p>
                <p className="text-sm text-white">{selectedOrder.address}</p>
                <p className="text-xs text-dark-400">{selectedOrder.city}, {selectedOrder.postalCode}</p>
                <p className="text-xs text-dark-400">{selectedOrder.country}</p>
              </div>
            </div>

            <div>
              <p className="text-xs text-dark-400 mb-3">Articles commandés</p>
              <div className="space-y-2">
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-3 bg-dark-800 rounded-xl">
                    <div className="w-12 h-12 bg-dark-700 rounded-lg overflow-hidden shrink-0">
                      {item.productImage && <img src={item.productImage} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{item.productName}</p>
                      <p className="text-xs text-dark-400">Taille: {item.size} | Qté: {item.quantity}</p>
                      {item.customName && (
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs px-2 py-0.5 bg-brand-500/10 text-brand-400 rounded-full font-medium">
                            ✏️ {item.customName} #{item.customNumber || "—"}
                          </span>
                          <span className="text-xs text-dark-400">(+{formatPrice(item.customizationPrice || 0)})</span>
                        </div>
                      )}
                    </div>
                    <span className="text-sm font-semibold text-white">{formatPrice(item.total)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-white/10 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-dark-400">Sous-total</span>
                <span className="text-white">{formatPrice(selectedOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-dark-400">Livraison</span>
                <span className="text-white">{formatPrice(selectedOrder.shippingCost)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-white/10">
                <span className="text-white font-bold">Total</span>
                <span className="text-white font-bold text-lg">{formatPrice(selectedOrder.total)}</span>
              </div>
            </div>

            {selectedOrder.notes && (
              <div className="bg-dark-800 rounded-xl p-4">
                <p className="text-xs text-dark-400 mb-1">Notes</p>
                <p className="text-sm text-dark-300">{selectedOrder.notes}</p>
              </div>
            )}

            <div>
              <p className="text-xs text-dark-400 mb-3">Changer le statut</p>
              <div className="flex flex-wrap gap-2">
                {["PENDING", "CONFIRMED", "PREPARING", "SHIPPING", "DELIVERED", "CANCELLED"].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusUpdate(selectedOrder.id, status)}
                    disabled={selectedOrder.status === status || updatingStatus}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                      selectedOrder.status === status
                        ? getStatusColor(status)
                        : "border-white/10 text-dark-400 hover:border-white/20 hover:text-white"
                    )}
                  >
                    {getStatusLabel(status)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
