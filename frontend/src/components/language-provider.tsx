"use client";

import React, { createContext, useContext, useState, useMemo } from "react";
import { dict, Dictionary } from "@/lib/i18n/dict";

type Language = "en" | "hi";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Dictionary;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { readonly children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof globalThis.window !== "undefined") {
      const saved = localStorage.getItem("language");
      if (saved === "en" || saved === "hi") return saved as Language;
    }
    return "en";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof globalThis.window !== "undefined") {
      localStorage.setItem("language", lang);
    }
  };

  const t = useMemo(() => dict[language], [language]);

  const value = useMemo(() => ({
    language,
    setLanguage,
    t,
  }), [language, t]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
