import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "./Button.jsx";
import { useAuth } from "../lib/auth.jsx";
import { useTheme } from "../lib/theme.jsx";

/* ── Theme Toggle Icons ── */

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

/* ── Logo ── */

function Logo() {
  return (
    <div className="flex items-center gap-2.5 text-sm font-bold text-white">
      <div className="grid h-8 w-8 place-items-center rounded-lg bg-[rgb(var(--primary))]">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      </div>
      <span className="hidden sm:block tracking-tight">CodeRefiner</span>
    </div>
  );
}

/* ── Nav Item ── */

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors duration-200",
          isActive
            ? "bg-white/[0.08] text-white"
            : "text-zinc-400 hover:text-zinc-100",
        ].join(" ")
      }
    >
      {children}
    </NavLink>
  );
}

/* ── Navbar ── */

export default function Navbar({ scrolled }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const onLoginPage = pathname.startsWith("/login");
  const { isAuthenticated, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <motion.div
      className="sticky top-0 z-50"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div
        className={[
          "mx-auto w-full border-b transition-all duration-300",
          scrolled
            ? "border-white/[0.06] bg-zinc-950/80 backdrop-blur-xl"
            : "border-transparent bg-transparent",
        ].join(" ")}
      >
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-3">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="transition-opacity hover:opacity-80"
          >
            <Logo />
          </button>

          <div className="hidden items-center gap-1 sm:flex">
            <NavItem to="/">Home</NavItem>
            <NavItem to="/dashboard">Dashboard</NavItem>
            <NavItem to="/history">History</NavItem>
          </div>

          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <motion.button
              onClick={toggleTheme}
              className="rounded-lg p-2 text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.06] transition-colors duration-200"
              whileTap={{ scale: 0.9, rotate: 15 }}
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
              aria-label="Toggle theme"
            >
              {isDark ? <SunIcon /> : <MoonIcon />}
            </motion.button>

            {!isAuthenticated ? (
              !onLoginPage ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/login")}
                >
                  Log in
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/")}
                >
                  Home
                </Button>
              )
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
              >
                Log out
              </Button>
            )}

            {!isAuthenticated ? (
              <Button size="sm" onClick={() => navigate("/login")}>
                Get Started
              </Button>
            ) : (
              <Button size="sm" onClick={() => navigate("/dashboard")}>
                Dashboard
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
