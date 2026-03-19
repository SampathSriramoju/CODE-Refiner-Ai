import React, { useRef } from "react";
import { motion } from "framer-motion";
import Spinner from "./Spinner.jsx";

export default function FloatingButton({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  loadingText = "Processing…",
  className = "",
  floating = true,
  glowEffect = true,
  ...props
}) {
  const ref = useRef(null);
  
  const sizes = {
    sm: "h-12 px-6 text-sm rounded-2xl",
    md: "h-14 px-8 text-base rounded-3xl",
    lg: "h-16 px-10 text-lg rounded-3xl"
  };

  const baseClasses = [
    "relative inline-flex items-center justify-center gap-3 font-semibold",
    "transition-all duration-300 ease-out",
    "focus:outline-none focus:ring-4 focus:ring-[rgba(var(--primary),0.35)]",
    "disabled:cursor-not-allowed disabled:opacity-60",
    "overflow-hidden",
    floating ? "floating-element" : "",
    glowEffect ? "premium-glow" : "",
    sizes[size],
    className
  ].filter(Boolean).join(" ");

  const variants = {
    primary: [
      "bg-gradient-to-r from-[rgba(var(--primary),0.95)] via-[rgba(var(--primary),0.7)] to-[rgba(var(--accent),0.9)]",
      "text-black shadow-glow-primary hover:shadow-glow-primary",
      "border border-[rgba(var(--primary),0.35)]",
      "hover:scale-105 active:scale-95"
    ],
    secondary: [
      "glass-morphism-strong text-white",
      "border border-[rgba(255,255,255,0.18)]",
      "hover:bg-[rgba(255,255,255,0.14)] hover:shadow-glow-accent"
    ],
    ghost: [
      "glass-morphism text-white",
      "border border-[rgba(255,255,255,0.12)]",
      "hover:bg-[rgba(255,255,255,0.12)] hover:shadow-glow-soft"
    ]
  };

  const variantClasses = variants[variant] || variants.primary;

  const handleRipple = (e) => {
    if (!ref.current || loading) return;
    
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ripple = document.createElement("span");
    ripple.className = "absolute rounded-full bg-white/30 pointer-events-none";
    ripple.style.width = "0px";
    ripple.style.height = "0px";
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.style.transform = "translate(-50%, -50%)";
    ripple.style.animation = "ripple 0.6s ease-out forwards";
    
    ref.current.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  };

  return (
    <motion.button
      ref={ref}
      className={`${baseClasses} ${variantClasses.join(" ")}`}
      onClick={(e) => {
        handleRipple(e);
        props.onClick?.(e);
      }}
      disabled={loading || props.disabled}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      {...props}
    >
      {/* Animated background shimmer */}
      <div className="absolute inset-0 overflow-hidden rounded-[inherit]">
        <div className="absolute -left-full top-0 h-full w-full bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 transition-opacity duration-500 hover:opacity-100 animate-shimmer" />
      </div>
      
      {/* Glow overlay on hover */}
      <div className="absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 hover:opacity-100">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-green-400/20 blur-xl" />
      </div>
      
      {/* Content */}
      <span className="relative z-10 inline-flex items-center gap-3">
        {loading ? (
          <>
            <Spinner className="w-5 h-5" />
            {loadingText}
          </>
        ) : (
          children
        )}
      </span>
      
      {/* Floating particles */}
      {floating && !loading && (
        <>
          <div className="absolute -top-1 -left-1 w-2 h-2 bg-emerald-300 rounded-full opacity-60 animate-float-delayed" />
          <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-green-300 rounded-full opacity-60 animate-float-delayed-2" />
        </>
      )}
      
      <style jsx>{`
        @keyframes ripple {
          to {
            width: 300px;
            height: 300px;
            opacity: 0;
          }
        }
      `}</style>
    </motion.button>
  );
}
