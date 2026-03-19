import React from "react";
import { motion } from "framer-motion";

export default function FloatingCard({ 
  children, 
  className = "", 
  floating = true,
  glowEffect = true,
  glassEffect = true 
}) {
  const baseClasses = [
    "relative overflow-hidden rounded-3xl",
    "transition-all duration-300 ease-out",
    glassEffect ? "glass-morphism-strong" : "bg-white/[0.04]",
    glowEffect ? "premium-glow" : "",
    floating ? "floating-element hover-lift" : "hover-lift",
    className
  ].filter(Boolean).join(" ");

  return (
    <motion.div
      className={baseClasses}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      whileHover={{ 
        scale: 1.02, 
        y: -10,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 40px rgba(34, 197, 94, 0.3)"
      }}
    >
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-transparent to-blue-500/20 animate-gradient-shift" />
      </div>
      
      {/* Inner glow effect */}
      <div className="absolute inset-0 shadow-inner-glow pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Floating particles effect */}
      {floating && (
        <div className="absolute -top-2 -right-2 w-4 h-4">
          <div className="w-full h-full bg-emerald-400 rounded-full opacity-60 animate-float" />
        </div>
      )}
    </motion.div>
  );
}
