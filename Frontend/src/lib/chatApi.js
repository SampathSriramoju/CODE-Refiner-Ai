/**
 * Chat API module — OpenAI-ready structure.
 *
 * Currently uses dummy responses. To connect to OpenAI:
 * 1. Set VITE_OPENAI_API_KEY in your .env
 * 2. Uncomment the `callOpenAI` function below
 * 3. Replace `getResponse` with `callOpenAI`
 */

export async function getAIResponse(message, conversationHistory = []) {
  try {
    const response = await fetch("http://localhost:5000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message,
        history: conversationHistory
      })
    });

    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error("Chat API Error:", error);
    throw error;
  }
}

/*
 * ─────────────────────────────────────────────
 * OpenAI Integration (uncomment when ready)
 * ─────────────────────────────────────────────
 *
 * async function callOpenAI(message, conversationHistory) {
 *   const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
 *   if (!apiKey) throw new Error("Missing VITE_OPENAI_API_KEY");
 *
 *   const messages = [
 *     { role: "system", content: "You are a helpful coding assistant for CodeRefiner AI." },
 *     ...conversationHistory.map((m) => ({
 *       role: m.role === "user" ? "user" : "assistant",
 *       content: m.text,
 *     })),
 *     { role: "user", content: message },
 *   ];
 *
 *   const res = await fetch("https://api.openai.com/v1/chat/completions", {
 *     method: "POST",
 *     headers: {
 *       "Content-Type": "application/json",
 *       Authorization: `Bearer ${apiKey}`,
 *     },
 *     body: JSON.stringify({
 *       model: "gpt-3.5-turbo",
 *       messages,
 *       max_tokens: 500,
 *       temperature: 0.7,
 *     }),
 *   });
 *
 *   if (!res.ok) throw new Error(`OpenAI error: ${res.status}`);
 *   const data = await res.json();
 *   return data.choices[0]?.message?.content ?? "Sorry, I couldn't generate a response.";
 * }
 */
