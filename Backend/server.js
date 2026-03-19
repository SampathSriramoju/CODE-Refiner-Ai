require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'MISSING_API_KEY');

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.send('Server running');
});

// Code analysis route using Mock Response
app.post("/analyze", async (req, res) => {
  try {
    const { code, language } = req.body;

    if (!code) {
      return res.status(400).json({ error: "Code is required" });
    }

    console.log("Request received:", req.body);
    console.log("Processing code...");

    // MOCK RESPONSE (or AI)
    const response = {
      refined: "// improved code\n" + code,
      explanation: "Code improved for readability",
      optimized: "// optimized code\n" + code,
      complexity: "O(n)",
      bugs: "No major bugs"
    };

    console.log("Sending response:", response);

    res.json(response);

  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Chat route using Gemini
app.post('/chat', async (req, res) => {
  const { message, history } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message field is required.' });
  }

  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      systemInstruction: "You are the floating AI coding assistant for CodeRefiner AI. Be concise, helpful, and friendly. Answer programming questions expertly."
    });

    const formattedHistory = (history || []).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text || '' }]
    }));

    const chat = model.startChat({
      history: formattedHistory
    });

    const result = await chat.sendMessage(message);
    const responseText = result.response.text();

    res.json({ response: responseText });
  } catch (error) {
    console.error('Error during AI chat:', error);
    res.status(500).json({ error: 'Failed to generate chat response.' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
