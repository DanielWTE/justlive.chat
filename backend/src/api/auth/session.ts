import { Request, Response } from "express";
import { verifyToken } from "../../utils/jwt";
import { getUserById } from "../../database/fetch";

interface JwtPayload {
  userId: string;
  email: string;
  exp?: number;
  iat?: number;
}

export const handleAuthSession = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.justlivechat_token;

    if (!token) {
      return res.status(401).json({
        error: "No session found",
        code: "NO_SESSION",
      });
    }

    const payload = verifyToken(token) as JwtPayload;

    const user = await getUserById(payload.userId);

    if (!user) {
      return res.status(401).json({
        error: "Invalid session",
        code: "INVALID_SESSION",
      });
    }

    return res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name || null,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      session: {
        expiresAt: payload.exp ? new Date(payload.exp * 1000).toISOString() : null,
        issuedAt: payload.iat ? new Date(payload.iat * 1000).toISOString() : null,
      }
    });
  } catch (error: unknown) {
    console.error("Session error:", error);
    
    if (error instanceof Error && 
        (error.message === "Invalid token" || error.message === "jwt expired")) {
      return res.status(401).json({
        error: "Session expired",
        code: "SESSION_EXPIRED",
      });
    }
    
    return res.status(401).json({
      error: "Invalid session",
      code: "INVALID_SESSION",
    });
  }
}; 