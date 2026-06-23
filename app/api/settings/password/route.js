import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { authMiddleware } from "@/middleware/authMiddleware";

export async function PUT(req) {
  try {
    const authResult = await authMiddleware(req);
    if (!authResult.success) {
      return Response.json({ success: false, message: authResult.message }, { status: 401 });
    }

    await connectDB();
    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return Response.json({ success: false, message: "Current and new password required" }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return Response.json({ success: false, message: "Password must be at least 6 characters" }, { status: 400 });
    }

    const user = await User.findById(authResult.userId);
    if (!user) {
      return Response.json({ success: false, message: "User not found" }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return Response.json({ success: false, message: "Current password is incorrect" }, { status: 400 });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return Response.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
