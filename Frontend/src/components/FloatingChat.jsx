import React, { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { loadMessages, saveMessages, clearMessages } from "../lib/chatStore.js";
import { getAIResponse } from "../lib/chatApi.js";

/* ──── Icons ──── */

function ChatIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

/* ──── Typing dots animation ──── */

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="h-2 w-2 rounded-full bg-zinc-400 dark:bg-zinc-500"
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -4, 0] }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* ──── Single message bubble ──── */

function MessageBubble({ message, isLast }) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={[
          "max-w-[85%] rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed",
          isUser
            ? "bg-[rgb(var(--primary))] text-white rounded-br-md"
            : "bg-zinc-100 text-zinc-800 dark:bg-white/[0.08] dark:text-zinc-200 rounded-bl-md",
        ].join(" ")}
      >
        {message.text}
      </div>
    </motion.div>
  );
}

/* ──── Main FloatingChat component ──── */

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => loadMessages());
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatBodyRef = useRef(null);

  // Auto-scroll to latest message
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Persist messages
  useEffect(() => {
    saveMessages(messages);
  }, [messages]);

  async function handleSend() {
    const text = input.trim();
    if (!text || isTyping) return;

    const userMsg = {
      id: Date.now().toString(),
      role: "user",
      text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await getAIResponse(text, messages);
      const botMsg = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        text: response,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      const errorMsg = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        text: "Sorry, something went wrong. Please try again.",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleClear() {
    setMessages([]);
    clearMessages();
  }

  return (
    <>
      {/* ── Floating Trigger Button ── */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            onClick={() => setIsOpen(true)}
            className={[
              "fixed bottom-6 right-6 z-50",
              "flex h-14 w-14 items-center justify-center rounded-full",
              "bg-[rgb(var(--primary))] text-white shadow-lg",
              "hover:shadow-xl hover:scale-105 active:scale-95",
              "transition-shadow duration-200",
            ].join(" ")}
            aria-label="Open AI assistant"
          >
            <ChatIcon />
            {/* Notification dot when there are messages */}
            {messages.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[rgb(var(--accent))] opacity-40" />
                <span className="relative inline-flex h-4 w-4 rounded-full bg-[rgb(var(--accent))]" />
              </span>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Chat Window ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className={[
              "fixed bottom-6 right-6 z-50",
              "flex flex-col",
              "w-[380px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-4rem)]",
              "rounded-2xl overflow-hidden",
              "border border-zinc-200 dark:border-white/[0.08]",
              "bg-white dark:bg-zinc-900",
              "shadow-2xl dark:shadow-[0_24px_80px_rgba(0,0,0,0.5)]",
            ].join(" ")}
          >
            {/* ── Header ── */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-100 dark:border-white/[0.06] bg-zinc-50/80 dark:bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[rgb(var(--primary))] text-white">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 18 22 12 16 6" />
                    <polyline points="8 6 2 12 8 18" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-semibold text-zinc-900 dark:text-white">
                    CodeRefiner AI
                  </div>
                  <div className="text-[11px] text-zinc-400 dark:text-zinc-500">
                    {isTyping ? "Typing…" : "Online"}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <button
                    onClick={handleClear}
                    className="rounded-lg p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/[0.06] transition-colors"
                    title="Clear conversation"
                  >
                    <TrashIcon />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/[0.06] transition-colors"
                  aria-label="Close chat"
                >
                  <CloseIcon />
                </button>
              </div>
            </div>

            {/* ── Messages Area ── */}
            <div
              ref={chatBodyRef}
              className="flex-1 overflow-y-auto px-4 py-4 space-y-3 cr-scrollbar"
            >
              {messages.length === 0 && !isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-full text-center px-4"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(var(--primary),0.1)] mb-4">
                    <ChatIcon />
                  </div>
                  <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    How can I help you?
                  </div>
                  <div className="text-xs text-zinc-400 dark:text-zinc-500 max-w-[240px]">
                    Ask me about code optimization, debugging, refactoring, or any coding question.
                  </div>
                  {/* Quick starters */}
                  <div className="mt-4 flex flex-wrap gap-2 justify-center">
                    {["Explain a bug", "Optimize my code", "Best practices"].map((q) => (
                      <button
                        key={q}
                        onClick={() => {
                          setInput(q);
                          inputRef.current?.focus();
                        }}
                        className="rounded-full border border-zinc-200 dark:border-white/[0.08] bg-zinc-50 dark:bg-white/[0.04] px-3 py-1.5 text-[11px] font-medium text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/[0.08] transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}

              {isTyping && <TypingIndicator />}

              <div ref={messagesEndRef} />
            </div>

            {/* ── Input Area ── */}
            <div className="border-t border-zinc-100 dark:border-white/[0.06] px-4 py-3 bg-zinc-50/50 dark:bg-white/[0.01]">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything…"
                  disabled={isTyping}
                  className={[
                    "flex-1 h-10 rounded-xl px-4 text-sm",
                    "bg-white dark:bg-white/[0.05]",
                    "border border-zinc-200 dark:border-white/[0.08]",
                    "text-zinc-800 dark:text-zinc-200",
                    "placeholder-zinc-400 dark:placeholder-zinc-500",
                    "outline-none transition-all duration-200",
                    "focus:border-[rgba(var(--primary),0.5)] focus:ring-2 focus:ring-[rgba(var(--primary),0.12)]",
                    "disabled:opacity-50",
                  ].join(" ")}
                />
                <motion.button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={[
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                    "bg-[rgb(var(--primary))] text-white",
                    "disabled:opacity-40 disabled:cursor-not-allowed",
                    "transition-opacity duration-200",
                  ].join(" ")}
                  aria-label="Send message"
                >
                  <SendIcon />
                </motion.button>
              </div>
              <div className="mt-2 text-center text-[10px] text-zinc-400 dark:text-zinc-600">
                AI responses are simulated · <button onClick={handleClear} className="hover:text-zinc-500 dark:hover:text-zinc-400 underline transition-colors">Clear history</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
