import { GEMINI_API_KEY, GEMINI_API_URL } from '../config';

/**
 * Generates a unique ID
 */
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

/**
 * Formats a date string to a more readable format
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });
};

/**
 * Saves resume data to local storage
 */
export const saveToLocalStorage = (key: string, data: any): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

/**
 * Retrieves resume data from local storage
 */
export const getFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error getting from localStorage:', error);
    return defaultValue;
  }
};

/**
 * Enhances text using Gemini API
 */
export const enhanceTextWithAI = async (text: string, type: string): Promise<string> => {
  // If no API key is provided, return a placeholder enhancement
  if (GEMINI_API_KEY === "YOUR_GEMINI_API_KEY") {
    console.warn("No Gemini API key provided. Using placeholder enhancement.");
    return `${text} [Enhanced with AI]`;
  }
  
  try {
    // Create appropriate prompts based on the type of content
    let prompt = "";
    
    switch (type) {
      case 'summary':
        prompt = `Improve this professional summary to be more impactful and concise, highlighting key strengths: "${text}"`;
        break;
      case 'experience':
        prompt = `Enhance this job description to be more achievement-oriented and impactful, using strong action verbs: "${text}"`;
        break;
      case 'project':
        prompt = `Improve this project description to highlight technical skills and achievements: "${text}"`;
        break;
      default:
        prompt = `Improve this text to be more professional and impactful: "${text}"`;
    }
    
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      }),
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    // Extract the enhanced text from the response
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
      const enhancedText = data.candidates[0].content.parts[0].text;
      return enhancedText.trim();
    }
    
    throw new Error('Unexpected API response format');
  } catch (error) {
    console.error('Error enhancing text with AI:', error);
    return text; // Return original text if enhancement fails
  }
}; 