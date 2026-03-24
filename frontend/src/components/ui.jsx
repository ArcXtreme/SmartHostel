import React from "react";

export function Container({ children }) {
  return <div className="mx-auto w-full max-w-5xl px-4 pb-16 sm:px-6">{children}</div>;
}

export function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm ${className}`}
    >
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
    "hms-focus inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl px-5 font-semibold transition disabled:cursor-not-allowed disabled:opacity-50";
  const sizes = size === "lg" ? "text-lg py-3 px-6" : "text-base py-2.5";
  const styles =
    variant === "ghost"
      ? "border border-slate-300 bg-white text-slate-800 hover:bg-slate-50"
      : variant === "danger"
      ? "bg-red-600 text-white hover:bg-red-500"
      : "bg-sky-600 text-white hover:bg-sky-500";

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
        className={`hms-focus w-full min-h-[48px] rounded-2xl border border-slate-300 bg-white px-4 text-lg text-slate-900 placeholder:text-slate-400 ${className}`}
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
        className={`hms-focus w-full min-h-[120px] rounded-2xl border border-slate-300 bg-white px-4 py-3 text-lg text-slate-900 placeholder:text-slate-400 ${className}`}
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
        className={`hms-focus w-full min-h-[48px] rounded-2xl border border-slate-300 bg-white px-4 text-lg text-slate-900 ${className}`}
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
      ? "border-emerald-200 bg-emerald-50 text-emerald-900"
      : "border-sky-200 bg-sky-50 text-sky-900";
  return <div className={`rounded-2xl border px-4 py-3 text-base ${cls}`}>{children}</div>;
}

export function Spinner({ label = "…" }) {
  return (
    <div className="inline-flex items-center gap-3 text-base text-slate-600">
      <span className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-sky-600" />
      {label}
    </div>
  );
}
