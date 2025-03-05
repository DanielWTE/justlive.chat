import { prisma } from './prisma';
import { generateId } from '../utils/ids';

// Room operations
export const createChatRoom = async (websiteId: string) => {
  return prisma.chatRoom.create({
    data: {
      id: generateId(),
      websiteId,
    },
  });
};

export const getChatRoomById = async (roomId: string) => {
  return prisma.chatRoom.findUnique({
    where: { id: roomId },
    include: {
      messages: true,
      participants: true,
    },
  });
};

export const getChatRoomsByWebsiteId = async (websiteId: string) => {
  console.log(`Getting chat rooms for website ${websiteId}`);
  const rooms = await prisma.chatRoom.findMany({
    where: { 
      websiteId,
      // participants: {
      //   some: {} // Only rooms with participants
      // },
      // Don't filter by status - show both active and ended chats
    },
    include: {
      messages: {
        orderBy: {
          createdAt: 'asc'
        }
      },
      participants: true,
    },
    orderBy: {
      lastActivity: 'desc'
    }
  });
  console.log(`Found ${rooms.length} chat rooms for website ${websiteId}`);
  return rooms;
};

// Message operations
export const getChatMessagesByRoomId = async (roomId: string) => {
  return prisma.chatMessage.findMany({
    where: { roomId },
    orderBy: {
      createdAt: 'asc'
    }
  });
};

export const createChatMessage = async (
  roomId: string, 
  content: string, 
  isVisitor: boolean = true,
  isSystem: boolean = false
) => {
  // Create the message
  const message = await prisma.chatMessage.create({
    data: {
      id: generateId(),
      content,
      roomId,
      isVisitor,
      isSystem,
      isRead: false
    },
  });

  // Update the room's lastActivity timestamp
  await prisma.chatRoom.update({
    where: { id: roomId },
    data: {
      lastActivity: new Date()
    }
  });

  return message;
};

export const markMessageAsRead = async (messageId: string) => {
  return prisma.chatMessage.update({
    where: { id: messageId },
    data: {
      isRead: true,
      readAt: new Date()
    }
  });
};

// Participant operations
export const createChatParticipant = async (roomId: string, sessionId: string) => {
  return prisma.chatParticipant.create({
    data: {
      id: generateId(),
      sessionId,
      roomId,
      isOnline: true,
        isTyping: false,
        lastSeen: new Date()
      },
    });
};

export const updateParticipantStatus = async (sessionId: string, isOnline: boolean) => {
  return prisma.chatParticipant.update({
    where: { sessionId },
    data: {
      isOnline,
      lastSeen: new Date()
    }
  });
};

export const updateParticipantTyping = async (sessionId: string, isTyping: boolean, roomId?: string) => {
  try {
    return await prisma.chatParticipant.update({
      where: { sessionId },
      data: {
        isTyping,
        lastActivity: new Date()
      }
    });
  } catch (error: any) {
    // If the participant doesn't exist and we have a roomId, create it
    if (error.code === 'P2025' && roomId) {
      console.log(`Creating missing participant for session ${sessionId} in room ${roomId}`);
      return await createChatParticipant(roomId, sessionId);
    }
    throw error;
  }
};

export const removeChatParticipant = async (sessionId: string) => {
  return prisma.chatParticipant.delete({
    where: { sessionId },
  });
};

export const getChatParticipant = async (sessionId: string) => {
  return prisma.chatParticipant.findUnique({
    where: { sessionId },
    include: {
      room: true,
    },
  });
};

// Update chat room status
export const updateChatRoomStatus = async (roomId: string, status: 'active' | 'ended') => {
  return prisma.chatRoom.update({
    where: { id: roomId },
    data: {
      status,
      lastActivity: new Date()
    }
  });
};

// Delete a chat room and all related data
export const deleteChatRoom = async (roomId: string) => {
  // First delete all messages and participants (due to foreign key constraints)
  await prisma.chatMessage.deleteMany({
    where: { roomId }
  });
  
  await prisma.chatParticipant.deleteMany({
    where: { roomId }
  });
  
  // Then delete the room itself
  return prisma.chatRoom.delete({
    where: { id: roomId }
  });
};

// Update visitor info
export const updateChatRoomVisitorInfo = async (
  roomId: string, 
  visitorInfo: { 
    name: string; 
    email: string; 
    url?: string;
    pageTitle?: string;
  }
) => {
  return prisma.chatRoom.update({
    where: { id: roomId },
    data: {
      visitorName: visitorInfo.name,
      visitorEmail: visitorInfo.email,
      visitorUrl: visitorInfo.url,
      visitorPageTitle: visitorInfo.pageTitle,
    },
  });
}; 