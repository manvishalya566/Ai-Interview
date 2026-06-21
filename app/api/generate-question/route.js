import { getClient } from "@/lib/openrouter";

const topicLabels = {
  dsa: "Data Structures & Algorithms",
  react: "React.js (hooks, state, lifecycle, optimization)",
  "system-design": "System Design (distributed systems, scalability)",
  backend: "Backend (APIs, databases, server architecture)",
  hr: "Behavioral / HR (STAR method, leadership, conflict)",
  dbms: "Database Management (SQL, NoSQL, indexing, normalization)",
  oops: "OOP (design patterns, SOLID, inheritance, polymorphism)",
};

function parseQuestionList(text, expectedCount) {
  const lines = text.split("\n")
    .map(l => l.trim())
    .filter(l => l.length > 0);

  const questions = [];

  for (const line of lines) {
    const match = line.match(/^\d+[\.\)][\s\t]*["']?(.+?)["']?\s*$/);
    if (match) {
      const q = match[1]
        .replace(/^["'\s]+|["'\s]+$/g, "")
        .trim();
      if (q.length > 10) questions.push(q);
    }
  }

  if (questions.length === 0) {
    const blocks = text.split(/\n\s*\n/)
      .map(b => b.replace(/^["'\s]+|["'\s]+$/g, "").trim())
      .filter(b => b.length > 10);
    questions.push(...blocks);
  }

  return questions.slice(0, expectedCount);
}

export async function POST(req) {
  try {
    const openai = getClient();
    if (!openai) {
      return Response.json(
        { success: false, error: "AI service is not configured" },
        { status: 503 }
      );
    }

    let body;
    try {
      body = await req.json();
    } catch {
      return Response.json(
        { success: false, error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const { role, techstack, level, count = 3, previousQuestions = [] } = body;

    if (!role || !techstack || !level) {
      return Response.json(
        { success: false, error: "Missing required fields: role, techstack, level" },
        { status: 400 }
      );
    }

    const topicDesc = topicLabels[techstack] || techstack;
    const prevList = Array.isArray(previousQuestions)
      ? previousQuestions.filter(q => typeof q === "string" && q.trim().length > 0)
      : [];

    const countNum = Math.min(Math.max(1, Number(count) || 3), 5);

    const prompt = [
      `You are a senior interviewer. Generate ${countNum} ${level}-difficulty ${topicDesc} interview questions for a ${role}.`,
      "Rules: concise, specific, technical, no repetition.",
      prevList.length > 0 ? `Avoid: ${prevList.slice(0, 5).join(" | ")}` : "",
      `Return exactly ${countNum} questions numbered 1-${countNum}. One per line.`,
    ].filter(Boolean).join("\n");

    const completion = await openai.chat.completions.create({
      model: "openrouter/free",
      messages: [{ role: "user", content: prompt }],
    });
    const text = completion.choices[0].message.content.trim();

    if (!text) {
      return Response.json(
        { success: false, error: "AI returned empty response" },
        { status: 502 }
      );
    }

    const questions = parseQuestionList(text, countNum);

    if (questions.length === 0) {
      return Response.json(
        { success: false, error: "Could not parse questions from AI response" },
        { status: 502 }
      );
    }

    return Response.json({ success: true, questions });
  } catch (error) {
    const message = error.message || "Unknown server error";
  console.error("Error generating questions:", message);
    const isQuotaError =
      message.includes("429") ||
      message.includes("Too Many Requests") ||
      message.includes("Quota exceeded") ||
      message.includes("quota") ||
      message.includes("RATE_LIMIT");

    if (isQuotaError) {
      return Response.json(
        {
          success: false,
          error: "API quota exceeded. Please wait 60 seconds before retrying.",
          retryAfter: 60,
        },
        { status: 429 }
      );
    }

    if (error.name === "FetchError" || error.name === "AbortError") {
      return Response.json(
        { success: false, error: "AI service timed out. Please try again." },
        { status: 504 }
      );
    }

    return Response.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
