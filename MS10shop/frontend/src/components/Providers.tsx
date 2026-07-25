"use client";

import { ReactNode, useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuthInit } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";

function CartInit() {
  const { isAuthenticated } = useAuthStore();
  const { fetchCart } = useCartStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated]);

  return null;
}

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 60 * 1000, refetchOnWindowFocus: false },
        },
      })
  );

  useAuthInit();

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <Navbar />
        <CartInit />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </LanguageProvider>
    </QueryClientProvider>
  );
}
