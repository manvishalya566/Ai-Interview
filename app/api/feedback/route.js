import { connectDB } from "@/lib/mongodb";
import Interview from "@/models/Interview";

export async function POST(req) {
  try {

    await connectDB();

    const body = await req.json();

    const interview = await Interview.create(body);

    return Response.json({
      success: true,
      interview,
    });

  } catch (error) {

    return Response.json({
      success: false,
      error: error.message,
    });

  }
}