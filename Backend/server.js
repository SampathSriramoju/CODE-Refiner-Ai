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

// Code analysis route using Gemini
app.post('/analyze', async (req, res) => {
  console.log("==> Incoming Request Body:", req.body);
  const { code, language } = req.body;

  if (!code) {
    console.error("==> Error: Missing code field in request");
    return res.status(400).json({ error: 'Code is required for analysis.' });
  }

  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const basePrompt = `You are a highly experienced software engineer and performance optimization expert.

Analyze the following code deeply written in ${language || 'an unspecified language'}.

Your tasks:

1. Provide a REFINED version:
   - Clean formatting
   - Better readability

2. Provide an OPTIMIZED version:
   - Improve logic
   - Reduce time complexity if possible
   - Use better algorithms or data structures
   - Remove unnecessary loops or operations

3. Explain:
   - What was inefficient
   - What you improved
   - Why the new version is better

4. Provide TIME COMPLEXITY:
   - Original complexity
   - Optimized complexity

5. Detect BUGS:
   - Logical issues
   - Edge cases

-----------------------------------
IMPORTANT RULES:

- DO NOT return same code as optimized
- MUST change logic if inefficiency exists
- MUST explain WHY optimization was done
- MUST compare before vs after
- If optimization is not significant, YOU MUST suggest a fundamentally better algorithm or approach in your optimized code and explain it.
-----------------------------------

RESPONSE FORMAT (STRICT JSON):
{
  "refined": "[Only the refined code here, no markdown wrappers]",
  "optimized": "[Only the optimized code here, no markdown wrappers]",
  "explanation": "[Explanation of improvements]",
  "complexity": "Original: O(...), Optimized: O(...)",
  "bugs": "[List of detected issues]"
}

CODE:
${code}`;

    let jsonParsed;
    let attempts = 0;
    let currentPrompt = basePrompt;

    while (attempts < 2) {
      attempts++;
      const result = await model.generateContent(currentPrompt);
      const responseText = result.response.text();
      
      jsonParsed = JSON.parse(responseText);

      const cleanOptimized = (jsonParsed.optimized || "").trim();
      const cleanInput = code.trim();

      // If it returned the identical code, force a retry with an aggressive hint
      if (cleanOptimized === cleanInput && attempts === 1) {
        console.log("==> AI returned the exact same code as optimized. Retrying...");
        currentPrompt = basePrompt + "\n\nCRITICAL FEEDBACK: In your previous attempt, you returned the exact same code! You MUST find a way to optimize the logic, reduce operations, or use a better data structure. If it is mathematically impossible to optimize further, explicitly explain why in the explanation.";
        continue;
      }
      
      // Successfully generated or max attempts reached
      break;
    }
    
    console.log("==> AI Response computed:", JSON.stringify({ ...jsonParsed, refined: "...", optimized: "..." }, null, 2));
    console.log("==> Successfully generated AI Response. Sending it to frontend...");
    res.json(jsonParsed);
  } catch (error) {
    console.error('Error during AI code analysis:', error);
    res.status(500).json({ error: 'Failed to process code analysis. Please check server logs or API key.' });
  }
});

// Code analysis route using Gemini
// ...

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
