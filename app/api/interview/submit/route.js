import { connectDB } from "@/lib/mongodb";
import Interview from "@/models/Interview";
import { authMiddleware } from "@/middleware/authMiddleware";

export async function POST(req) {
  try {
    const authResult = await authMiddleware(req);
    if (!authResult.success) {
      return Response.json({ success: false, message: authResult.message }, { status: 401 });
    }

    await connectDB();

    const body = await req.json();
    const {
      questions, answers, scores, overallScore, feedback, skillsAssessed,
      duration, type, company, role, difficulty, questionFeedback,
      strengths, weaknesses, aiSuggestions, recommendedTopics,
      skillBreakdown, status,
    } = body;

    const interview = await Interview.create({
      userId: authResult.userId,
      questions: questions || [],
      answers: answers || [],
      scores: scores || {},
      overallScore,
      feedback,
      skillsAssessed: skillsAssessed || [],
      duration,
      type: type || "Technical",
      company: company || "General",
      role: role || "Software Engineer",
      difficulty: difficulty || "Medium",
      questionFeedback: questionFeedback || [],
      strengths: strengths || [],
      weaknesses: weaknesses || [],
      aiSuggestions: aiSuggestions || [],
      recommendedTopics: recommendedTopics || [],
      skillBreakdown: skillBreakdown || [],
      status: status || "Completed",
    });

    return Response.json({ success: true, interview });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
