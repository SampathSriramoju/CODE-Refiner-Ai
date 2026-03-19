import React from "react";

export default function Shimmer({ className = "", lines = 3 }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="relative h-3.5 overflow-hidden rounded-md bg-white/[0.04]"
          style={{ width: `${70 + Math.random() * 30}%` }}
        >
          <div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent animate-shimmer"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        </div>
      ))}
    </div>
  );
}