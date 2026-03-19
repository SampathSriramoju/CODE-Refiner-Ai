import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Button from "../components/Button.jsx";
import Card from "../components/Card.jsx";
import Tabs from "../components/Tabs.jsx";
import { loadHistory } from "../lib/historyStore.js";
import { useTypewriter } from "../lib/useTypewriter.js";

function formatWhen(ts) {
  try {
    return new Date(ts).toLocaleString();
  } catch {
    return "";
  }
}

function previewCode(code) {
  const s = (code ?? "").replace(/\s+/g, " ").trim();
  if (!s) return "(empty)";
  return s.length > 80 ? `${s.slice(0, 80)}…` : s;
}

function CodePanel({ title, subtitle, children }) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-zinc-950/60">
      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-2.5">
        <div>
          <div className="text-xs font-medium text-zinc-300">{title}</div>
          {subtitle ? (
            <div className="mt-0.5 text-[11px] text-zinc-500">{subtitle}</div>
          ) : null}
        </div>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

export default function History() {
  const items = useMemo(() => loadHistory(), []);
  const [selectedId, setSelectedId] = useState(items[0]?.id ?? null);
  const selected = useMemo(
    () => items.find((x) => x.id === selectedId) ?? null,
    [items, selectedId]
  );
  const [tab, setTab] = useState("refined");
  const [copied, setCopied] = useState(false);

  const typedRefined = useTypewriter(selected?.result?.refined ?? "", {
    enabled: Boolean(selected?.result?.refined),
    speedMs: 8,
  });
  const typedExplanation = useTypewriter(selected?.result?.explanation ?? "", {
    enabled: Boolean(selected?.result?.explanation),
    speedMs: 10,
  });
  const typedOptimized = useTypewriter(selected?.result?.optimized ?? "", {
    enabled: Boolean(selected?.result?.optimized),
    speedMs: 8,
  });
  const typedComplexity = useTypewriter(selected?.result?.complexity ?? "", {
    enabled: Boolean(selected?.result?.complexity),
    speedMs: 12,
  });
  const typedBugs = useTypewriter(selected?.result?.bugs ?? "", {
    enabled: Boolean(selected?.result?.bugs),
    speedMs: 10,
  });

  async function onCopy() {
    const r = selected?.result;
    if (!r) return;
    const map = {
      refined: r.refined,
      explanation: r.explanation,
      optimization: r.optimized,
      complexity: r.complexity,
      bugs: r.bugs,
    };
    const text = map[tab] ?? "";
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  }

  const outputTabs = [
    { label: "Refined", value: "refined" },
    { label: "Explanation", value: "explanation" },
    { label: "Optimized", value: "optimization" },
    { label: "Complexity", value: "complexity" },
    { label: "Bugs", value: "bugs" },
  ];

  return (
    <motion.main
      className="relative mx-auto w-full max-w-6xl px-6 pb-20 pt-12"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-zinc-500 mb-4">
          <div className="h-1.5 w-1.5 rounded-full bg-[rgb(var(--accent))]" />
          History
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Previous analyses
        </h1>
        <p className="mt-2 max-w-lg text-sm leading-relaxed text-zinc-400">
          Select a submission to view its full results across all tabs.
        </p>
      </motion.div>

      {/* Content */}
      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {/* Submissions List */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card hover={false}>
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-semibold text-white">
                  Submissions
                </div>
                <div className="text-[11px] text-zinc-500">
                  {items.length} {items.length === 1 ? "item" : "items"}
                </div>
              </div>

              <div className="space-y-1.5 max-h-[500px] overflow-y-auto cr-scrollbar">
                {items.length ? (
                  items.map((it) => {
                    const active = it.id === selectedId;
                    return (
                      <button
                        key={it.id}
                        type="button"
                        onClick={() => setSelectedId(it.id)}
                        className={[
                          "w-full rounded-lg border px-3 py-2.5 text-left transition-all duration-200",
                          active
                            ? "border-[rgba(var(--primary),0.2)] bg-[rgba(var(--primary),0.06)]"
                            : "border-transparent hover:bg-white/[0.04]",
                        ].join(" ")}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="text-xs font-medium text-zinc-200">
                            {it.language}
                          </div>
                          <div className="text-[10px] text-zinc-500">
                            {formatWhen(it.createdAt)}
                          </div>
                        </div>
                        <div className="mt-1.5 line-clamp-2 text-[11px] leading-relaxed text-zinc-500">
                          {previewCode(it.code)}
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4 text-sm text-zinc-400">
                    No history yet. Run an analysis from the Dashboard to get
                    started.
                  </div>
                )}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Result Detail */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <Card hover={false}>
            <div className="p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
                <div>
                  <div className="text-sm font-semibold text-white">Result</div>
                  <div className="mt-1 text-xs text-zinc-500">
                    {selected
                      ? `${selected.language} · ${formatWhen(selected.createdAt)}`
                      : "Select a submission to view details."}
                  </div>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={onCopy}
                  disabled={!selected}
                >
                  {copied ? "✓ Copied" : "Copy"}
                </Button>
              </div>

              <div className="mb-4">
                <Tabs value={tab} onChange={setTab} tabs={outputTabs} />
              </div>

              <div>
                {!selected && (
                  <CodePanel
                    title="No selection"
                    subtitle="Pick a submission from the list"
                  >
                    <div className="text-sm text-zinc-500">
                      Nothing to show yet.
                    </div>
                  </CodePanel>
                )}

                {selected && tab === "refined" && (
                  <motion.div
                    key="refined"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <CodePanel title="Refined Code">
                      <pre className="max-h-[380px] overflow-auto text-sm leading-relaxed text-zinc-200 cr-scrollbar">
                        <code className="whitespace-pre">{typedRefined}</code>
                      </pre>
                    </CodePanel>
                  </motion.div>
                )}

                {selected && tab === "explanation" && (
                  <motion.div
                    key="explanation"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <CodePanel
                      title="Explanation"
                      subtitle="What changed and why"
                    >
                      <div className="max-h-[380px] overflow-auto text-sm leading-relaxed text-zinc-300 cr-scrollbar">
                        {typedExplanation}
                      </div>
                    </CodePanel>
                  </motion.div>
                )}

                {selected && tab === "optimization" && (
                  <motion.div
                    key="optimization"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <CodePanel title="Optimized Code">
                      <pre className="max-h-[380px] overflow-auto text-sm leading-relaxed text-zinc-200 cr-scrollbar">
                        <code className="whitespace-pre">{typedOptimized}</code>
                      </pre>
                    </CodePanel>
                  </motion.div>
                )}

                {selected && tab === "complexity" && (
                  <motion.div
                    key="complexity"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <CodePanel title="Time Complexity">
                      <div className="text-sm leading-relaxed text-zinc-300">
                        {typedComplexity}
                      </div>
                    </CodePanel>
                  </motion.div>
                )}

                {selected && tab === "bugs" && (
                  <motion.div
                    key="bugs"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <CodePanel title="Bugs & Issues">
                      <div className="text-sm leading-relaxed text-zinc-300">
                        {typedBugs}
                      </div>
                    </CodePanel>
                  </motion.div>
                )}
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.footer
        className="mt-12 text-center text-xs text-zinc-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        CodeRefiner AI — Your analysis history is stored locally
      </motion.footer>
    </motion.main>
  );
}
