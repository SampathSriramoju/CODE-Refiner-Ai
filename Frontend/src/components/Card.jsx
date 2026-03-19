import React from "react";
import { motion } from "framer-motion";

export default function Card({ children, className = "", hover = true }) {
  return (
    <motion.div
      className={[
        "relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm",
        "transition-all duration-300 ease-out",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      whileHover={
        hover
          ? {
              y: -2,
              borderColor: "rgba(255,255,255,0.1)",
              boxShadow:
                "0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.06)",
            }
          : undefined
      }
    >
      {/* Subtle gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
