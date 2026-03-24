import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { STRINGS } from "./strings.js";

const I18nContext = createContext({
  lang: "en",
  setLang: () => {},
  t: (k) => k,
});

const STORAGE_KEY = "hms_lang";

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEY);
      if (s === "pa" || s === "en") return s;
    } catch {
      /* ignore */
    }
    return "en";
  });

  const setLang = useCallback((next) => {
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const t = useCallback(
    (key) => {
      const en = STRINGS.en[key];
      const tr = STRINGS[lang]?.[key];
      return tr || en || key;
    },
    [lang]
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}
