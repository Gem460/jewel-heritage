import React from "react";

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap " +
  "rounded-2xl px-5 py-3 text-sm md:text-base font-semibold " +
  "transition active:scale-[0.99] focus:outline-none focus-visible:ring-2 " +
  "focus-visible:ring-emerald-500/40 focus-visible:ring-offset-2 " +
  "disabled:opacity-60 disabled:cursor-not-allowed";

const variants = {
  primary:
    "bg-emerald-900 text-white shadow-lg shadow-emerald-900/20 " +
    "hover:bg-emerald-800",
  secondary:
    "bg-white text-emerald-900 border border-black/10 shadow-sm " +
    "hover:bg-emerald-50",
  outline:
    "bg-transparent text-emerald-900 border border-emerald-900/20 " +
    "hover:bg-emerald-50",
  ghost:
    "bg-transparent text-emerald-900 hover:bg-emerald-50",
  dark:
    "bg-black text-white hover:bg-black/90 shadow-lg shadow-black/10",
};

const sizes = {
  md: "px-5 py-3",
  sm: "px-4 py-2 text-sm",
  lg: "px-6 py-3.5 text-base",
};

export default function Button({
  as: Comp = "button",
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) {
  return (
    <Comp
      className={`${base} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    />
  );
}