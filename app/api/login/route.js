import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { generateToken } from "@/lib/auth";

export async function POST(req) {
  try {

    await connectDB();

    const body = await req.json();

    const { email, password } = body;

    const user = await User.findOne({ email });

    if (!user) {
      return Response.json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return Response.json({
        success: false,
        message: "Invalid password",
      });
    }

    const token = generateToken(user._id);

    return Response.json({
      success: true,
      token,
      user,
    });

  } catch (error) {

    return Response.json({
      success: false,
      error: error.message,
    });

  }
}