import jwt from "jsonwebtoken";

export async function authMiddleware(req) {
  try {

    const token = req.headers.get("authorization");

    if (!token) {
      return {
        success: false,
        message: "No token provided",
      };
    }

    const jwtToken = token.replace("Bearer ", "");

    const decoded = jwt.verify(
      jwtToken,
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