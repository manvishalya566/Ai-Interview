import { connectDB } from "@/lib/mongodb";
import UserSettings from "@/models/UserSettings";
import { authMiddleware } from "@/middleware/authMiddleware";

export async function GET(req) {
  try {
    const authResult = await authMiddleware(req);
    if (!authResult.success) {
      return Response.json({ success: false, message: authResult.message }, { status: 401 });
    }

    await connectDB();
    let settings = await UserSettings.findOne({ userId: authResult.userId }).lean();

    if (!settings) {
      settings = await UserSettings.create({ userId: authResult.userId });
    }

    return Response.json({ success: true, notifications: settings.notifications });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const authResult = await authMiddleware(req);
    if (!authResult.success) {
      return Response.json({ success: false, message: authResult.message }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();

    const settings = await UserSettings.findOneAndUpdate(
      { userId: authResult.userId },
      { $set: { notifications: body } },
      { upsert: true, new: true }
    ).lean();

    return Response.json({ success: true, notifications: settings.notifications });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
