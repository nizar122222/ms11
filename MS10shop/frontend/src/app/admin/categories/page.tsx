"use client";

import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, FolderTree } from "lucide-react";
import { categoryAPI } from "@/lib/api";
import { Category } from "@/types";
import { cn } from "@/lib/utils";
import Modal from "@/components/ui/Modal";
import toast from "react-hot-toast";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: "", nameAr: "", description: "", sortOrder: "0" });

  const fetchCategories = async () => {
    try {
      const { data } = await categoryAPI.getCategories();
      setCategories(data.categories);
    } catch {} finally { setIsLoading(false); }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { ...form, sortOrder: parseInt(form.sortOrder) || 0 };
      if (editing) {
        await categoryAPI.updateCategory(editing.id, payload);
        toast.success("Catégorie modifiée");
      } else {
        await categoryAPI.createCategory(payload);
        toast.success("Catégorie créée");
      }
      setShowModal(false);
      fetchCategories();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Erreur");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette catégorie ?")) return;
    try {
      await categoryAPI.deleteCategory(id);
      toast.success("Catégorie supprimée");
      fetchCategories();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Erreur");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Catégories</h1>
        <button
          onClick={() => { setEditing(null); setForm({ name: "", nameAr: "", description: "", sortOrder: "0" }); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-semibold"
        >
          <Plus size={16} /> Ajouter
        </button>
      </div>

      <div className="bg-dark-900 rounded-2xl border border-white/5 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs text-dark-400 uppercase tracking-wider border-b border-white/5">
              <th className="px-6 py-3">Nom</th>
              <th className="px-6 py-3">Slug</th>
              <th className="px-6 py-3">Produits</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-white/[0.02]">
                <td className="px-6 py-4 flex items-center gap-3">
                  <FolderTree size={16} className="text-brand-400" />
                  <span className="text-sm text-white font-medium">{cat.name}</span>
                  {cat.nameAr && <span className="text-xs text-dark-500">({cat.nameAr})</span>}
                </td>
                <td className="px-6 py-4 text-xs text-dark-400">{cat.slug}</td>
                <td className="px-6 py-4 text-sm text-dark-300">{cat._count?.products || 0}</td>
                <td className="px-6 py-4 flex gap-1">
                  <button onClick={() => { setEditing(cat); setForm({ name: cat.name, nameAr: cat.nameAr || "", description: cat.description || "", sortOrder: String(cat.sortOrder) }); setShowModal(true); }} className="p-2 hover:bg-white/5 rounded-lg"><Edit size={14} className="text-dark-400" /></button>
                  <button onClick={() => handleDelete(cat.id)} className="p-2 hover:bg-red-500/5 rounded-lg"><Trash2 size={14} className="text-red-400" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {categories.length === 0 && <p className="text-center py-12 text-dark-400">Aucune catégorie</p>}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editing ? "Modifier" : "Ajouter"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-1.5">Nom *</label>
            <input type="text" required value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-1.5">Nom arabe</label>
            <input type="text" value={form.nameAr} onChange={(e) => setForm((p) => ({ ...p, nameAr: e.target.value }))} className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-500" dir="rtl" />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-1.5">Ordre</label>
            <input type="number" value={form.sortOrder} onChange={(e) => setForm((p) => ({ ...p, sortOrder: e.target.value }))} className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-500" />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2.5 bg-dark-800 border border-white/10 rounded-xl text-sm text-dark-300 hover:text-white">Annuler</button>
            <button type="submit" className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-semibold">{editing ? "Enregistrer" : "Créer"}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
