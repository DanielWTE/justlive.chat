export interface ServerToClientEvents {
  'chat:message': (message: {
    id: string;
    content: string;
    roomId: string;
    createdAt: Date;
    isVisitor: boolean;
    isRead: boolean;
    readAt?: Date;
  }) => void;
  'chat:typing': (data: { roomId: string; isTyping: boolean }) => void;
  'chat:error': (error: { message: string }) => void;
  'chat:joined': (data: { roomId: string }) => void;
  'chat:session:new': (data: { roomId: string; websiteId: string; visitorId: string; isActive: boolean }) => void;
  'chat:session:end': (data: { roomId: string }) => void;
  'chat:participant:status': (data: {
    roomId: string;
    sessionId: string;
    isOnline: boolean;
    isTyping: boolean;
    lastSeen: Date;
  }) => void;
  'chat:message:read': (data: { messageId: string; roomId: string; readAt: Date }) => void;
  'chat:room:deleted': (data: { roomId: string }) => void;
}

export interface ClientToServerEvents {
  'chat:join': (data: { websiteId: string; roomId?: string }) => void;
  'chat:leave': (data: { roomId: string }) => void;
  'chat:message': (data: { content: string; roomId: string; isAdmin?: boolean }) => void;
  'chat:typing': (data: { roomId: string; isTyping: boolean }) => void;
  'chat:admin:subscribe': (data: { websiteId: string }) => void;
  'chat:session:end': (data: { roomId: string }) => void;
  'chat:message:read': (data: { messageId: string; roomId: string }) => void;
  'chat:room:delete': (data: { roomId: string }) => void;
} 