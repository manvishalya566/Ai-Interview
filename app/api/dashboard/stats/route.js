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
        stats: { totalInterviews: 0, averageScore: 0, skillsAssessed: 0, streakDays: 0 },
        weeklyData: [],
        skillData: [],
        recentInterviews: [],
        activityData: [],
      });
    }

    const averageScore = totalInterviews > 0
      ? Math.round(interviews.reduce((sum, i) => sum + (i.overallScore || 0), 0) / totalInterviews)
      : 0;

    const uniqueDates = [...new Set(interviews.map((i) => {
      const d = new Date(i.date);
      return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    }))];
    const streakDays = uniqueDates.length;

    const allSkills = interviews.flatMap((i) => i.skillsAssessed || []);
    const uniqueSkills = [...new Set(allSkills)].filter(Boolean);
    const skillsAssessed = uniqueSkills.length;

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

    const skillMap = {};
    interviews.forEach((i) => {
      (i.skillBreakdown || []).forEach((s) => {
        if (!skillMap[s.name]) skillMap[s.name] = { total: 0, count: 0 };
        skillMap[s.name].total += s.score || 0;
        skillMap[s.name].count += 1;
      });
    });
    const skillData = Object.entries(skillMap).map(([name, data]) => ({
      label: name,
      value: Math.round(data.total / data.count),
    }));

    const recentInterviews = interviews.slice(0, 5).map((i) => ({
      company: i.company || i.type || "General",
      role: i.role || "Software Engineer",
      score: i.overallScore || 0,
      date: i.date ? new Date(i.date).toISOString().split("T")[0] : "N/A",
      status: i.status || "Completed",
    }));

    const now = new Date();
    const activityData = interviews.slice(0, 7).map((i, idx) => {
      const diffMs = now - new Date(i.date);
      const diffMins = Math.floor(diffMs / 60000);
      let time;
      if (diffMins < 60) time = `${diffMins} minutes ago`;
      else if (diffMins < 1440) time = `${Math.floor(diffMins / 60)} hours ago`;
      else time = `${Math.floor(diffMins / 1440)} days ago`;

      return {
        action: `Completed ${i.company || i.type || "General"} mock interview`,
        time,
        type: "interview",
        score: i.overallScore || 0,
      };
    });

    return Response.json({
      success: true,
      stats: {
        totalInterviews,
        averageScore,
        skillsAssessed,
        streakDays,
      },
      weeklyData,
      skillData,
      recentInterviews,
      activityData,
    });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
