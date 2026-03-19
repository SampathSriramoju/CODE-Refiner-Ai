require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const crypto = require('crypto');
const API_CONFIG = require('./api-config.js');

const app = express();
const PORT = process.env.PORT || 5000;

// Validate primary API key
const PRIMARY_KEY = API_CONFIG.primary.apiKey;
if (!PRIMARY_KEY || PRIMARY_KEY === 'MISSING_API_KEY') {
  console.warn("==> WARNING: Primary GEMINI_API_KEY is missing! Backend will fail until provided.");
}

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(PRIMARY_KEY || 'dummy_key');
const backupGenAIs = (API_CONFIG.backups || []).map(config => ({
  genAI: new GoogleGenerativeAI(config.apiKey),
  model: config.model
}));

// Rate limiting and caching
const requestCache = new Map();
const requestQueue = [];
let isProcessingQueue = false;
const MAX_CACHE_SIZE = 100;
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());

// Rate limiting and caching utilities
function getCacheKey(code, language, type) {
  const hash = crypto.createHash('sha256').update(`${code}:${language}:${type}`).digest('hex');
  return hash;
}

function getFromCache(key) {
  const cached = requestCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  if (cached) {
    requestCache.delete(key);
  }
  return null;
}

function setCache(key, data) {
  if (requestCache.size >= MAX_CACHE_SIZE) {
    const firstKey = requestCache.keys().next().value;
    requestCache.delete(firstKey);
  }
  requestCache.set(key, { data, timestamp: Date.now() });
}

async function handleRateLimitError(error, retryDelay) {
  if (error.status === 429 && (error.message.includes('quota exceeded') || error.message.includes('rate limit'))) {
    console.log(`==> Rate limit exceeded. Waiting ${retryDelay}ms before retry...`);
    await new Promise(resolve => setTimeout(resolve, retryDelay));
    return true;
  }
  return false;
}

function getModelWithFallback() {
  const models = [
    { genAI, model: API_CONFIG.primary.model },
    ...backupGenAIs
  ];
  
  return models;
}

async function callWithFallback(prompt, options = {}) {
  const models = getModelWithFallback();
  let lastError;
  
  // First check if we have any valid keys
  const hasValidKeys = models.some(m => m.genAI && m.genAI.apiKey && m.genAI.apiKey !== 'dummy_key');
  if (!hasValidKeys) {
    throw new Error("Missing GEMINI_API_KEY. Please set it in your environment variables.");
  }
  
  for (let i = 0; i < models.length; i++) {
    try {
      const { genAI: currentGenAI, model: modelName } = models[i];
      if (!currentGenAI || !currentGenAI.apiKey || currentGenAI.apiKey === 'dummy_key') continue;

      console.log(`==> Trying model: ${modelName} (${i === 0 ? 'primary' : `backup ${i}`})`);
      
      const model = currentGenAI.getGenerativeModel({ 
        model: modelName,
        ...options
      });
      
      const result = await model.generateContent(prompt);
      console.log(`==> Success with model: ${modelName}`);
      return result;
    } catch (error) {
      console.log(`==> Failed with model ${models[i].model}:`, error.message);
      
      // Categorize common API key errors
      if (error.status === 401 || error.message.includes('API_KEY_INVALID') || error.message.includes('expired')) {
        error.isApiKeyError = true;
        error.message = "The provided API key is invalid or has expired. Please check your credentials.";
      } else if (error.status === 403) {
        error.isApiKeyError = true;
        error.message = "API key permissions error. Ensure your key is valid for Gemini services.";
      }
      
      lastError = error;
      
      // If this is an API key error, don't necessarily give up if we have backups, 
      // but if it's the only key or all fail, the loop will handle it.
      if ((error.status === 429 || error.isApiKeyError) && i < models.length - 1) {
        continue;
      }
    }
  }
  
  throw lastError;
}

async function processQueue() {
  if (isProcessingQueue || requestQueue.length === 0) return;
  
  isProcessingQueue = true;
  
  while (requestQueue.length > 0) {
    const { resolve, reject, fn } = requestQueue.shift();
    try {
      const result = await fn();
      resolve(result);
    } catch (error) {
      const shouldRetry = await handleRateLimitError(error, 45000); // 45 seconds
      if (shouldRetry) {
        requestQueue.unshift({ resolve, reject, fn });
      } else {
        reject(error);
      }
    }
  }
  
  isProcessingQueue = false;
}

function queueRequest(fn) {
  return new Promise((resolve, reject) => {
    requestQueue.push({ resolve, reject, fn });
    processQueue();
  });
}

// Basic route
app.get('/', (req, res) => {
  res.send('Server running');
});

// Code analysis route using Gemini AI
app.post('/analyze', async (req, res) => {
  console.log("==> Incoming Request Body:", req.body);
  const { code, language } = req.body;

  if (!code) {
    console.error("==> Error: Missing code field in request");
    return res.status(400).json({ error: 'Code is required for analysis.' });
  }

  // Check cache first
  const cacheKey = getCacheKey(code, language, 'analyze');
  const cachedResult = getFromCache(cacheKey);
  if (cachedResult) {
    console.log("==> Serving from cache");
    return res.json(cachedResult);
  }

  try {
    const result = await queueRequest(async () => {
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
        console.log(`==> Calling AI (Attempt ${attempts} / 2)...`);
        
        const result = await callWithFallback(currentPrompt, {
          generationConfig: {
            responseMimeType: "application/json",
          }
        });
        
        let responseText = result.response.text();
        
        // Clean up markdown formatting if the model hallucinates it
        responseText = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();

        try {
          jsonParsed = JSON.parse(responseText);
        } catch (parseError) {
          console.error("==> JSON Parse Error processing AI response:", parseError);
          console.error("==> Raw response was:", responseText);
          // Fallback to ensuring it doesn't crash if it fails to parse after cleanup
          throw new Error("Failed to parse AI response as JSON");
        }

        const cleanOptimized = (jsonParsed.optimized || "").trim();
        const cleanInput = code.trim();

        // If it returned the identical code, force a retry with an aggressive hint
        if (cleanOptimized === cleanInput && attempts === 1) {
          console.log("==> AI returned the exact same code as optimized. Retrying...");
          currentPrompt = basePrompt + "\n\nCRITICAL FEEDBACK: In your previous attempt, you returned the exact same code! You MUST find a way to optimize the logic, reduce operations, or use a better data structure. If it is mathematically impossible to optimize further, explicitly explain why in the explanation.";
          continue;
        }
        
        break;
      }
      
      return jsonParsed;
    });

    // Cache the result
    setCache(cacheKey, result);
    
    console.log("==> Successfully generated AI Response. Sending it to frontend...");
    res.json(result);
  } catch (error) {
    console.error('==> Error during AI code analysis:', error);
    
    // Handle rate limit errors with user-friendly message
    if (error.status === 429 && error.message.includes('quota exceeded')) {
      return res.status(429).json({ 
        error: 'API quota exceeded. Please try again in a few minutes.',
        retryAfter: '45 seconds',
        isRateLimit: true
      });
    }
    
    res.status(500).json({ error: `Backend API Error: ${error.message}` });
  }
});

// Chat route using Gemini
app.post('/chat', async (req, res) => {
  const { message, history } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message field is required.' });
  }

  // Check cache first (for simple messages without history)
  const cacheKey = getCacheKey(message, JSON.stringify(history || []), 'chat');
  const cachedResult = getFromCache(cacheKey);
  if (cachedResult && (!history || history.length === 0)) {
    console.log("==> Serving chat from cache");
    return res.json(cachedResult);
  }

  try {
    const result = await queueRequest(async () => {
      const result = await callWithFallback(message, {
        systemInstruction: "You are the floating AI coding assistant for CodeRefiner AI. Be concise, helpful, and friendly. Answer programming questions expertly."
      });
      
      const responseText = result.response.text();
      return { response: responseText };
    });

    // Cache only simple messages without history
    if (!history || history.length === 0) {
      setCache(cacheKey, result);
    }

    res.json(result);
  } catch (error) {
    console.error('Error during AI chat:', error);
    
    // Handle rate limit errors with user-friendly message
    if (error.status === 429 && error.message.includes('quota exceeded')) {
      return res.status(429).json({ 
        error: 'API quota exceeded. Please try again in a few minutes.',
        retryAfter: '45 seconds',
        isRateLimit: true
      });
    }
    
    res.status(500).json({ error: `Backend Chat Error: ${error.message}` });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
