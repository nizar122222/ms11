"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { authAPI } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const { data } = await authAPI.login(form);
      setUser(data.user, data.token);
      toast.success(`Bienvenue ${data.user.firstName} !`);
      if (data.user.role === "ADMIN") {
        router.push("/admin/dashboard");
      } else {
        router.push("/");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Erreur de connexion");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl flex items-center justify-center">
              <span className="text-white font-black text-xl">M</span>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-white">Connexion</h1>
          <p className="text-dark-400 mt-2">Accédez à votre compte MS10Shop</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-1.5">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              className="w-full bg-dark-900 border border-dark-700 rounded-xl px-4 py-3 text-white placeholder:text-dark-500 focus:outline-none focus:border-brand-500 transition-colors"
              placeholder="votre@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-1.5">Mot de passe</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={form.password}
                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                className="w-full bg-dark-900 border border-dark-700 rounded-xl px-4 py-3 pr-12 text-white placeholder:text-dark-500 focus:outline-none focus:border-brand-500 transition-colors"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-white"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 disabled:bg-dark-700 text-white rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <LogIn size={18} />
                Se connecter
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-dark-400 mt-6">
          Pas encore de compte ?{" "}
          <Link href="/register" className="text-brand-400 hover:text-brand-300 font-medium">
            S&apos;inscrire
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
