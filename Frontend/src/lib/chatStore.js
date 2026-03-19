/**
 * Chat store — persists conversation history to localStorage.
 */

const CHAT_KEY = "coderefiner.chat.v1";

export function loadMessages() {
  try {
    const raw = window.localStorage.getItem(CHAT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveMessages(messages) {
  try {
    // Keep last 100 messages to avoid localStorage bloat
    const trimmed = messages.slice(-100);
    window.localStorage.setItem(CHAT_KEY, JSON.stringify(trimmed));
  } catch {
    // ignore
  }
}

export function clearMessages() {
  try {
    window.localStorage.removeItem(CHAT_KEY);
  } catch {
    // ignore
  }
}
