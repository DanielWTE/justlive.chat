import React from 'react';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { ChatHeader } from './ChatHeader';
import { Socket } from 'socket.io-client';
import { ClientToServerEvents, ServerToClientEvents } from '@/types/socket';
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface Message {
  id: string;
  content: string;
  roomId: string;
  createdAt: Date;
  isVisitor: boolean;
  isRead: boolean;
  readAt?: Date;
}

interface ChatWindowProps {
  websiteId: string;
  roomId: string;
  onClose: () => void;
  onSendMessage: (content: string) => void;
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | null;
  isConnected: boolean;
  messages: Message[];
  websiteDomain: string;
  websiteName?: string;
  isActive?: boolean;
  visitorStatus?: {
    isOnline: boolean;
    isTyping: boolean;
    lastSeen: Date;
    isAdmin?: boolean;
  };
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  websiteId,
  roomId,
  onClose,
  onSendMessage,
  socket,
  isConnected,
  messages,
  websiteDomain,
  websiteName,
  isActive = true,
  visitorStatus,
}) => {
  const [isTyping, setIsTyping] = React.useState(false);
  let typingTimeout: NodeJS.Timeout;

  // Handle typing indicator
  const handleTyping = (typing: boolean) => {
    setIsTyping(typing);
    if (socket && isConnected) {
      socket.emit('chat:typing', { roomId, isTyping: typing });
    }
  };

  // Mark messages as read
  React.useEffect(() => {
    if (socket && isConnected) {
      messages.forEach(message => {
        if (message.isVisitor && !message.isRead) {
          socket.emit('chat:message:read', { messageId: message.id, roomId });
        }
      });
    }
  }, [messages, socket, isConnected, roomId]);

  return (
    <Card className="flex flex-col h-full overflow-hidden border rounded-lg shadow-sm py-0">
      <ChatHeader 
        onClose={onClose} 
        isConnected={isConnected} 
        websiteDomain={websiteDomain}
        websiteName={websiteName}
        visitorStatus={visitorStatus}
        isActive={isActive}
        messages={messages}
      />
      <CardContent className="flex-1 p-0 overflow-hidden">
        <div className="overflow-hidden">
          <MessageList 
            messages={messages} 
            isTyping={visitorStatus?.isTyping}
            isAdminTyping={isTyping}
          />
        </div>
        {!isActive && (
          <div className="bg-muted/30 p-3 text-center text-sm text-muted-foreground border-t">
            This chat has ended. You cannot send new messages.
          </div>
        )}
      </CardContent>
      <CardFooter className="p-0 border-t">
        <MessageInput 
          onSendMessage={onSendMessage} 
          disabled={!isConnected || !isActive}
          onTyping={handleTyping}
          isActive={isActive}
        />
      </CardFooter>
    </Card>
  );
}; 