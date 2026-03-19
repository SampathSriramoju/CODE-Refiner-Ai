import React, { useRef } from "react";
import { motion } from "framer-motion";
import Spinner from "./Spinner.jsx";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  loadingText = "Processing…",
  ripple = true,
  className = "",
  ...props
}) {
  const ref = useRef(null);

  const sizes = {
    sm: "h-9 px-4 text-sm rounded-xl",
    md: "h-11 px-6 text-sm rounded-xl",
    lg: "h-12 px-8 text-base rounded-xl",
  };

  const base =
    "relative inline-flex items-center justify-center gap-2.5 font-semibold transition-all duration-200 ease-out " +
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(var(--primary),0.5)] focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 " +
    "disabled:cursor-not-allowed disabled:opacity-50 overflow-hidden";

  function onClickWithRipple(e) {
    props.onClick?.(e);
    if (!ripple || loading || props.disabled) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rip = document.createElement("span");
    rip.className = "cr-ripple";
    rip.style.left = `${x}px`;
    rip.style.top = `${y}px`;
    el.appendChild(rip);
    window.setTimeout(() => rip.remove(), 650);
  }

  if (variant === "ghost") {
    return (
      <motion.button
        ref={ref}
        onClick={onClickWithRipple}
        className={`${base} ${sizes[size]} text-zinc-300 hover:text-white hover:bg-white/[0.06] ${className}`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        {...props}
      >
        <span className="relative z-10">{children}</span>
      </motion.button>
    );
  }

  if (variant === "secondary") {
    return (
      <motion.button
        ref={ref}
        onClick={onClickWithRipple}
        className={`${base} ${sizes[size]} bg-white/[0.06] text-zinc-200 border border-white/[0.08] hover:bg-white/[0.1] hover:border-white/[0.14] hover:text-white ${className}`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        {...props}
      >
        <span className="relative z-10">{children}</span>
      </motion.button>
    );
  }

  // primary
  return (
    <motion.button
      ref={ref}
      onClick={onClickWithRipple}
      className={`${base} ${sizes[size]} bg-[rgb(var(--primary))] text-white shadow-glow hover:shadow-glow-lg ${className}`}
      whileHover={{ scale: 1.03, y: -1 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      {...props}
    >
      <span className="relative z-10 inline-flex items-center gap-2.5">
        {loading ? (
          <>
            <Spinner className="h-4 w-4 text-white" />
            {loadingText}
          </>
        ) : (
          children
        )}
      </span>
    </motion.button>
  );
}
