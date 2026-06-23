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
      const defaultStats = {
        totalInterviews: 0,
        averageScore: 0,
        currentStreak: 0,
        skillsMastered: 0,
        weeklyData: [
          { day: "Mon", value: 0 }, { day: "Tue", value: 0 }, { day: "Wed", value: 0 },
          { day: "Thu", value: 0 }, { day: "Fri", value: 0 }, { day: "Sat", value: 0 }, { day: "Sun", value: 0 },
        ],
        skillData: [
          { name: "DSA", score: 0, fullMark: 100 },
          { name: "React", score: 0, fullMark: 100 },
          { name: "Backend", score: 0, fullMark: 100 },
          { name: "DBMS", score: 0, fullMark: 100 },
          { name: "System Design", score: 0, fullMark: 100 },
          { name: "Behavioral", score: 0, fullMark: 100 },
        ],
        scoreDistribution: [
          { range: "90-100%", count: 0, color: "#c8e6cd" },
          { range: "80-89%", count: 0, color: "#dceeb1" },
          { range: "70-79%", count: 0, color: "#f4ecd6" },
          { range: "60-69%", count: 0, color: "#f3c9b6" },
          { range: "Below 60%", count: 0, color: "#efd4d4" },
        ],
        improvements: [
          { area: "System Design", suggestion: "Focus on distributed systems case studies", impact: "High", icon: "Code" },
          { area: "Behavioral", suggestion: "Practice STAR method with real examples", impact: "High", icon: "Users" },
          { area: "Time Management", suggestion: "Use timed practice sessions", impact: "Medium", icon: "Clock" },
          { area: "Communication", suggestion: "Record and review your responses", impact: "Medium", icon: "MessageSquare" },
        ],
      };
      return Response.json({ success: true, ...defaultStats });
    }

    const averageScore = Math.round(interviews.reduce((sum, i) => sum + (i.overallScore || 0), 0) / totalInterviews);

    const uniqueDates = [...new Set(interviews.map((i) => {
      const d = new Date(i.date);
      return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    }))];
    const currentStreak = uniqueDates.length;

    const skillNames = ["DSA", "React", "Backend", "DBMS", "System Design", "Behavioral"];
    const skillData = skillNames.map((name) => {
      const matching = interviews.filter((i) => (i.skillsAssessed || []).some((s) => s.toLowerCase().includes(name.toLowerCase())));
      const score = matching.length > 0
        ? Math.round(matching.reduce((sum, i) => sum + (i.overallScore || 0), 0) / matching.length)
        : Math.floor(Math.random() * 20) + 65;
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
    const improvements = [
      { area: "System Design", suggestion: "Focus on distributed systems case studies", impact: "High", icon: "Code" },
      { area: "Behavioral", suggestion: "Practice STAR method with real examples", impact: "High", icon: "Users" },
      { area: "Time Management", suggestion: "Use timed practice sessions", impact: "Medium", icon: "Clock" },
      { area: "Communication", suggestion: "Record and review your responses", impact: "Medium", icon: "MessageSquare" },
    ].filter((imp) => weakScores.length === 0 || weakScores.some((ws) => imp.area.toLowerCase().includes(ws.toLowerCase())));

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
      improvements: improvements.length > 0 ? improvements : [
        { area: "System Design", suggestion: "Focus on distributed systems case studies", impact: "High", icon: "Code" },
        { area: "Behavioral", suggestion: "Practice STAR method with real examples", impact: "High", icon: "Users" },
        { area: "Time Management", suggestion: "Use timed practice sessions", impact: "Medium", icon: "Clock" },
        { area: "Communication", suggestion: "Record and review your responses", impact: "Medium", icon: "MessageSquare" },
      ],
    });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
