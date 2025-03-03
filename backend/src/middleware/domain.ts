import { Request, Response, NextFunction } from 'express';
import { findWebsiteById } from '../database/fetch';

export const domainWhitelist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const origin = req.get('origin');
    const websiteId = req.headers['x-website-id'] as string;

    if (!origin || !websiteId) {
      return res.status(403).json({
        error: "Origin and website ID are required",
      });
    }

    const website = await findWebsiteById(websiteId);

    if (!website) {
      return res.status(403).json({
        error: "Invalid website ID",
      });
    }

    const websiteDomain = website.domain.toLowerCase();
    const requestDomain = origin.toLowerCase()
      .replace(/^https?:\/\//, '')  // Remove protocol
      .replace(/:\d+$/, '')         // Remove port
      .replace(/\/$/, '');          // Remove trailing slash

    if (requestDomain !== websiteDomain) {
      return res.status(403).json({
        error: "Domain not whitelisted",
      });
    }

    next();
  } catch (error) {
    console.error("Domain whitelist error:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
}; 