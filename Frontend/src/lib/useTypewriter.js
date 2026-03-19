import { useEffect, useMemo, useState } from "react";

export function useTypewriter(text, { speedMs = 12, enabled = true } = {}) {
  const safe = useMemo(() => (text ?? "").toString(), [text]);
  const [out, setOut] = useState(enabled ? "" : safe);

  useEffect(() => {
    if (!enabled) {
      setOut(safe);
      return;
    }

    let i = 0;
    setOut("");
    const id = window.setInterval(() => {
      i += 2;
      setOut(safe.slice(0, i));
      if (i >= safe.length) window.clearInterval(id);
    }, speedMs);

    return () => window.clearInterval(id);
  }, [safe, speedMs, enabled]);

  return out;
}

