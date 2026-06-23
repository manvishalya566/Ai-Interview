import { connectDB } from "@/lib/mongodb";
import Interview from "@/models/Interview";
import { authMiddleware } from "@/middleware/authMiddleware";

export async function GET(req, { params }) {
  try {
    const authResult = await authMiddleware(req);
    if (!authResult.success) {
      return Response.json({ success: false, message: authResult.message }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;

    const interview = await Interview.findOne({ _id: id, userId: authResult.userId }).lean();

    if (!interview) {
      return Response.json({ success: false, message: "Interview not found" }, { status: 404 });
    }

    const scores = interview.scores || {}
    const scoreMap = typeof scores.get === 'function' ? scores : new Map(Object.entries(scores))

    const performanceMetrics = [
      { label: "Communication Skills", value: scoreMap.get?.("communication") ?? null, icon: "MessageCircle" },
      { label: "Technical Knowledge", value: scoreMap.get?.("technical") ?? null, icon: "Code" },
      { label: "Confidence Level", value: scoreMap.get?.("confidence") ?? null, icon: "Star" },
      { label: "Problem Solving", value: scoreMap.get?.("problemSolving") ?? null, icon: "Brain" },
      { label: "Speaking Speed", value: scoreMap.get?.("speakingSpeed") ?? null, icon: "Mic" },
      { label: "Eye Contact", value: scoreMap.get?.("eyeContact") ?? null, icon: "Eye" },
    ];

    const questionsCount = interview.questions?.length || 0
    const avgResponse = interview.duration && questionsCount > 0
      ? `${Math.round(interview.duration / questionsCount)} min`
      : null

    const quickStats = [
      { label: "Best Category", value: interview.type || null, icon: "Code" },
      { label: "Needs Work", value: interview.weaknesses?.[0] || null, icon: "Users" },
      { label: "Time Taken", value: interview.duration ? `${interview.duration} min` : null, icon: "Clock" },
      { label: "Accuracy", value: interview.overallScore != null ? `${interview.overallScore}%` : null, icon: "Target" },
      { label: "Avg Response", value: avgResponse, icon: "Mic" },
      { label: "Code Quality", value: interview.overallScore != null ? (interview.overallScore >= 85 ? "A-" : "B+") : null, icon: "CheckCircle" },
    ].filter(s => s.value != null);

    return Response.json({
      success: true,
      interview: {
        ...interview,
        performanceMetrics,
        quickStats,
      },
    });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
