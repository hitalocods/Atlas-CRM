"use client";

import * as React from "react";
import { dictionaries, type Locale, type TranslationKey } from "@/lib/i18n/dictionaries";

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
};

const LanguageContext = React.createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = React.useState<Locale>("en");

  React.useEffect(() => {
    const stored = window.localStorage.getItem("atlas-locale");
    if (stored === "pt-BR" || stored === "en") {
      setLocaleState(stored);
      document.documentElement.lang = stored;
    }
  }, []);

  const setLocale = React.useCallback((nextLocale: Locale) => {
    setLocaleState(nextLocale);
    window.localStorage.setItem("atlas-locale", nextLocale);
    document.documentElement.lang = nextLocale;
  }, []);

  const value = React.useMemo<LanguageContextValue>(
    () => ({
      locale,
      setLocale,
      t: (key) => dictionaries[locale][key] ?? dictionaries.en[key],
    }),
    [locale, setLocale],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useI18n() {
  const context = React.useContext(LanguageContext);
  if (!context) {
    throw new Error("useI18n must be used within LanguageProvider");
  }
  return context;
}
