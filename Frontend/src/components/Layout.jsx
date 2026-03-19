import React, { useEffect, useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import FloatingChat from "./FloatingChat.jsx";

export default function Layout() {
  const [scrolled, setScrolled] = useState(false);
  const glowRef = useRef(null);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 6);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function onMouseMoveGlow(e) {
    const el = glowRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty("--x", `${x}%`);
    el.style.setProperty("--y", `${y}%`);
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 transition-colors duration-300">
      {/* Background — subtle, clean */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(var(--primary),0.1),transparent_60%)]" />

        {/* Single subtle orb */}
        <div className="absolute top-[-200px] left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-[rgba(var(--primary),0.06)] blur-[100px]" />

        {/* Subtle dot pattern */}
        <div className="absolute inset-0 opacity-[0.04] [background-image:radial-gradient(rgba(255,255,255,0.5)_1px,transparent_1px)] [background-size:32px_32px]" />
      </div>

      <Navbar scrolled={scrolled} />

      <div
        ref={glowRef}
        onMouseMove={onMouseMoveGlow}
        className="relative cr-cursor-glow"
      >
        <Outlet />
      </div>

      {/* Floating AI Chat Assistant */}
      <FloatingChat />
    </div>
  );
}
