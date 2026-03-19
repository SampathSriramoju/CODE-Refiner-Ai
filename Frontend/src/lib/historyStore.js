const KEY = "coderefiner.history.v1";

export function loadHistory() {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveHistory(items) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}

export function addHistoryItem(item) {
  const items = loadHistory();
  const next = [item, ...items].slice(0, 50);
  saveHistory(next);
  return next;
}

export function getHistoryItem(id) {
  return loadHistory().find((x) => x?.id === id) ?? null;
}

