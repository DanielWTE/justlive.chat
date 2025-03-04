import { Request, Response } from "express";
import { createWebsite } from "../../database/create";
import { getWebsiteByDomain } from "../../database/fetch";

export const handleWebsiteCreate = async (req: Request, res: Response) => {
  try {
    const { name, domain } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    if (!name || !domain) {
      return res.status(400).json({
        error: "Name and domain are required",
      });
    }

    const website = await createWebsite(userId, name, domain);
    return res.json({ website });
  } catch (error) {
    console.error("Website creation error:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};
