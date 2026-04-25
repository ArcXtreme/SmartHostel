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
    "hms-focus inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl px-5 font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-50";
  const sizes = size === "lg" ? "text-lg py-3 px-6" : "text-base py-2.5";
  const styles =
    variant === "ghost"
      ? "border border-slate-300/80 bg-white/70 text-slate-800 hover:bg-white"
      : variant === "danger"
      ? "border border-red-300/35 bg-red-500/80 text-white hover:bg-red-500"
      : "bg-gradient-to-r from-blue-500 via-violet-500 to-purple-500 text-white shadow-lg shadow-blue-900/30 hover:brightness-110";

  return (
    <button type={type} className={`${base} ${sizes} ${styles} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function Input({ label, className = "", ...props }) {
  return (
    <label className="block w-full">
      {label ? <div className="mb-2 text-base font-medium text-slate-700">{label}</div> : null}
      <input
        className={`hms-focus w-full min-h-[48px] rounded-2xl border border-slate-300/80 bg-white/70 px-4 text-lg text-slate-900 placeholder:text-slate-400 ${className}`}
        {...props}
      />
    </label>
  );
}

export function TextArea({ label, className = "", ...props }) {
  return (
    <label className="block w-full">
      {label ? <div className="mb-2 text-base font-medium text-slate-700">{label}</div> : null}
      <textarea
        className={`hms-focus w-full min-h-[120px] rounded-2xl border border-slate-300/80 bg-white/70 px-4 py-3 text-lg text-slate-900 placeholder:text-slate-400 ${className}`}
        {...props}
      />
    </label>
  );
}

export function Select({ label, className = "", children, ...props }) {
  return (
    <label className="block w-full">
      {label ? <div className="mb-2 text-base font-medium text-slate-700">{label}</div> : null}
      <select
        className={`hms-focus w-full min-h-[48px] rounded-2xl border border-slate-300/80 bg-white/70 px-4 text-lg text-slate-900 ${className}`}
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
      ? "border-[var(--danger-border)] bg-[var(--danger-bg)] text-red-900"
      : type === "success"
      ? "border-[var(--success-border)] bg-[var(--success-bg)] text-emerald-900"
      : "border-[var(--info-border)] bg-[var(--info-bg)] text-blue-900";
  return <div className={`rounded-2xl border px-4 py-3 text-base ${cls}`}>{children}</div>;
}

export function Spinner({ label = "…" }) {
  return (
    <div className="inline-flex items-center gap-3 text-base text-slate-300">
      <span className="h-6 w-6 animate-spin rounded-full border-2 border-slate-500 border-t-blue-400" />
      {label}
    </div>
  );
}
