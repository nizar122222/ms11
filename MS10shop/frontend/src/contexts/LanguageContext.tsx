"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { translations } from "@/i18n/translations";

type Locale = "fr" | "en" | "ar";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (path: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("fr");

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    if (typeof document !== "undefined") {
      document.documentElement.dir = newLocale === "ar" ? "rtl" : "ltr";
      document.documentElement.lang = newLocale;
    }
  }, []);

  const t = useCallback(
    (path: string): string => {
      const keys = path.split(".");
      let value: any = translations.fr;
      if (locale === "ar") {
        value = translations.fr.ar;
      }
      for (const key of keys) {
        value = value?.[key];
      }
      return (typeof value === "string" ? value : path);
    },
    [locale]
  );

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, isRTL: locale === "ar" }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within a LanguageProvider");
  return context;
}
