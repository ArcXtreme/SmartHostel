import React from "react";

export function Container({ children }) {
  return <div className="mx-auto w-full max-w-5xl px-4 pb-16 sm:px-6">{children}</div>;
}

export function Card({ children, className = "" }) {
  return (
    <div className={`glass lift-hover p-5 ${className}`}>
      {children}
    </div>
  );
}

export function Button({
  children,
  className = "",
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}) {
  const base =
    "hms-focus inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl px-5 font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer";
  const sizes = size === "lg" ? "text-lg py-3 px-6" : "text-base py-2.5";
  const styles =
    variant === "ghost"
      ? "border border-slate-300 bg-white text-[#0f172a] hover:bg-slate-50 hover:border-violet-300"
      : variant === "danger"
      ? "border border-red-200 bg-red-500 text-white hover:bg-red-600"
      : "bg-gradient-to-r from-violet-600 via-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 hover:brightness-110";

  return (
    <button type={type} className={`${base} ${sizes} ${styles} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function Input({ label, className = "", ...props }) {
  return (
    <label className="block w-full">
      {label ? <div className="mb-2 text-base font-medium text-[#0f172a]">{label}</div> : null}
      <input
        className={`hms-focus w-full min-h-[48px] rounded-2xl border border-slate-300 bg-white px-4 text-lg text-[#0f172a] placeholder:text-slate-400 transition focus:border-violet-400 focus:ring-1 focus:ring-violet-200 ${className}`}
        {...props}
      />
    </label>
  );
}

export function TextArea({ label, className = "", ...props }) {
  return (
    <label className="block w-full">
      {label ? <div className="mb-2 text-base font-medium text-[#0f172a]">{label}</div> : null}
      <textarea
        className={`hms-focus w-full min-h-[120px] rounded-2xl border border-slate-300 bg-white px-4 py-3 text-lg text-[#0f172a] placeholder:text-slate-400 transition focus:border-violet-400 focus:ring-1 focus:ring-violet-200 ${className}`}
        {...props}
      />
    </label>
  );
}

export function Select({ label, className = "", children, ...props }) {
  return (
    <label className="block w-full">
      {label ? <div className="mb-2 text-base font-medium text-[#0f172a]">{label}</div> : null}
      <select
        className={`hms-focus w-full min-h-[48px] rounded-2xl border border-slate-300 bg-white px-4 text-lg text-[#0f172a] transition focus:border-violet-400 focus:ring-1 focus:ring-violet-200 ${className}`}
        {...props}
      >
        {children}
      </select>
    </label>
  );
}

export function Alert({ type = "info", children }) {
  const cls =
    type === "error"
      ? "border-red-200 bg-red-50 text-red-800"
      : type === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : "border-violet-200 bg-violet-50 text-violet-800";
  return <div className={`rounded-2xl border px-4 py-3 text-base ${cls}`}>{children}</div>;
}

export function Spinner({ label = "…" }) {
  return (
    <div className="inline-flex items-center gap-3 text-base text-slate-500">
      <span className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-violet-500" />
      {label}
    </div>
  );
}
