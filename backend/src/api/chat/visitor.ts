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
    
    console.log(`[POST /chat/visitor-left] Processing visitor left for room ${roomId}`);
    
    // Get the room
    const room = await prisma.chatRoom.findUnique({
      where: { id: roomId },
      include: { messages: true }
    });
    
    if (!room) {
      console.log(`[POST /chat/visitor-left] Room ${roomId} not found`);
      return res.status(404).json({ error: 'Chat room not found' });
    }
    
    // Überprüfen, ob der Chat bereits beendet wurde
    if (room.status === 'ended') {
      console.log(`[POST /chat/visitor-left] Room ${roomId} already ended, skipping processing`);
      return res.status(200).json({ message: 'Chat already ended' });
    }
    
    // Überprüfen, ob bereits eine "Visitor left" Nachricht existiert
    const existingLeaveMessage = await prisma.chatMessage.findFirst({
      where: {
        roomId,
        content: 'Visitor left the chat (closed the page)',
        isSystem: true
      }
    });
    
    // Nachricht erstellen oder vorhandene abrufen
    let systemMessage;
    
    if (!existingLeaveMessage) {
      console.log(`[POST /chat/visitor-left] Creating "Visitor left" message for room ${roomId}`);
      // Add system message about visitor leaving
      systemMessage = await prisma.chatMessage.create({
        data: {
          content: 'Visitor left the chat (closed the page)',
          isVisitor: false,
          isSystem: true,
          roomId: roomId,
        }
      });
    } else {
      console.log(`[POST /chat/visitor-left] "Visitor left" message already exists for room ${roomId}, skipping creation`);
      systemMessage = existingLeaveMessage;
    }
    
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
    
    // Notify admin about visitor leaving and session end with the actual message
    io.to(`admin:${room.websiteId}`).emit('chat:visitor:left', { 
      roomId, 
      message: 'Visitor left the chat (closed the page)',
      systemMessage: {
        ...systemMessage,
        createdAt: systemMessage.createdAt.toISOString() // Konvertiere Date zu String für JSON
      }
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