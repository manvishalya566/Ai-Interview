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

    const interviews = await Interview.find({ userId: authResult.userId })
      .sort({ date: -1 })
      .lean();

    return Response.json({ success: true, interviews });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
