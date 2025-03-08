// Configuration file for API keys and other environment variables

// Replace with your actual Gemini API key
export const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "YOUR_GEMINI_API_KEY";

// API URLs
export const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

// Other configuration options
export const APP_CONFIG = {
  appName: "AI Resume Builder",
  version: "1.0.0",
  maxFileSize: 5 * 1024 * 1024, // 5MB
  supportedImageFormats: [".jpg", ".jpeg", ".png"],
  defaultTemplate: "modern"
}; 