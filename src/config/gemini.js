import { GoogleGenerativeAI } from '@google/generative-ai';
import { CELEBAI_SYSTEM_INSTRUCTION } from '../utils/prompts';

const API_KEY_STORAGE_KEY = 'celebai_gemini_api_key';

export function getStoredApiKey() {
  const envKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (envKey && envKey.trim() !== '' && !envKey.includes('your_gemini_api_key')) {
    return envKey.trim();
  }
  return localStorage.getItem(API_KEY_STORAGE_KEY) || '';
}

export function saveStoredApiKey(key) {
  if (key && key.trim()) {
    localStorage.setItem(API_KEY_STORAGE_KEY, key.trim());
  } else {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
  }
}

export function hasConfiguredApiKey() {
  const key = getStoredApiKey();
  return Boolean(key && key.length > 5);
}

/**
 * Initializes and invokes Gemini 2.5 Flash
 */
export async function generateWithGemini(promptText, onChunk = null) {
  const apiKey = getStoredApiKey();
  if (!apiKey) {
    throw new Error('MISSING_API_KEY');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  
  const candidateModels = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
  let lastError = null;

  for (const modelName of candidateModels) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: CELEBAI_SYSTEM_INSTRUCTION,
        generationConfig: {
          temperature: 0.7,
          topP: 0.9,
          maxOutputTokens: 8192,
        },
      });

      if (onChunk && typeof onChunk === 'function') {
        const responseStream = await model.generateContentStream(promptText);
        let accumulatedText = '';
        for await (const chunk of responseStream.stream) {
          const text = chunk.text();
          accumulatedText += text;
          onChunk(text, accumulatedText);
        }
        return accumulatedText;
      } else {
        const result = await model.generateContent(promptText);
        return result.response.text();
      }
    } catch (error) {
      console.warn(`Gemini model ${modelName} failed, trying next candidate:`, error.message);
      lastError = error;
      if (error.message?.includes('API_KEY_INVALID') || error.status === 400 && error.message?.includes('API key')) {
        throw new Error('INVALID_API_KEY');
      }
      if (error.status === 429 || error.message?.includes('RESOURCE_EXHAUSTED')) {
        throw new Error('RATE_LIMIT');
      }
    }
  }

  throw lastError || new Error('All Gemini model candidates failed.');
}
