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
    const { questions, answers, techstack, level, role } = body;

    if (!questions || questions.length === 0) {
      return Response.json(
        { success: false, error: "Questions are required" },
        { status: 400 }
      );
    }

    const qaPairs = questions.map((q, i) => {
      const answer = (answers && answers[i]) ? answers[i].trim() : ""
      const display = answer || "(No answer provided by candidate)"
      return `Question ${i + 1}: ${q}\nAnswer ${i + 1}: ${display}`;
    }).join("\n\n");

    const hasEmptyAnswers = questions.some((_, i) => !answers?.[i]?.trim())

    const prompt = [
      "You are a senior technical interviewer analyzing a mock interview.",
      `Role: ${role || "Software Engineer"}`,
      `Topic: ${techstack || "General"}`,
      `Difficulty: ${level || "Medium"}`,
      "",
      "Below are the interview questions and the candidate's answers. Analyze each Q&A pair and provide structured feedback.",
      "",
      qaPairs,
      "",
      "CRITICAL RULE: The `userAnswer` field in the JSON must contain the EXACT text of the candidate's answer as shown above.",
      hasEmptyAnswers ? "If the answer says '(No answer provided by candidate)', set `userAnswer` to an empty string `\"\"`. Do NOT fabricate, infer, or generate a fake answer." : "",
      "Do NOT write the answer for the candidate. Only analyze what they actually said.",
      "",
      `Return ONLY a valid JSON object (no markdown, no code fences) with this exact structure:
{
  "questionFeedback": [
    {
      "question": "The exact question text",
      "userAnswer": "The candidate's EXACT answer or empty string if none provided",
      "score": <0-100>,
      "aiFeedback": "Detailed feedback on the answer quality",
      "correctApproach": "What a good answer should have covered",
      "improvement": "Specific suggestion for improvement"
    }
  ],
  "overallScore": <0-100>,
  "scores": {
    "communication": <0-100>,
    "technical": <0-100>,
    "confidence": <0-100>,
    "problemSolving": <0-100>,
    "speakingSpeed": <0-100>,
    "eyeContact": <0-100>
  },
  "feedback": "Overall interview summary feedback string",
  "strengths": ["strength1", "strength2", "strength3"],
  "weaknesses": ["weakness1", "weakness2", "weakness3"],
  "aiSuggestions": ["suggestion1", "suggestion2", "suggestion3"],
  "recommendedTopics": [
    { "name": "Topic name", "priority": "High|Medium|Low" }
  ],
  "skillBreakdown": [
    { "name": "Skill name", "score": <0-100>, "readiness": <0-100>, "improvement": "How to improve", "trend": "up|down|stable" }
  ]
}`,
    ].join("\n");

    const completion = await openai.chat.completions.create({
      model: "openrouter/free",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const text = completion.choices[0].message.content.trim();

    if (!text) {
      return Response.json(
        { success: false, error: "AI returned empty response" },
        { status: 502 }
      );
    }

    let result;
    try {
      result = JSON.parse(text);
    } catch {
      return Response.json(
        { success: false, error: "Failed to parse AI response" },
        { status: 502 }
      );
    }

    return Response.json({ success: true, ...result });
  } catch (error) {
    const message = error.message || "Unknown server error";
    console.error("[interview/analyze] Error:", message);

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

    return Response.json({ success: false, error: message }, { status: 500 });
  }
}
