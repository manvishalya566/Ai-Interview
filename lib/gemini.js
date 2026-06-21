import { GoogleGenerativeAI } from "@google/generative-ai";

let genAIInstance = null;
let modelInstance = null;

export function getModel() {
  if (modelInstance) return modelInstance;

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error("[gemini] MISSING GEMINI_API_KEY in environment variables");
    return null;
  }

  if (!apiKey.startsWith("AIza")) {
    console.error("[gemini] GEMINI_API_KEY appears invalid (should start with 'AIza')");
    return null;
  }

  try {
    genAIInstance = new GoogleGenerativeAI(apiKey);
    modelInstance = genAIInstance.getGenerativeModel({ model: "gemini-2.0-flash" });
    console.log("[gemini] Model initialized successfully");
    return modelInstance;
  } catch (err) {
    console.error("[gemini] Initialization failed:", err.message);
    return null;
  }
}

export function resetModel() {
  modelInstance = null;
  genAIInstance = null;
  console.log("[gemini] Model reset - next call will reinitialize");
}