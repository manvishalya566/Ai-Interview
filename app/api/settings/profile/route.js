import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { authMiddleware } from "@/middleware/authMiddleware";

export async function PUT(req) {
  try {
    const authResult = await authMiddleware(req);
    if (!authResult.success) {
      return Response.json({ success: false, message: authResult.message }, { status: 401 });
    }

    await connectDB();
    const { name } = await req.json();

    const updateData = {};
    if (name) updateData.name = name;

    const user = await User.findByIdAndUpdate(authResult.userId, updateData, { new: true }).select("-password").lean();

    return Response.json({ success: true, user });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
