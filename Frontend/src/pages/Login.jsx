import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button.jsx";
import { useAuth } from "../lib/auth.jsx";

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const { login } = useAuth();

  return (
    <motion.main
      className="relative mx-auto flex w-full max-w-5xl items-center justify-center px-6 pb-20 pt-16 min-h-[calc(100vh-64px)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="w-full max-w-sm"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="text-sm text-zinc-400">
            {mode === "login"
              ? "Log in to access your dashboard and history."
              : "Sign up to save analyses and revisit results anytime."}
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
          {/* Google button */}
          <button
            type="button"
            className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-zinc-200 transition-colors duration-200 hover:bg-white/[0.08]"
          >
            Continue with Google
          </button>

          {/* Divider */}
          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/[0.06]" />
            <div className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">
              or
            </div>
            <div className="h-px flex-1 bg-white/[0.06]" />
          </div>

          {/* Form */}
          <div className="space-y-4">
            <label className="block">
              <div className="mb-1.5 text-xs font-medium text-zinc-400">
                Email
              </div>
              <input
                className="h-10 w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition-all duration-200 focus:border-[rgba(var(--primary),0.5)] focus:ring-2 focus:ring-[rgba(var(--primary),0.12)]"
                placeholder="you@company.com"
                type="email"
                autoComplete="email"
              />
            </label>

            <label className="block">
              <div className="mb-1.5 flex items-center justify-between">
                <div className="text-xs font-medium text-zinc-400">
                  Password
                </div>
                {mode === "login" && (
                  <button
                    type="button"
                    className="text-xs text-zinc-500 transition-colors hover:text-zinc-300"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <input
                className="h-10 w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition-all duration-200 focus:border-[rgba(var(--primary),0.5)] focus:ring-2 focus:ring-[rgba(var(--primary),0.12)]"
                placeholder="••••••••"
                type="password"
                autoComplete={
                  mode === "login" ? "current-password" : "new-password"
                }
              />
            </label>

            <Button
              className="w-full"
              onClick={() => {
                login();
                navigate("/dashboard");
              }}
            >
              {mode === "login" ? "Log in" : "Create account"}
            </Button>
          </div>

          {/* Toggle */}
          <div className="mt-5 text-center text-xs text-zinc-500">
            {mode === "login" ? (
              <>
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className="font-medium text-zinc-300 hover:text-white transition-colors"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="font-medium text-zinc-300 hover:text-white transition-colors"
                >
                  Log in
                </button>
              </>
            )}
          </div>
        </div>

        {/* Back link */}
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </motion.div>
    </motion.main>
  );
}
