import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { generateToken } from "@/lib/auth";

export async function POST(req) {
  try {

    await connectDB();

    const body = await req.json();

    const { name, email, password } = body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return Response.json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = generateToken(user._id);

    return Response.json({
      success: true,
      token,
      user,
    });

  } catch (error) {
   console.log("Error in signup route:", error);
    return Response.json({
      success: false,
      error: error.message,
    });

  }
}