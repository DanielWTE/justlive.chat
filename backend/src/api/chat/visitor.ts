import { Request, Response } from "express";
import { prisma } from "../../database/prisma";
import { Server } from "socket.io";
import { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData } from "../../socket/events";
import { updateChatRoomStatus } from "../../database/chat";

/**
 * Handle visitor leaving the page via sendBeacon API
 * This endpoint is called when a visitor closes the browser or navigates away
 */
export const handleVisitorLeft = (
  io: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>
) => async (req: Request, res: Response) => {
  try {
    const { roomId } = req.body;
    
    if (!roomId) {
      return res.status(400).json({ error: 'Room ID is required' });
    }
    
    // Get the room
    const room = await prisma.chatRoom.findUnique({
      where: { id: roomId },
      include: { messages: true }
    });
    
    if (!room) {
      return res.status(404).json({ error: 'Chat room not found' });
    }
    
    // Add system message about visitor leaving
    await prisma.chatMessage.create({
      data: {
        content: 'Visitor left the chat (closed the page)',
        isVisitor: false,
        roomId: roomId,
      }
    });
    
    // Update room status to ended
    await updateChatRoomStatus(roomId, 'ended');
    
    // Update participant status
    await prisma.chatParticipant.updateMany({
      where: { roomId },
      data: {
        isOnline: false,
        lastSeen: new Date()
      }
    });
    
    // Notify admin about visitor leaving and session end
    io.to(`admin:${room.websiteId}`).emit('chat:visitor:left', { 
      roomId, 
      message: 'Visitor left the chat (closed the page)'
    });
    
    // Notify all clients in the room about session end
    io.to(roomId).emit('chat:session:end', { roomId });
    
    console.log(`Visitor left chat room via API: ${roomId}. Chat session ended but preserved for admin review.`);
    
    // Always return 200 OK for sendBeacon
    res.status(200).end();
  } catch (error) {
    console.error('Error handling visitor leave via API:', error);
    // Still return 200 for sendBeacon
    res.status(200).end();
  }
}; 