// API Configuration for handling multiple API keys and models
const API_CONFIG = {
  // Primary API configuration
  primary: {
    apiKey: process.env.GEMINI_API_KEY,
    model: "gemini-2.5-flash"
  },
  
  // Backup API configurations (optional)
  backups: [
    {
      apiKey: process.env.GEMINI_API_KEY_BACKUP_1,
      model: "gemini-2.5-flash"
    },
    {
      apiKey: process.env.GEMINI_API_KEY_BACKUP_2, 
      model: "gemini-1.5-flash"
    }
  ].filter(config => config.apiKey), // Filter out undefined keys
  
  // Rate limiting settings
  rateLimit: {
    maxRequestsPerMinute: 15, // Conservative limit for free tier
    retryDelay: 45000, // 45 seconds
    maxRetries: 3
  }
};

module.exports = API_CONFIG;
