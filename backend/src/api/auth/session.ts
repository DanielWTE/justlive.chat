import { Request, Response } from "express";
import { verifyToken } from "../../utils/jwt";

export const handleAuthSession = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        error: "No session found",
      });
    }

    const payload = verifyToken(token);

    return res.json({
      user: {
        id: payload.userId,
        email: payload.email,
      },
    });
  } catch (error) {
    console.error("Session error:", error);
    return res.status(401).json({
      error: "Invalid session",
    });
  }
}; 