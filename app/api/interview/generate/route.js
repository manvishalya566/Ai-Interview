import { model } from "@/lib/gemini";

export async function POST(req) {
  try {

    const body = await req.json();

    const { resumeText } = body;

    const prompt = `
    Generate 10 interview questions
    based on this resume:

    ${resumeText}
    `;

    const result = await model.generateContent(prompt);

    const response = result.response.text();

    return Response.json({
      success: true,
      questions: response,
    });

  } catch (error) {

    return Response.json({
      success: false,
      error: error.message,
    });

  }
}