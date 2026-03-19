import React from "react";
import { motion } from "framer-motion";

export default function Tabs({ tabs, value, onChange }) {
  return (
    <div className="inline-flex rounded-xl border border-white/[0.06] bg-white/[0.03] p-1">
      {tabs.map((t) => {
        const active = t.value === value;
        return (
          <motion.button
            key={t.value}
            type="button"
            onClick={() => onChange(t.value)}
            className={[
              "relative rounded-lg px-3 py-1.5 text-xs font-medium transition-colors duration-200",
              active ? "text-white" : "text-zinc-500 hover:text-zinc-300",
            ].join(" ")}
            whileTap={{ scale: 0.96 }}
          >
            {active ? (
              <motion.span
                className="absolute inset-0 -z-10 rounded-lg bg-white/[0.08]"
                layoutId="activeTab"
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
            ) : null}
            {t.label}
          </motion.button>
        );
      })}
    </div>
  );
}
