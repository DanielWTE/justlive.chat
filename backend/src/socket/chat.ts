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
  deleteChatRoom,
  updateChatRoomVisitorInfo
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

      // Store websiteId in socket data for later use
      socket.data.websiteId = websiteId;

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
            isActive: room.status === 'active',
            visitorInfo: room.visitorName && room.visitorEmail ? {
              name: room.visitorName,
              email: room.visitorEmail
            } : undefined
          });

          // Send participant status
          socket.emit('chat:participant:status', {
            roomId: room.id,
            sessionId: participant.sessionId,
            isOnline: participant.isOnline,
            isTyping: participant.isTyping,
            lastSeen: participant.lastSeen || new Date(),
            isAdmin: false
          });

          // Notify visitor that admin is online
          io.to(room.id.toString()).emit('chat:participant:status', {
            roomId: room.id,
            sessionId: socket.data.sessionId,
            isOnline: true,
            isTyping: false,
            lastSeen: new Date(),
            isAdmin: true
          });
        }

        // Send existing messages
        messages.forEach((msg: any) => {
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

      // Notify all active rooms about admin online status
      // This ensures that visitors who haven't sent a message yet
      // also get the admin status update
      const allRooms = await getChatRoomsByWebsiteId(websiteId);
      for (const room of allRooms) {
        if (room && room.id && room.status === 'active') {
          io.to(room.id.toString()).emit('chat:participant:status', {
            roomId: room.id.toString(),
            sessionId: 'admin', // Use a generic ID for admin
            isOnline: true,
            isTyping: false,
            lastSeen: new Date(),
            isAdmin: true
          });
        }
      }

      console.log(`Admin subscribed to website ${websiteId}`);
    } catch (error) {
      console.error('Admin subscribe error:', error);
      socket.emit('chat:error', { message: 'Failed to subscribe to website chats' });
    }
  };

  const handleJoin = async (data: { 
    websiteId: string; 
    roomId?: string; 
    visitorInfo?: { 
      name: string; 
      email: string; 
      url?: string;
      pageTitle?: string;
    },
    isReconnectAttempt?: boolean
  }) => {
    try {
      console.log('Join request:', { 
        socketId: socket.id, 
        websiteId: data.websiteId, 
        roomId: data.roomId,
        hasVisitorInfo: !!data.visitorInfo,
        isReconnectAttempt: !!socket.data.isReconnectAttempt
      });

      const { websiteId } = data;
      const { sessionId } = socket.data;
      let roomId = data.roomId;
      let currentRoomIdString: string;

      // Check if it's a reconnection attempt
      if (socket.data.isReconnectAttempt && roomId) {
        console.log('Reconnection attempt for room:', roomId);
        
        // Verify the room exists and is active
        const existingRoom = await getChatRoomById(roomId);
        if (!existingRoom) {
          console.log('Room not found during reconnection:', roomId);
          socket.emit('chat:error', { message: 'Chat room not found' });
          return;
        }

        // Check if the room is ended or deleted
        if (existingRoom.status === 'ended' || existingRoom.status === 'deleted') {
          console.log('Attempted to reconnect to ended/deleted room:', roomId);
          socket.emit('chat:error', { message: 'Chat session has ended' });
          return;
        }

        // Join the existing room
        currentRoomIdString = roomId;
        
        // Create a new participant or update existing one
        let participant;
        const existingParticipant = await getChatParticipant(sessionId);
        if (existingParticipant) {
          await updateParticipantStatus(sessionId, true);
          participant = existingParticipant;
        } else {
          participant = await createChatParticipant(currentRoomIdString, sessionId);
        }

        console.log('[Chat Socket] Found participant:', {
          roomId: currentRoomIdString,
          participantId: participant.id,
          sessionId: participant.sessionId
        });

        // Join the socket room
        await socket.join(currentRoomIdString);

        // Emit participant status to the new participant
        socket.emit('chat:participant:status', {
          roomId: currentRoomIdString,
          sessionId: participant.sessionId,
          isOnline: true,
          isTyping: false,
          lastSeen: new Date(),
          isAdmin: socket.data.isAdmin || false
        });

        // Broadcast to room that this participant is online
        socket.to(currentRoomIdString).emit('chat:participant:status', {
          roomId: currentRoomIdString,
          sessionId: participant.sessionId,
          isOnline: true,
          isTyping: false,
          lastSeen: new Date(),
          isAdmin: socket.data.isAdmin || false
        });

        // Store visitor info if provided
        if (data.visitorInfo && data.visitorInfo.name && data.visitorInfo.email) {
          // Here you would store the visitor info in your database
          // This depends on your database schema and implementation
          const visitorInfoData = {
            name: data.visitorInfo.name,
            email: data.visitorInfo.email
          };
          await updateChatRoomVisitorInfo(roomId, visitorInfoData);
          console.log('Visitor info received:', { roomId: roomId, visitorInfo: visitorInfoData });
          
          // You might want to emit this info to admins
          const admins = adminSubscriptions.get(websiteId);
          if (admins && roomId) {
            admins.forEach(adminId => {
              const adminSocket = io.sockets.sockets.get(adminId);
              if (adminSocket) {
                adminSocket.emit('chat:visitor:info', {
                  roomId: roomId || '',
                  visitorInfo: visitorInfoData
                });
              }
            });
          }
        }

        // Send chat history for reconnection
        const chatHistory = await getChatMessagesByRoomId(currentRoomIdString);
        console.log(`Sending chat history for room ${currentRoomIdString}: ${chatHistory.length} messages`);
        
        // Send each message to the reconnecting client
        for (const message of chatHistory) {
          socket.emit('chat:message', {
            id: message.id,
            content: message.content,
            roomId: message.roomId,
            createdAt: message.createdAt,
            isVisitor: message.isVisitor,
            isRead: message.isRead,
            readAt: message.readAt || undefined
          });
        }
        
        // Emit joined event with session ID
        socket.emit('chat:joined', {
          roomId: currentRoomIdString
        });
        
        console.log('Successfully reconnected to room:', { 
          socketId: socket.id, 
          roomId: currentRoomIdString 
        });
        
        return;
      }

      if (!sessionId || !websiteId) {
        socket.emit('chat:error', { message: 'Invalid session data' });
        return;
      }

      // Create or join room
      if (!roomId) {
        const room = await createChatRoom(websiteId);
        roomId = room.id;
        console.log('Created new room:', { roomId: roomId, websiteId });

        // Store visitor info if provided
        if (data.visitorInfo && data.visitorInfo.name && data.visitorInfo.email) {
          // Here you would store the visitor info in your database
          // This depends on your database schema and implementation
          const visitorInfoData = {
            name: data.visitorInfo.name,
            email: data.visitorInfo.email
          };
          if (roomId) {
            await updateChatRoomVisitorInfo(roomId, visitorInfoData);
            console.log('Visitor info received:', { roomId: roomId, visitorInfo: visitorInfoData });
          }
          
          // You might want to emit this info to admins
          const admins = adminSubscriptions.get(websiteId);
          if (admins && roomId) {
            admins.forEach(adminId => {
              const adminSocket = io.sockets.sockets.get(adminId);
              if (adminSocket) {
                adminSocket.emit('chat:visitor:info', {
                  roomId: roomId || '',
                  visitorInfo: visitorInfoData
                });
              }
            });
          }
        }

        // Notify admins about new chat session
        const admins = adminSubscriptions.get(websiteId);
        if (admins && roomId) {
          admins.forEach(adminId => {
            const adminSocket = io.sockets.sockets.get(adminId);
            if (adminSocket) {
              adminSocket.join(roomId || '');
              adminSocket.emit('chat:session:new', {
                roomId: roomId || '',
                websiteId,
                visitorId: sessionId,
                isActive: true,
                visitorInfo: data.visitorInfo // Include visitor info in the new session notification
              });
            }
          });
        }
      } else {
        // Verify room exists and belongs to website
        const room = await getChatRoomById(roomId);
        if (!room || room.websiteId !== websiteId) {
          console.warn('Invalid room access attempt:', { roomId, websiteId });
          socket.emit('chat:error', { message: 'Invalid room' });
          return;
        }
        console.log('Joining existing room:', { roomId: roomId, websiteId });
      }

      if (!roomId) {
        socket.emit('chat:error', { message: 'Failed to create/join room' });
        return;
      }

     // Check if participant already exists
      const existingParticipant = await getChatParticipant(sessionId);
      if (existingParticipant) {
        await updateParticipantStatus(sessionId, true);
        console.log('Updated existing participant:', { sessionId, roomId });
      } else {
        // Create participant
        await createChatParticipant(roomId, sessionId);
        console.log('Created participant:', { sessionId, roomId });
      }

      // Join socket room
      currentRoomIdString = roomId?.toString();
      if (!currentRoomIdString) {
        socket.emit("chat:error", { message: "Invalid room ID" });
        return;
      }

      socket.join(currentRoomIdString);
      socket.data.roomId = currentRoomIdString;

      // Send current participant status to the new participant
      socket.emit('chat:participant:status', {
        roomId: currentRoomIdString,
        sessionId: socket.data.sessionId,
        isOnline: true,
        isTyping: false,
        lastSeen: new Date(),
        isAdmin: !!socket.data.isAdmin
      });

      // Notify room about the new participant
      io.to(currentRoomIdString).emit('chat:participant:status', {
        roomId: currentRoomIdString,
        sessionId: socket.data.sessionId,
        isOnline: true,
        isTyping: false,
        lastSeen: new Date(),
        isAdmin: !!socket.data.isAdmin
      });

      // Send admin status to the visitor
      if (!socket.data.isAdmin) {
        // Check if any admin is online for this website
        const admins = adminSubscriptions.get(websiteId);
        const isAdminOnline = !!(admins && admins.size > 0);
        
        // Send admin status to the visitor
        socket.emit('chat:participant:status', {
          roomId: currentRoomIdString,
          sessionId: 'admin', // Use a generic ID for admin
          isOnline: isAdminOnline,
          isTyping: false,
          lastSeen: new Date(),
          isAdmin: true
        });
      }

      // Emit joined event with room ID
      socket.emit('chat:joined', { roomId: currentRoomIdString });
      console.log('Successfully joined room:', { socketId: socket.id, roomId: currentRoomIdString });
    } catch (error) {
      console.error('Join error:', error);
      socket.emit('chat:error', { message: 'Failed to join chat' });
    }
  };

  const handleMessage = async (data: { 
    content: string; 
    roomId: string; 
    isAdmin?: boolean;
    visitorInfo?: {
      name: string;
      email: string;
    }
  }) => {
    try {
      console.log('Message received:', { 
        socketId: socket.id, 
        roomId: data.roomId,
        contentLength: data.content.length,
        isAdmin: data.isAdmin,
        hasVisitorInfo: !!data.visitorInfo
      });
      
      const { content, roomId, visitorInfo } = data;
      const { websiteId, sessionId } = socket.data;

      // If visitor info is provided and this is not an admin, store it
      if (visitorInfo && !socket.data.isAdmin) {
        // Here you would update the visitor info in your database
        // For example:
        await updateChatRoomVisitorInfo(roomId, visitorInfo);
        console.log('Visitor info received with message:', { roomId, visitorInfo });
        
        // Notify admins about visitor info
        io.to(roomId).emit('chat:visitor:info', {
          roomId,
          visitorInfo
        });
      }

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
      const { sessionId, isAdmin } = socket.data;

      await updateParticipantTyping(sessionId, isTyping, roomId);

      io.to(roomId).emit('chat:participant:status', {
        roomId,
        sessionId,
        isTyping,
        isOnline: true,
        lastSeen: new Date(),
        isAdmin: !!isAdmin
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

  // Handle visitor leaving the page
  const handleVisitorLeave = async (data: { roomId: string }) => {
    const { roomId } = data;
    try {
      console.log(`Handling visitor leave for room ${roomId}`);
      
      // Update participant status
      await updateParticipantStatus(socket.data.sessionId, false);
      
      // Notify room about participant status
      io.to(roomId).emit('chat:participant:status', {
        roomId,
        sessionId: socket.data.sessionId,
        isOnline: false,
        isTyping: false,
        lastSeen: new Date(),
        isAdmin: !!socket.data.isAdmin
      });
      
      // Update room status to ended
      await updateChatRoomStatus(roomId, 'ended');
      
      const existingLeaveMessage = await prisma.chatMessage.findFirst({
        where: {
          roomId,
          content: 'Visitor ended the chat',
          isSystem: true
        }
      });
      
      let systemMessage;
      
      if (!existingLeaveMessage) {
        // Add system message about visitor leaving
        systemMessage = await prisma.chatMessage.create({
          data: {
            content: 'Visitor ended the chat',
            isVisitor: false,
            isSystem: true,
            roomId: roomId,
          }
        });
      } else {
        systemMessage = existingLeaveMessage;
      }
      
      // Format the message for socket emission
      const formattedMessage = {
        id: systemMessage.id,
        content: systemMessage.content,
        roomId: systemMessage.roomId,
        createdAt: systemMessage.createdAt.toISOString(),
        isVisitor: systemMessage.isVisitor,
        isRead: systemMessage.isRead,
        isSystem: systemMessage.isSystem
      };
      
      // Emit visitor left event with the system message
      io.to(roomId).emit('chat:visitor:left', { 
        roomId,
        message: 'Visitor ended the chat',
        systemMessage: formattedMessage
      });
      
      // Notify all clients in the room about session end
      io.to(roomId).emit('chat:session:end', { roomId });
      
      console.log(`Successfully processed visitor leave for room ${roomId}`);
    } catch (error: any) {
      console.error('Visitor leave error:', error);
    }
  };

  // Handle admin status request
  const handleAdminStatusRequest = async (data: { websiteId: string }) => {
    try {
      const { websiteId } = data;
      
      // Check if any admin is online for this website
      const admins = adminSubscriptions.get(websiteId);
      const isAdminOnline = !!(admins && admins.size > 0);
      
      // Send admin status to the requesting client
      socket.emit('chat:admin:status', {
        isAdminOnline,
        websiteId
      });
      
      console.log('Admin status requested:', { websiteId, isAdminOnline });
    } catch (error) {
      console.error('Admin status request error:', error);
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
    socket.on('chat:visitor:leave', handleVisitorLeave);
  }

  socket.on('chat:message', handleMessage);
  socket.on('chat:typing', handleTyping);
  socket.on('chat:session:end', handleSessionEnd);
  socket.on('chat:delete', handleDeleteChat);
  socket.on('chat:admin:status:request', handleAdminStatusRequest);

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
          
          // Get all rooms for this website
          const rooms = await getChatRoomsByWebsiteId(websiteId);
          
          // Check if there are any other admins online
          const hasOtherAdminsOnline = admins.size > 0;
          
          // Notify all visitors in all rooms about admin status
          for (const room of rooms) {
            if (room && room.id && room.status === 'active') {
              // Only notify if this is the last admin going offline
              if (!hasOtherAdminsOnline) {
                io.to(room.id.toString()).emit('chat:participant:status', {
                  roomId: room.id.toString(),
                  sessionId: sessionId,
                  isOnline: false,
                  isTyping: false,
                  lastSeen: new Date(),
                  isAdmin: true
                });
              }
            }
          }
        }
      } else if (sessionId && roomId) {
        try {
          // Update participant status
          const participant = await getChatParticipant(sessionId);
          if (participant && participant.roomId === roomId) {
            await updateParticipantStatus(sessionId, false);
            
            // Notify about offline status
            io.to(roomId).emit('chat:participant:status', {
              roomId,
              sessionId,
              isOnline: false,
              isTyping: false,
              lastSeen: new Date(),
              isAdmin: !!socket.data.isAdmin
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