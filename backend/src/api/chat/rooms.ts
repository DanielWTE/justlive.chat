import { Request, Response } from 'express';
import { getChatRoomsByWebsiteId } from '../../database/chat';

/**
 * API handler to get all chat rooms for a website
 */
export const handleGetChatRooms = async (req: Request, res: Response) => {
  try {
    const { websiteId } = req.query;
    
    if (!websiteId || typeof websiteId !== 'string') {
      return res.status(400).json({ error: 'Website ID is required' });
    }
    
    // Get all chat rooms for the website
    const rooms = await getChatRoomsByWebsiteId(websiteId);
    
    console.log(`Returning ${rooms.length} chat rooms for website ${websiteId}`);
    
    return res.status(200).json({
      success: true,
      rooms
    });
  } catch (error) {
    console.error('Error getting chat rooms:', error);
    return res.status(500).json({ error: 'Failed to get chat rooms' });
  }
}; 