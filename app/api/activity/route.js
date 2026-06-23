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

    const interviews = await Interview.find({ userId }).sort({ date: -1 }).limit(10).lean();

    const activityData = interviews.map((i, idx) => {
      const now = new Date();
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

    if (activityData.length === 0) {
      const defaultActivity = [
        { action: "Complete your first mock interview", time: "Get started!", type: "interview", score: 0 },
        { action: "Upload your resume for AI analysis", time: "Recommended", type: "resume" },
        { action: "Practice DSA - Arrays & Hashing", time: "Next step", type: "practice" },
      ];
      return Response.json({ success: true, activity: defaultActivity });
    }

    if (activityData.length < 5) {
      const extras = [
        { action: "Received AI feedback report", time: "After interview", type: "feedback" },
        { action: "Practiced DSA - Arrays & Hashing", time: "Yesterday", type: "practice" },
      ];
      activityData.push(...extras.slice(0, 5 - activityData.length));
    }

    return Response.json({ success: true, activity: activityData });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
