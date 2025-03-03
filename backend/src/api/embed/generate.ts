import { Request, Response } from 'express';
import fs from 'fs/promises';
import path from 'path';
import { findWebsiteById } from '../../database/fetch';

export const handleEmbedGenerate = async (req: Request, res: Response) => {
  try {
    const websiteId = req.query.id as string;
    
    if (!websiteId) {
      return res.status(400).json({ error: 'Missing website ID' });
    }

    // Verify website exists
    const website = await findWebsiteById(websiteId);
    if (!website) {
      return res.status(404).json({ error: 'Website not found' });
    }

    // Read template file
    const templatePath = path.join(process.cwd(), 'public', 'embed.template.js');
    const template = await fs.readFile(templatePath, 'utf-8');

    // Replace placeholders with actual values
    const script = template.replace(
      '{{BACKEND_URL}}',
      process.env.NODE_ENV === 'production'
        ? process.env.BACKEND_URL || 'https://api.justlive.chat'
        : 'http://localhost:4000'
    );

    // Set cache headers for production
    if (process.env.NODE_ENV === 'production') {
      res.setHeader('Cache-Control', 'public, max-age=3600'); // 1 hour
    } else {
      res.setHeader('Cache-Control', 'no-cache');
    }

    // Send the generated script
    res.setHeader('Content-Type', 'application/javascript');
    res.send(script);

  } catch (error) {
    console.error('Error generating embed script:', error);
    res.status(500).json({ error: 'Failed to generate embed script' });
  }
}; 