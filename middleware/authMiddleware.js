import jwt from "jsonwebtoken";

export async function authMiddleware(req) {
  try {
    const token = req.cookies.get("auth_token")?.value;

    if (!token) {
      return {
        success: false,
        message: "No token provided",
      };
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    return {
      success: true,
      userId: decoded.userId,
    };
  } catch (error) {
    return {
      success: false,
      message: "Invalid token",
    };
  }
}
