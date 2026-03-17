import React from "react";

export function Container({ children }) {
  return <div className="mx-auto w-full max-w-6xl px-4">{children}</div>;
}

export function Card({ children, className = "" }) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg ${className}`}>
      {children}
    </div>
  );
}

export function Button({
  children,
  className = "",
  variant = "primary",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed";
  const styles =
    variant === "ghost"
      ? "bg-transparent hover:bg-white/5 border border-white/10 text-white"
      : variant === "danger"
      ? "bg-red-500/90 hover:bg-red-500 text-white"
      : "bg-indigo-500/90 hover:bg-indigo-500 text-white";

  return (
    <button className={`${base} ${styles} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function Input({ label, className = "", ...props }) {
  return (
    <label className="block">
      {label ? <div className="mb-2 text-sm text-white/80">{label}</div> : null}
      <input
        className={`w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-white/40 outline-none focus:border-indigo-400/70 ${className}`}
        {...props}
      />
    </label>
  );
}

export function Select({ label, className = "", children, ...props }) {
  return (
    <label className="block">
      {label ? <div className="mb-2 text-sm text-white/80">{label}</div> : null}
      <select
        className={`w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-white outline-none focus:border-indigo-400/70 ${className}`}
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
      ? "border-red-500/30 bg-red-500/10 text-red-100"
      : type === "success"
      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-100"
      : "border-white/10 bg-white/5 text-white/90";
  return <div className={`rounded-xl border px-4 py-3 text-sm ${cls}`}>{children}</div>;
}

export function Spinner() {
  return (
    <div className="inline-flex items-center gap-2 text-sm text-white/80">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white/80" />
      Loading…
    </div>
  );
}

