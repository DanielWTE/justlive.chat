import { Request, Response } from "express";
import { findWebsiteById } from "../../database/fetch";
import { updateWebsite } from "../../database/update";
import { deleteWebsite } from "../../database/delete";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export const handleGetWebsite = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    const website = await findWebsiteById(id);

    if (!website) {
      return res.status(404).json({
        error: "Website not found",
      });
    }

    if (website.userId !== userId) {
      return res.status(403).json({
        error: "Forbidden",
      });
    }

    return res.json({ website });
  } catch (error) {
    console.error("Get website error:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const handleUpdateWebsite = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, domain } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    const website = await findWebsiteById(id);

    if (!website) {
      return res.status(404).json({
        error: "Website not found",
      });
    }

    if (website.userId !== userId) {
      return res.status(403).json({
        error: "Forbidden",
      });
    }

    const updatedWebsite = await updateWebsite(id, { name, domain });
    return res.json({ website: updatedWebsite });
  } catch (error) {
    console.error("Update website error:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const handleDeleteWebsite = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    const website = await findWebsiteById(id);

    if (!website) {
      return res.status(404).json({
        error: "Website not found",
      });
    }

    if (website.userId !== userId) {
      return res.status(403).json({
        error: "Forbidden",
      });
    }

    await deleteWebsite(id);
    return res.status(204).send();
  } catch (error) {
    console.error("Delete website error:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
}; 