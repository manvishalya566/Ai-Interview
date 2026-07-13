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

    if (totalInterviews === 0) {
      return Response.json({
        success: true,
        totalInterviews: 0,
        averageScore: 0,
        currentStreak: 0,
        skillsMastered: 0,
        weeklyData: [],
        skillData: [],
        scoreDistribution: [],
        improvements: [],
      });
    }

    const averageScore = Math.round(interviews.reduce((sum, i) => sum + (i.overallScore || 0), 0) / totalInterviews);

    const uniqueDates = [...new Set(interviews.map((i) => {
      const d = new Date(i.date);
      return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    }))];
    const currentStreak = uniqueDates.length;

    const allAssessed = [...new Set(interviews.flatMap((i) => (i.skillsAssessed || [])))].filter(Boolean);
    const skillData = allAssessed.map((name) => {
      const matching = interviews.filter((i) => (i.skillsAssessed || []).some((s) => s.toLowerCase() === name.toLowerCase()));
      const score = matching.length > 0
        ? Math.round(matching.reduce((sum, i) => sum + (i.overallScore || 0), 0) / matching.length)
        : 0;
      return { name, score: Math.min(score, 100), fullMark: 100 };
    });

    const scoreDistribution = [
      { range: "90-100%", count: 0, color: "#c8e6cd" },
      { range: "80-89%", count: 0, color: "#dceeb1" },
      { range: "70-79%", count: 0, color: "#f4ecd6" },
      { range: "60-69%", count: 0, color: "#f3c9b6" },
      { range: "Below 60%", count: 0, color: "#efd4d4" },
    ];
    interviews.forEach((i) => {
      const score = i.overallScore || 0;
      if (score >= 90) scoreDistribution[0].count++;
      else if (score >= 80) scoreDistribution[1].count++;
      else if (score >= 70) scoreDistribution[2].count++;
      else if (score >= 60) scoreDistribution[3].count++;
      else scoreDistribution[4].count++;
    });

    const weeklyData = [];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayStr = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      const dayInterviews = interviews.filter((intv) => {
        const id = new Date(intv.date);
        return `${id.getFullYear()}-${id.getMonth()}-${id.getDate()}` === dayStr;
      });
      const avg = dayInterviews.length > 0
        ? Math.round(dayInterviews.reduce((s, iv) => s + (iv.overallScore || 0), 0) / dayInterviews.length)
        : 0;
      weeklyData.push({ day: dayNames[d.getDay()], value: avg });
    }

    const weakScores = skillData.filter((s) => s.score < 75).map((s) => s.name);
    const improvements = weakScores.slice(0, 4).map((area) => ({
      area,
      suggestion: `Focus on ${area} to improve your overall interview performance`,
      impact: "Medium",
      icon: "Code",
    }));

    const skillsMastered = skillData.filter((s) => s.score >= 80).length;

    return Response.json({
      success: true,
      totalInterviews,
      averageScore,
      currentStreak,
      skillsMastered,
      weeklyData,
      skillData,
      scoreDistribution,
      improvements,
    });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
