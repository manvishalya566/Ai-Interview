import { getClient } from "@/lib/openrouter";

export async function POST(req) {
  try {
    const openai = getClient();
    if (!openai) {
      return Response.json(
        { success: false, error: "AI service not configured" },
        { status: 503 }
      );
    }

    const body = await req.json();
    const { resumeText } = body;

    const prompt = [
      "You are a senior technical interviewer.",
      `Generate exactly 10 unique interview questions based on this resume:`,
      "",
      resumeText,
      "",
      "Return exactly 10 questions, numbered 1 to 10.",
      "Format each line as: 1. Question text here",
      "Be specific, technical, and relevant to the candidate's experience.",
    ].join("\n");

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

    const questions = text.split("\n")
      .map(l => l.trim())
      .filter(l => l.length > 10)
      .map(l => l.replace(/^\d+[\.\)][\s\t]*/, "").replace(/^["'\s]+|["'\s]+$/g, "").trim())
      .filter(Boolean);

    return Response.json({ success: true, questions });
  } catch (error) {
    console.error("[interview/generate] Error:", error.message);
    const isQuotaError =
      error.message.includes("429") ||
      error.message.includes("quota") ||
      error.message.includes("Quota exceeded") ||
      error.message.includes("RATE_LIMIT");

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

    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
