import { Request, Response } from 'express';
import fs from 'fs/promises';
import path from 'path';
import { findWebsiteById } from '../../database/fetch';
import { minify } from 'terser';

export const handleEmbedGenerate = async (req: Request, res: Response) => {
  try {
    const websiteId = req.query.id as string;
    const minified = req.query.minified !== 'false'; // Default to minified unless explicitly set to false
    
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
    let script = template.replace(
      '{{BACKEND_URL}}',
      process.env.APP_ENV == "production"
        ? process.env.BACKEND_URL || 'https://api.justlive.chat'
        : 'http://localhost:4000'
    );

    // Minify the script if requested
    if (minified) {
      try {
        const minifyResult = await minify(script, {
          compress: {
            drop_console: process.env.APP_ENV == "production", // Remove console logs in production
            drop_debugger: true
          },
          mangle: true,
          output: {
            comments: /^!|@license|@preserve/
          }
        });
        
        if (minifyResult.code) {
          script = minifyResult.code;
        } else {
          console.warn('Minification produced no output, using unminified version');
        }
      } catch (minifyError) {
        console.error('Error during minification:', minifyError);
      }
    }

    // Set cache headers for production
    if (process.env.APP_ENV === 'production') {
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