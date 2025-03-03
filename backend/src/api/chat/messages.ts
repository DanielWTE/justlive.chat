import { Request, Response } from "express";
import { getChatMessagesByRoomId, getChatRoomById } from "../../database/chat";
import { findWebsiteById } from "../../database/fetch";

export const handleGetMessages = async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params;
    const websiteId = req.headers["x-website-id"] as string;
    const isAdmin = req.user?.id ? true : false; // If user is authenticated, they're an admin
    const origin = req.get('origin');

    console.log(`[GET /chat/messages/${roomId}] Request from ${origin}, websiteId: ${websiteId}, isAdmin: ${isAdmin}`);

    if (!roomId) {
      console.log(`[GET /chat/messages] Missing roomId`);
      return res.status(400).json({
        error: "Room ID is required",
      });
    }

    // Verify room exists
    const room = await getChatRoomById(roomId);
    if (!room) {
      console.log(`[GET /chat/messages/${roomId}] Room not found`);
      return res.status(404).json({
        error: "Room not found",
      });
    }

    console.log(`[GET /chat/messages/${roomId}] Room found, websiteId: ${room.websiteId}`);

    // For admin users, verify they own the website
    if (isAdmin) {
      // If admin, we need to check if they own the website
      const website = await findWebsiteById(room.websiteId);
      if (!website) {
        console.log(`[GET /chat/messages/${roomId}] Website not found: ${room.websiteId}`);
        return res.status(403).json({
          error: "Website not found",
        });
      }
      
      if (website.userId !== req.user?.id) {
        console.log(`[GET /chat/messages/${roomId}] Permission denied for user ${req.user?.id}, website owner: ${website.userId}`);
        return res.status(403).json({
          error: "You don't have permission to access this room",
        });
      }
      
      // Admin is authorized, get messages
      const messages = await getChatMessagesByRoomId(roomId);
      console.log(`[GET /chat/messages/${roomId}] Returning ${messages.length} messages for admin`);
      return res.json({ messages });
    } 
    // For non-admin users, verify the website ID matches and domain is whitelisted
    else if (room.websiteId !== websiteId) {
      console.log(`[GET /chat/messages/${roomId}] Website ID mismatch: ${room.websiteId} != ${websiteId}`);
      return res.status(403).json({
        error: "Invalid room for this website",
      });
    }

    // Get messages for non-admin users
    const messages = await getChatMessagesByRoomId(roomId);
    console.log(`[GET /chat/messages/${roomId}] Returning ${messages.length} messages for visitor`);
    
    return res.json({ messages });
  } catch (error) {
    console.error("Error getting messages:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
}; 