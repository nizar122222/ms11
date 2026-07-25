"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Edit, Trash2, Eye, RefreshCw } from "lucide-react";
import { productAPI, categoryAPI, teamAPI } from "@/lib/api";
import { Product, Category, Team, Pagination } from "@/types";
import { formatPrice, cn } from "@/lib/utils";
import Modal from "@/components/ui/Modal";
import toast from "react-hot-toast";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, pages: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const defaultForm = {
    name: "", nameAr: "", description: "", descriptionAr: "",
    price: "", comparePrice: "", stock: "", categoryId: "", teamId: "",
    isFeatured: false, isNewArrival: false, isBestSeller: false, isOnSale: false, salePrice: "",
    sizes: [
      { size: "S", stock: "10" }, { size: "M", stock: "15" },
      { size: "L", stock: "20" }, { size: "XL", stock: "15" },
      { size: "XXL", stock: "10" }, { size: "3XL", stock: "5" },
    ],
  };

  const [form, setForm] = useState(defaultForm);

  const fetchProducts = async (page = 1) => {
    try {
      setIsLoading(true);
      const params: any = { page, limit: 20 };
      if (searchQuery) params.search = searchQuery;
      const { data } = await productAPI.getProducts(params);
      setProducts(data.products);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const [cats, tms] = await Promise.all([
          categoryAPI.getCategories(),
          teamAPI.getTeams({ limit: 200 }),
        ]);
        setCategories(cats.data.categories);
        setTeams(tms.data.teams);
      } catch {}
    };
    fetchMeta();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => fetchProducts(1), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const openCreateModal = () => {
    setEditingProduct(null);
    setForm(defaultForm);
    setShowModal(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      nameAr: product.nameAr || "",
      description: product.description,
      descriptionAr: product.descriptionAr || "",
      price: String(product.price),
      comparePrice: product.comparePrice ? String(product.comparePrice) : "",
      stock: String(product.stock),
      categoryId: product.categoryId,
      teamId: product.teamId || "",
      isFeatured: product.isFeatured,
      isNewArrival: product.isNewArrival,
      isBestSeller: product.isBestSeller,
      isOnSale: product.isOnSale,
      salePrice: product.salePrice ? String(product.salePrice) : "",
      sizes: product.sizes.map((s) => ({ size: s.size, stock: String(s.stock) })),
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        comparePrice: form.comparePrice ? parseFloat(form.comparePrice) : undefined,
        salePrice: form.salePrice ? parseFloat(form.salePrice) : undefined,
        stock: parseInt(form.stock) || 0,
        sizes: form.sizes.map((s) => ({ size: s.size, stock: parseInt(s.stock) || 0 })),
      };

      if (editingProduct) {
        await productAPI.updateProduct(editingProduct.id, payload);
        toast.success("Produit modifié avec succès");
      } else {
        await productAPI.createProduct(payload);
        toast.success("Produit créé avec succès");
      }
      setShowModal(false);
      fetchProducts(pagination.page);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Erreur");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce produit ?")) return;
    try {
      setDeletingId(id);
      await productAPI.deleteProduct(id);
      toast.success("Produit supprimé");
      fetchProducts(pagination.page);
    } catch {
      toast.error("Erreur de suppression");
    } finally {
      setDeletingId(null);
    }
  };

  const updateSizeStock = (index: number, value: string) => {
    setForm((prev) => {
      const sizes = [...prev.sizes];
      sizes[index] = { ...sizes[index], stock: value };
      return { ...prev, sizes };
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Produits</h1>
          <p className="text-dark-400 text-sm mt-1">{pagination.total} produits</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchProducts(pagination.page)}
            className="flex items-center gap-2 px-4 py-2.5 bg-dark-900 border border-white/10 rounded-xl text-sm text-dark-300 hover:text-white transition-colors"
          >
            <RefreshCw size={16} />
          </button>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-semibold transition-colors"
          >
            <Plus size={16} />
            Ajouter un produit
          </button>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
        <input
          type="text"
          placeholder="Rechercher un produit..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-dark-900 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-dark-500 focus:outline-none focus:border-brand-500 transition-colors"
        />
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-dark-900 rounded-xl p-4 border border-white/5">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 shimmer rounded-lg" />
                <div className="h-4 w-48 shimmer rounded" />
                <div className="h-4 w-24 shimmer rounded" />
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
                  <th className="px-6 py-3">Produit</th>
                  <th className="px-6 py-3">Catégorie</th>
                  <th className="px-6 py-3">Équipe</th>
                  <th className="px-6 py-3">Prix</th>
                  <th className="px-6 py-3">Stock</th>
                  <th className="px-6 py-3">Statut</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-dark-800 rounded-lg overflow-hidden shrink-0">
                          {product.images?.[0] && (
                            <img src={product.images[0].url} alt="" className="w-full h-full object-cover" />
                          )}
                        </div>
                        <span className="text-sm font-medium text-white truncate max-w-[200px]">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-dark-400">{product.category?.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-dark-400">{product.team?.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-white">{formatPrice(product.price)}</span>
                      {product.isOnSale && product.salePrice && (
                        <span className="text-xs text-green-400 ml-2">→ {formatPrice(product.salePrice)}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn("text-sm font-medium", product.stock <= 5 ? "text-red-400" : "text-dark-300")}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1">
                        {product.isFeatured && <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-[10px] rounded-full font-semibold">Vedette</span>}
                        {product.isNewArrival && <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-[10px] rounded-full font-semibold">Nouveau</span>}
                        {product.isOnSale && <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-[10px] rounded-full font-semibold">Promo</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditModal(product)}
                          className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                        >
                          <Edit size={14} className="text-dark-400" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          disabled={deletingId === product.id}
                          className="p-2 hover:bg-red-500/5 rounded-lg transition-colors"
                        >
                          <Trash2 size={14} className="text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {products.length === 0 && (
            <div className="text-center py-12">
              <p className="text-dark-400">Aucun produit trouvé</p>
            </div>
          )}
        </div>
      )}

      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: Math.min(pagination.pages, 10) }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => fetchProducts(page)}
              className={cn(
                "w-10 h-10 rounded-xl text-sm font-medium transition-all",
                page === pagination.page ? "bg-brand-600 text-white" : "bg-dark-900 text-dark-400 border border-white/5"
              )}
            >
              {page}
            </button>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingProduct ? "Modifier le produit" : "Ajouter un produit"} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-dark-300 mb-1.5">Nom du produit *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1.5">Catégorie *</label>
              <select
                required
                value={form.categoryId}
                onChange={(e) => setForm((p) => ({ ...p, categoryId: e.target.value }))}
                className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-500 appearance-none"
              >
                <option value="">Sélectionner</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1.5">Équipe</label>
              <select
                value={form.teamId}
                onChange={(e) => setForm((p) => ({ ...p, teamId: e.target.value }))}
                className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-500 appearance-none"
              >
                <option value="">Sélectionner</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>{team.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1.5">Prix (MAD) *</label>
              <input
                type="number"
                required
                step="0.01"
                value={form.price}
                onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
                className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1.5">Prix comparé</label>
              <input
                type="number"
                step="0.01"
                value={form.comparePrice}
                onChange={(e) => setForm((p) => ({ ...p, comparePrice: e.target.value }))}
                className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-dark-300 mb-1.5">Description *</label>
              <textarea
                required
                rows={3}
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-500 resize-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { key: "isFeatured", label: "En vedette" },
              { key: "isNewArrival", label: "Nouveau" },
              { key: "isBestSeller", label: "Best-seller" },
              { key: "isOnSale", label: "En promo" },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2 p-3 bg-dark-800 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={(form as any)[key]}
                  onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.checked }))}
                  className="rounded border-dark-600 text-brand-600 focus:ring-brand-500"
                />
                <span className="text-sm text-dark-300">{label}</span>
              </label>
            ))}
          </div>

          <div>
            <p className="text-sm font-medium text-dark-300 mb-3">Stock par taille</p>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {form.sizes.map((sizeStock, i) => (
                <div key={sizeStock.size}>
                  <label className="block text-xs text-dark-400 mb-1">{sizeStock.size}</label>
                  <input
                    type="number"
                    value={sizeStock.stock}
                    onChange={(e) => updateSizeStock(i, e.target.value)}
                    className="w-full bg-dark-800 border border-dark-700 rounded-lg px-3 py-2 text-white text-sm text-center focus:outline-none focus:border-brand-500"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-6 py-2.5 bg-dark-800 border border-white/10 rounded-xl text-sm font-medium text-dark-300 hover:text-white transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-semibold transition-colors"
            >
              {editingProduct ? "Enregistrer" : "Créer le produit"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
