import { connectDB } from "@/lib/mongodb";
import Interview from "@/models/Interview";
import { authMiddleware } from "@/middleware/authMiddleware";

export async function GET(req) {
  try {
    const authResult = await authMiddleware(req);
    if (!authResult.success) {
      return Response.json({ success: false, message: authResult.message }, { status: 401 });
    }

    await connectDB();

    const userId = authResult.userId;
    const interviews = await Interview.find({ userId }).sort({ date: -1 }).lean();

    const totalInterviews = interviews.length;
    const averageScore = totalInterviews > 0
      ? Math.round(interviews.reduce((sum, i) => sum + (i.overallScore || 0), 0) / totalInterviews)
      : 0;

    const skillsBreakdown = {};
    interviews.forEach((i) => {
      if (i.skillsAssessed && Array.isArray(i.skillsAssessed)) {
        i.skillsAssessed.forEach((skill) => {
          if (skill) skillsBreakdown[skill] = (skillsBreakdown[skill] || 0) + 1;
        });
      }
    });

    const uniqueDates = [...new Set(interviews.map((i) => {
      const d = new Date(i.date);
      return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    }))];
    const streakDays = uniqueDates.length;

    return Response.json({
      success: true,
      stats: {
        totalInterviews,
        averageScore,
        skillsBreakdown,
        recentInterviews: interviews.slice(0, 5),
        streakDays,
      },
    });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
