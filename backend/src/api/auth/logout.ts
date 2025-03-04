import { Request, Response } from "express";
import { clearCookie } from "../../utils/cookies";
/**
 * Handles user logout by clearing the authentication cookie
 */
export const handleLogout = async (req: Request, res: Response) => {
  try {
    clearCookie(res);

    return res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      error: "Failed to logout",
    });
  }
};
