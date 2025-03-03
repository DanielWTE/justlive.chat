import { Server, Socket } from 'socket.io';
import { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData } from './events';
import {
  createChatRoom,
  createChatMessage,
  createChatParticipant,
  removeChatParticipant,
  getChatRoomById,
  getChatRoomsByWebsiteId,
  getChatMessagesByRoomId,
  getChatParticipant,
  updateParticipantTyping,
  updateParticipantStatus,
  markMessageAsRead,
  updateChatRoomStatus,
  deleteChatRoom
} from '../database/chat';
import { prisma } from '../database/prisma';

// Rate limiting maps
const messageRateLimits = new Map<string, { count: number; timestamp: number }>();
const MESSAGE_LIMIT = 5; // messages
const TIME_WINDOW = 10000; // 10 seconds
const COOLDOWN_TIME = 30000; // 30 seconds cooldown if limit exceeded

// Track admin subscriptions
const adminSubscriptions = new Map<string, Set<string>>(); // websiteId -> Set of admin socket IDs

export const handleChatEvents = (
  io: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>,
  socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>
) => {
  // Check rate limit for messages
  const checkMessageRateLimit = (sessionId: string): boolean => {
    const now = Date.now();
    const userLimit = messageRateLimits.get(sessionId);

    // Skip rate limiting for admin users
    if (socket.data.isAdmin) {
      return true;
    }

    // Reset if time window passed
    if (!userLimit || (now - userLimit.timestamp) > TIME_WINDOW) {
      messageRateLimits.set(sessionId, { count: 1, timestamp: now });
      return true;
    }

    // Check if in cooldown
    if (userLimit.count >= MESSAGE_LIMIT) {
      if ((now - userLimit.timestamp) < COOLDOWN_TIME) {
        return false;
      }
      // Reset after cooldown
      messageRateLimits.set(sessionId, { count: 1, timestamp: now });
      return true;
    }

    // Increment counter
    userLimit.count += 1;
    messageRateLimits.set(sessionId, userLimit);
    return true;
  };

  // Handle admin subscription to website chats
  const handleAdminSubscribe = async (data: { websiteId: string }) => {
    try {
      const { websiteId } = data;
      
      // Add admin to subscription list
      let admins = adminSubscriptions.get(websiteId);
      if (!admins) {
        admins = new Set();
        adminSubscriptions.set(websiteId, admins);
      }
      admins.add(socket.id);

      // Get existing rooms for this website
      const rooms = await getChatRoomsByWebsiteId(websiteId);
      
      // Join all rooms and send existing messages
      for (const room of rooms) {
        if (!room || !room.id) continue;
        
        // Join room
        socket.join(room.id.toString());
        const messages = await getChatMessagesByRoomId(room.id);
        const participants = room.participants || [];
        const participant = participants[0]; // Get first participant since we're dealing with 1-1 chats
        
        // Notify admin about existing session
        if (participant?.sessionId) {
          console.log(`Notifying admin about existing session ${room.id} with status ${room.status}`);
          socket.emit('chat:session:new', {
            roomId: room.id,
            websiteId: room.websiteId,
            visitorId: participant.sessionId,
            isActive: room.status === 'active'
          });

          // Send participant status
          socket.emit('chat:participant:status', {
            roomId: room.id,
            sessionId: participant.sessionId,
            isOnline: participant.isOnline,
            isTyping: participant.isTyping,
            lastSeen: participant.lastSeen || new Date()
          });
        }

        // Send existing messages
        messages.forEach(msg => {
          socket.emit('chat:message', {
            id: msg.id,
            content: msg.content,
            roomId: msg.roomId,
            createdAt: msg.createdAt,
            isVisitor: msg.isVisitor,
            isRead: msg.isRead,
            readAt: msg.readAt || undefined
          });
        });
      }

      console.log(`Admin subscribed to website ${websiteId}`);
    } catch (error) {
      console.error('Admin subscribe error:', error);
      socket.emit('chat:error', { message: 'Failed to subscribe to website chats' });
    }
  };

  const handleJoin = async (data: { websiteId: string; roomId?: string }) => {
    try {
      console.log('Join attempt:', { socketId: socket.id, data });
      const { websiteId } = data;
      let currentRoomId = data.roomId;
      const { sessionId } = socket.data;

      if (!sessionId || !websiteId) {
        socket.emit('chat:error', { message: 'Invalid session data' });
        return;
      }

      // Create or join room
      if (!currentRoomId) {
        const room = await createChatRoom(websiteId);
        currentRoomId = room.id;
        console.log('Created new room:', { roomId: currentRoomId, websiteId });

        // Notify admins about new chat session
        const admins = adminSubscriptions.get(websiteId);
        if (admins && currentRoomId) {
          admins.forEach(adminId => {
            const adminSocket = io.sockets.sockets.get(adminId);
            if (adminSocket) {
              adminSocket.join(currentRoomId || '');
              adminSocket.emit('chat:session:new', {
                roomId: currentRoomId || '',
                websiteId,
                visitorId: sessionId,
                isActive: true
              });
            }
          });
        }
      } else {
        // Verify room exists and belongs to website
        const room = await getChatRoomById(currentRoomId);
        if (!room || room.websiteId !== websiteId) {
          console.warn('Invalid room access attempt:', { roomId: currentRoomId, websiteId });
          socket.emit('chat:error', { message: 'Invalid room' });
          return;
        }
        console.log('Joining existing room:', { roomId: currentRoomId, websiteId });
      }

      if (!currentRoomId) {
        socket.emit('chat:error', { message: 'Failed to create/join room' });
        return;
      }

      // Create participant
      const participant = await createChatParticipant(currentRoomId, sessionId);
      console.log('Created participant:', { sessionId, roomId: currentRoomId });

      // Join socket room
      const currentRoomIdString = currentRoomId?.toString();
      if (!currentRoomIdString) {
        socket.emit("chat:error", { message: "Invalid room ID" });
        return;
      }

      socket.join(currentRoomIdString);
      socket.data.roomId = currentRoomIdString;

      // Notify about participant status
      const lastSeen = new Date();
      io.to(currentRoomIdString).emit('chat:participant:status', {
        roomId: currentRoomIdString,
        sessionId,
        isOnline: true,
        isTyping: false,
        lastSeen
      });

      // Emit joined event with room ID
      socket.emit('chat:joined', { roomId: currentRoomIdString });
      console.log('Successfully joined room:', { socketId: socket.id, roomId: currentRoomIdString });
    } catch (error) {
      console.error('Join error:', error);
      socket.emit('chat:error', { message: 'Failed to join chat' });
    }
  };

  const handleMessage = async (data: { content: string; roomId: string; isAdmin?: boolean }) => {
    try {
      console.log('Message received:', { 
        socketId: socket.id, 
        roomId: data.roomId,
        contentLength: data.content.length,
        isAdmin: data.isAdmin
      });
      
      const { content, roomId } = data;
      const { websiteId, sessionId } = socket.data;

      // Check rate limit (only for non-admin users)
      if (!socket.data.isAdmin && !checkMessageRateLimit(sessionId)) {
        console.warn('Rate limit exceeded:', { sessionId });
        socket.emit('chat:error', { 
          message: 'Too many messages. Please wait before sending more.' 
        });
        return;
      }

      // Basic content validation
      if (!content || content.length > 1000) {
        console.warn('Invalid content:', { contentLength: content?.length });
        socket.emit('chat:error', { 
          message: 'Invalid message content. Message must be between 1 and 1000 characters.' 
        });
        return;
      }

      // Sanitize content - remove HTML and scripts
      const sanitizedContent = content
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .trim();

      // Verify room exists and belongs to website
      const room = await getChatRoomById(roomId);
      if (!room || room.websiteId !== websiteId) {
        console.warn('Invalid room for message:', { roomId, websiteId });
        socket.emit('chat:error', { message: 'Invalid room' });
        return;
      }

      // Create and broadcast message
      const message = await createChatMessage(roomId, sanitizedContent, !socket.data.isAdmin);
      console.log('Message created:', { 
        messageId: message.id, 
        roomId: message.roomId 
      });

      io.to(roomId).emit('chat:message', {
        id: message.id,
        content: message.content,
        roomId: message.roomId,
        createdAt: message.createdAt,
        isVisitor: !socket.data.isAdmin,
        isRead: false
      });

      console.log('Message broadcast complete:', { 
        messageId: message.id, 
        roomId: message.roomId 
      });

    } catch (error) {
      console.error('Message error:', error);
      socket.emit('chat:error', { message: 'Failed to send message' });
    }
  };

  const handleMessageRead = async (data: { messageId: string; roomId: string }) => {
    try {
      const { messageId, roomId } = data;
      const message = await markMessageAsRead(messageId);
      
      if (message) {
        io.to(roomId).emit('chat:message:read', {
          messageId,
          roomId,
          readAt: message.readAt || new Date()
        });
      }
    } catch (error) {
      console.error('Message read error:', error);
    }
  };

  const handleTyping = async (data: { roomId: string; isTyping: boolean }) => {
    try {
      const { roomId, isTyping } = data;
      const { sessionId } = socket.data;

      await updateParticipantTyping(sessionId, isTyping, roomId);

      io.to(roomId).emit('chat:participant:status', {
        roomId,
        sessionId,
        isTyping,
        isOnline: true,
        lastSeen: new Date()
      });
    } catch (error) {
      console.error('Typing status error:', error);
    }
  };

  const handleSessionEnd = async (data: { roomId: string }) => {
    try {
      const { roomId } = data;
      console.log(`Handling session end for room ${roomId}`);
      
      const room = await getChatRoomById(roomId);
      
      if (room) {
        console.log(`Found room ${roomId}, updating status to 'ended'`);
        
        // Update room status in database
        await updateChatRoomStatus(roomId, 'ended');
        console.log(`Updated room ${roomId} status to 'ended' in database`);
        
        // Notify all clients in the room
        console.log(`Notifying all clients in room ${roomId} about session end`);
        io.to(roomId).emit('chat:session:end', { roomId });
        
        // Update participant status
        console.log(`Updating participant status for room ${roomId}`);
        await prisma.chatParticipant.updateMany({
          where: { roomId },
          data: {
            isOnline: false,
            lastSeen: new Date()
          }
        });
        
        // Remove all participants
        console.log(`Disconnecting all sockets in room ${roomId}`);
        socket.to(roomId).disconnectSockets(true);
        
        console.log(`Successfully ended session for room ${roomId}`);
      } else {
        console.log(`Room ${roomId} not found, cannot end session`);
      }
    } catch (error) {
      console.error('Session end error:', error);
      socket.emit('chat:error', { message: 'Failed to end chat session' });
    }
  };

  const handleDeleteChat = async (data: { roomId: string }) => {
    try {
      const { roomId } = data;
      const room = await getChatRoomById(roomId);
      
      if (room) {
        // Delete the room and all related data
        await deleteChatRoom(roomId);
        
        // Notify all clients in the room
        io.to(roomId).emit('chat:room:deleted', { roomId });
        
        // Disconnect all sockets in the room
        socket.to(roomId).disconnectSockets(true);
      }
    } catch (error) {
      console.error('Delete chat error:', error);
      socket.emit('chat:error', { message: 'Failed to delete chat room' });
    }
  };

  // Register event handlers
  if (socket.data.isAdmin) {
    socket.on('chat:admin:subscribe', handleAdminSubscribe);
    socket.on('chat:session:end', handleSessionEnd);
    socket.on('chat:room:delete', handleDeleteChat);
    socket.on('chat:message:read', handleMessageRead);
  } else {
    socket.on('chat:join', handleJoin);
  }

  socket.on('chat:message', handleMessage);
  socket.on('chat:typing', handleTyping);

  // Handle disconnection
  socket.on('disconnect', async () => {
    try {
      const { sessionId, roomId, isAdmin, websiteId } = socket.data;
      
      if (isAdmin && websiteId) {
        // Remove admin from subscriptions
        const admins = adminSubscriptions.get(websiteId);
        if (admins) {
          admins.delete(socket.id);
          if (admins.size === 0) {
            adminSubscriptions.delete(websiteId);
          }
        }
      } else if (sessionId && roomId) {
        try {
          // Update participant status
          const participant = await getChatParticipant(sessionId);
          if (participant && participant.roomId === roomId) {
            await updateParticipantStatus(sessionId, false);
            
            // Notify about offline status
            const lastSeen = new Date();
            io.to(roomId).emit('chat:participant:status', {
              roomId,
              sessionId,
              isOnline: false,
              isTyping: false,
              lastSeen
            });

            await removeChatParticipant(sessionId);
            // Clean up rate limit data
            messageRateLimits.delete(sessionId);
            
            // Notify admins about session end
            io.to(roomId).emit('chat:session:end', { roomId });
          }
        } catch (error) {
          console.error('Error updating participant status:', error);
        }
      }
    } catch (error) {
      console.error('Disconnect error:', error);
    }
  });
}; 