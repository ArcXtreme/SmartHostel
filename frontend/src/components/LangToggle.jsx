import React from "react";
import { useI18n } from "../i18n/I18nContext.jsx";

export function LangToggle() {
  const { lang, setLang, t } = useI18n();
  const isPa = lang === "pa";

  return (
    <div
      className="glass flex items-center gap-3 rounded-full px-3 py-2"
      role="group"
      aria-label="Language"
    >
      <span className="text-sm font-medium text-slate-300">{t("langEn")}</span>
      <button
        type="button"
        role="switch"
        aria-checked={isPa}
        onClick={() => setLang(isPa ? "en" : "pa")}
        className={`relative h-8 w-14 rounded-full transition ${
          isPa ? "bg-gradient-to-r from-blue-500 to-violet-500" : "bg-slate-600"
        }`}
      >
        <span
          className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition ${
            isPa ? "left-7" : "left-1"
          }`}
        />
      </button>
      <span className="text-sm font-medium text-slate-300">{t("langPa")}</span>
    </div>
  );
}
