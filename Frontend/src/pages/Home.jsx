import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button.jsx";
import Card from "../components/Card.jsx";
import { useAuth } from "../lib/auth.jsx";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const features = [
  {
    icon: "✦",
    title: "Code Refinement",
    description: "Clean structure, naming conventions, and consistent formatting.",
  },
  {
    icon: "⚡",
    title: "Bug Detection",
    description: "Spot suspicious patterns and potential issues instantly.",
  },
  {
    icon: "◎",
    title: "Time Complexity",
    description: "Estimate runtime complexity and identify hotspots.",
  },
  {
    icon: "◇",
    title: "Code Explanation",
    description: "Understand logic in plain English, quickly and clearly.",
  },
  {
    icon: "△",
    title: "Optimization",
    description: "Practical improvements for speed and code clarity.",
  },
  {
    icon: "⬡",
    title: "Smart Refactoring",
    description: "Automated code improvements powered by AI.",
  },
];

function FeatureCard({ icon, title, description }) {
  return (
    <motion.div
      variants={fadeUp}
      className="group rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 transition-all duration-300 hover:border-white/[0.1] hover:bg-white/[0.04]"
      whileHover={{ y: -2 }}
    >
      <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-[rgba(var(--primary),0.1)] text-sm text-[rgb(var(--primary))]">
        {icon}
      </div>
      <div className="text-sm font-semibold text-white mb-1.5">{title}</div>
      <div className="text-[13px] leading-relaxed text-zinc-400">
        {description}
      </div>
    </motion.div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <motion.main
      className="relative mx-auto w-full max-w-5xl px-6 pb-24 pt-20 z-10"
      initial="hidden"
      animate="show"
      variants={stagger}
    >
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto">
        {/* Badge */}
        <motion.div
          variants={fadeUp}
          className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium text-zinc-400 mb-8"
        >
          <div className="h-1.5 w-1.5 rounded-full bg-[rgb(var(--primary))]" />
          AI-powered code refinement
        </motion.div>

        {/* Heading */}
        <motion.h1
          variants={fadeUp}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.1] mb-6"
        >
          Write better code.{" "}
          <span className="text-gradient-primary">Instantly.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={fadeUp}
          className="mx-auto max-w-xl text-base sm:text-lg leading-relaxed text-zinc-400 mb-10"
        >
          Refine, debug, optimize, and understand your code with AI — all in one
          place. Built for developers who care about quality.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={fadeUp}
          className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-20"
        >
          <Button
            onClick={() => navigate(isAuthenticated ? "/dashboard" : "/login")}
            size="lg"
          >
            {isAuthenticated ? "Go to Dashboard" : "Get Started Free"}
            <svg
              className="ml-1 h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Button>
          <Button variant="secondary" size="lg">
            View Demo
          </Button>
        </motion.div>
      </div>

      {/* Features Grid */}
      <motion.div variants={fadeUp} className="mb-16">
        <div className="text-center mb-10">
          <div className="text-xs font-medium uppercase tracking-widest text-zinc-500 mb-2">
            Features
          </div>
          <h2 className="text-2xl font-bold text-white">
            Everything you need to ship better code
          </h2>
        </div>

        <motion.div
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
        >
          {features.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </motion.div>
      </motion.div>

      {/* Footer */}
      <motion.footer
        variants={fadeUp}
        className="text-center pt-8 border-t border-white/[0.04]"
      >
        <div className="flex items-center justify-center gap-6 text-xs text-zinc-500">
          <span>© 2024 CodeRefiner</span>
          <span className="h-3 w-px bg-white/[0.08]" />
          <span>Built with AI</span>
        </div>
      </motion.footer>
    </motion.main>
  );
}
