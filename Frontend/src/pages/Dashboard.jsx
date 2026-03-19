import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Button from "../components/Button.jsx";
import Card from "../components/Card.jsx";
import Select from "../components/Select.jsx";
import Tabs from "../components/Tabs.jsx";
import { useRotatingPlaceholder } from "../lib/useRotatingPlaceholder.js";
import { useTypewriter } from "../lib/useTypewriter.js";
import { addHistoryItem } from "../lib/historyStore.js";
import Shimmer from "../components/Shimmer.jsx";



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

export default function Dashboard() {
  const [language, setLanguage] = useState("JavaScript");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("refined");
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [out, setOut] = useState({
    refined: "",
    explanation: "",
    optimized: "",
    complexity: "",
    bugs: "",
  });

  const rotatingPlaceholder = useRotatingPlaceholder(
    [
      "Paste your code here…",
      "Explain this bug…",
      "Optimize this loop…",
      "Refactor for clarity…",
    ],
    { speedMs: 30, pauseMs: 900 }
  );

  const typedRefined = useTypewriter(out.refined, {
    enabled: !loading && Boolean(out.refined),
    speedMs: 10,
  });
  const typedExplanation = useTypewriter(out.explanation, {
    enabled: !loading && Boolean(out.explanation),
    speedMs: 12,
  });
  const typedOptimized = useTypewriter(out.optimized, {
    enabled: !loading && Boolean(out.optimized),
    speedMs: 10,
  });
  const typedComplexity = useTypewriter(out.complexity, {
    enabled: !loading && Boolean(out.complexity),
    speedMs: 14,
  });
  const typedBugs = useTypewriter(out.bugs, {
    enabled: !loading && Boolean(out.bugs),
    speedMs: 12,
  });

  const hasAnyOutput = useMemo(
    () =>
      Boolean(
        out.refined || out.explanation || out.optimized || out.complexity || out.bugs
      ),
    [out]
  );

  async function onCopy() {
    const map = {
      refined: out.refined,
      explanation: out.explanation,
      optimization: out.optimized,
      complexity: out.complexity,
      bugs: out.bugs,
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

  async function onAnalyze() {
    setCopied(false);
    setErrorMsg("");
    const trimmed = code.trim();
    if (!trimmed) {
      setErrorMsg("Please enter some code to analyze.");
      return;
    }
    
    setLoading(true);
    setOut({ refined: "", explanation: "", optimized: "", complexity: "", bugs: "" });

    try {
      const response = await fetch("https://code-refiner-ai.onrender.com/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          code: trimmed,
          language
        })
      });

      if (!response.ok) {
        let backendMessage = "Server responded with status: " + response.status;
        try {
          const errData = await response.json();
          if (errData.error) backendMessage = errData.error;
        } catch (_) {}
        throw new Error(backendMessage);
      }

      const result = await response.json();
      
      const normalizedResult = {
        refined: result.refined || "",
        explanation: result.explanation || "",
        optimized: result.optimized || "",
        complexity: result.complexity || "",
        bugs: result.bugs || ""
      };

      setOut(normalizedResult);

      const item = {
        id: crypto?.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        createdAt: Date.now(),
        language,
        code: trimmed,
        result: normalizedResult,
      };
      addHistoryItem(item);
    } catch (err) {
      console.error("API Error:", err);
      setErrorMsg(err.message || "Failed to analyze code. Make sure the server is running.");
      setOut({ refined: "", explanation: "", optimized: "", complexity: "", bugs: "" });
    } finally {
      setLoading(false);
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
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.05 }}
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-zinc-500 mb-4">
          <div className="h-1.5 w-1.5 rounded-full bg-[rgb(var(--primary))]" />
          Dashboard
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Analyze your code
        </h1>
        <p className="mt-2 max-w-lg text-sm leading-relaxed text-zinc-400">
          Paste a snippet, select a language, and get instant AI-powered
          refinement, optimization, and bug detection.
        </p>
      </motion.div>

      {/* Split Layout */}
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {/* INPUT PANEL */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
        >
          <Card hover={false}>
            <div className="p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-4">
                <div>
                  <div className="text-sm font-semibold text-white">Input</div>
                  <div className="mt-1 text-xs text-zinc-500">
                    Paste a snippet and click Analyze.
                  </div>
                </div>
                <div className="w-full max-w-[180px]">
                  <Select
                    label="Language"
                    value={language}
                    onChange={setLanguage}
                    options={[
                      { label: "JavaScript", value: "JavaScript" },
                      { label: "TypeScript", value: "TypeScript" },
                      { label: "Python", value: "Python" },
                      { label: "Java", value: "Java" },
                      { label: "C++", value: "C++" },
                      { label: "C#", value: "C#" },
                      { label: "Go", value: "Go" },
                      { label: "Rust", value: "Rust" },
                      { label: "PHP", value: "PHP" },
                      { label: "Ruby", value: "Ruby" },
                      { label: "Swift", value: "Swift" },
                      { label: "Kotlin", value: "Kotlin" },
                    ]}
                  />
                </div>
              </div>

              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
                placeholder={rotatingPlaceholder || "Paste your code here…"}
                className={[
                  "min-h-[360px] w-full resize-y rounded-xl border border-white/[0.06] bg-zinc-950/50",
                  "px-4 py-4 font-mono text-sm leading-relaxed text-zinc-200 placeholder-zinc-600",
                  "outline-none transition-all duration-200",
                  "focus:border-[rgba(var(--primary),0.4)] focus:ring-2 focus:ring-[rgba(var(--primary),0.1)]",
                  "cr-scrollbar",
                ].join(" ")}
              />

              <div className="mt-4 flex items-center justify-between">
                <div className="text-[11px] text-zinc-600">
                  {code.trim().split("\n").length} lines
                  {errorMsg && <span className="ml-3 text-red-500 font-medium">{errorMsg}</span>}
                </div>
                <Button
                  loading={loading}
                  loadingText="Analyzing…"
                  onClick={onAnalyze}
                  disabled={loading}
                >
                  Analyze Code
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* OUTPUT PANEL */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
        >
          <Card hover={false}>
            <div className="p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
                <div>
                  <div className="text-sm font-semibold text-white">Output</div>
                  <div className="mt-1 text-xs text-zinc-500">
                    Results appear with smooth transitions.
                  </div>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={onCopy}
                  disabled={loading || !hasAnyOutput}
                >
                  {copied ? "✓ Copied" : "Copy"}
                </Button>
              </div>

              <div className="mb-4">
                <Tabs value={tab} onChange={setTab} tabs={outputTabs} />
              </div>

              <div>
                {tab === "refined" && (
                  <motion.div
                    key="refined"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <CodePanel title="Refined Code" subtitle={language}>
                      {loading ? (
                        <Shimmer lines={8} />
                      ) : (
                        <pre className="max-h-[340px] overflow-auto text-sm leading-relaxed text-zinc-200 cr-scrollbar">
                          <code className="whitespace-pre">
                            {out.refined
                              ? typedRefined
                              : "Run Analyze Code to see refined code here."}
                          </code>
                        </pre>
                      )}
                    </CodePanel>
                  </motion.div>
                )}

                {tab === "explanation" && (
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
                      {loading ? (
                        <Shimmer lines={4} />
                      ) : (
                        <div className="max-h-[340px] overflow-auto text-sm leading-relaxed text-zinc-300 cr-scrollbar">
                          {out.explanation
                            ? typedExplanation
                            : "Run Analyze Code to see an explanation here."}
                        </div>
                      )}
                    </CodePanel>
                  </motion.div>
                )}

                {tab === "optimization" && (
                  <motion.div
                    key="optimization"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <CodePanel
                      title="Optimized Code"
                      subtitle="Performance improvements"
                    >
                      {loading ? (
                        <Shimmer lines={6} />
                      ) : (
                        <pre className="max-h-[340px] overflow-auto text-sm leading-relaxed text-zinc-200 cr-scrollbar">
                          <code className="whitespace-pre">
                            {out.optimized
                              ? typedOptimized
                              : "Run Analyze Code to see optimized code here."}
                          </code>
                        </pre>
                      )}
                    </CodePanel>
                  </motion.div>
                )}

                {tab === "complexity" && (
                  <motion.div
                    key="complexity"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <CodePanel
                      title="Time Complexity"
                      subtitle="Estimated runtime"
                    >
                      {loading ? (
                        <Shimmer lines={2} />
                      ) : (
                        <div className="text-sm leading-relaxed text-zinc-300">
                          {out.complexity
                            ? typedComplexity
                            : "Run Analyze Code to see time complexity here."}
                        </div>
                      )}
                    </CodePanel>
                  </motion.div>
                )}

                {tab === "bugs" && (
                  <motion.div
                    key="bugs"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <CodePanel
                      title="Bugs & Issues"
                      subtitle="Potential problems detected"
                    >
                      {loading ? (
                        <Shimmer lines={3} />
                      ) : (
                        <div className="text-sm leading-relaxed text-zinc-300">
                          {out.bugs
                            ? typedBugs
                            : "Run Analyze Code to see detected issues here."}
                        </div>
                      )}
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
        transition={{ delay: 0.3 }}
      >
        CodeRefiner AI — Powered by advanced language models
      </motion.footer>
    </motion.main>
  );
}
