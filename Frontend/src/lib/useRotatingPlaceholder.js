import { useEffect, useMemo, useState } from "react";

export function useRotatingPlaceholder(lines, { speedMs = 34, pauseMs = 1100 } = {}) {
  const items = useMemo(() => (Array.isArray(lines) ? lines.filter(Boolean) : []), [lines]);
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");

  useEffect(() => {
    if (!items.length) return;

    let cancelled = false;
    let t;

    async function run() {
      while (!cancelled) {
        const full = items[index % items.length];
        // type
        for (let i = 1; i <= full.length && !cancelled; i++) {
          setText(full.slice(0, i));
          // eslint-disable-next-line no-await-in-loop
          await new Promise((r) => (t = window.setTimeout(r, speedMs)));
        }
        // pause
        // eslint-disable-next-line no-await-in-loop
        await new Promise((r) => (t = window.setTimeout(r, pauseMs)));
        // erase
        for (let i = full.length; i >= 0 && !cancelled; i--) {
          setText(full.slice(0, i));
          // eslint-disable-next-line no-await-in-loop
          await new Promise((r) => (t = window.setTimeout(r, Math.max(14, speedMs - 10))));
        }
        setIndex((v) => v + 1);
      }
    }

    run();
    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }, [items, index, pauseMs, speedMs]);

  return text;
}

