import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape") onClose?.();
    }
    if (open) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => onClose?.()}
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <div className="relative mx-auto flex min-h-full max-w-lg items-center justify-center px-4 py-10">
            <motion.div
              className="w-full overflow-hidden rounded-2xl border border-white/[0.08] bg-zinc-900/90 shadow-elevated-lg backdrop-blur-xl"
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
            >
              <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3.5">
                <div className="text-sm font-semibold text-white">{title}</div>
                <button
                  type="button"
                  onClick={() => onClose?.()}
                  className="rounded-lg border border-white/[0.08] bg-white/[0.04] px-2 py-1 text-xs text-zinc-400 transition-colors hover:bg-white/[0.08] hover:text-zinc-200"
                >
                  Esc
                </button>
              </div>
              <div className="p-5">{children}</div>
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
