import OpenAI from "openai";

let client = null;

export function getClient() {
  if (client) return client;

  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    console.error("[openrouter] MISSING OPENROUTER_API_KEY in environment variables");
    return null;
  }

  try {
    client = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey,
      defaultHeaders: {
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        "X-OpenRouter-Title": "AI Mock Interview",
      },
    });
    console.log("[openrouter] Client initialized successfully");
    return client;
  } catch (err) {
    console.error("[openrouter] Initialization failed:", err.message);
    return null;
  }
}

export function resetClient() {
  client = null;
  console.log("[openrouter] Client reset");
}

export default getClient;
