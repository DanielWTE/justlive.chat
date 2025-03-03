import { Request, Response } from "express";
import { findWebsitesByUserId } from "../../database/fetch";

export const handleWebsiteList = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    const websites = await findWebsitesByUserId(userId);
    return res.json({ websites });
  } catch (error) {
    console.error("Website listing error:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
}; 