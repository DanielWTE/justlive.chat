import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { X, MessageSquare, Clock } from "lucide-react";

interface Message {
  id: string;
  content: string;
  roomId: string;
  createdAt: Date;
  isVisitor: boolean;
  isRead: boolean;
  readAt?: Date;
}

interface ChatHeaderProps {
  onClose: () => void;
  isConnected: boolean;
  websiteDomain: string;
  isActive?: boolean;
  messages?: Message[];
  visitorStatus?: {
    isOnline: boolean;
    isTyping: boolean;
    lastSeen: Date;
  };
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  onClose, 
  isConnected,
  websiteDomain,
  isActive = true,
  messages = [],
  visitorStatus
}) => {
  const formatLastSeen = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
    return `${Math.floor(minutes / 1440)}d ago`;
  };

  const getLastMessageTime = () => {
    if (messages.length === 0) return null;
    
    // Sort messages by createdAt in descending order
    const sortedMessages = [...messages].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    return sortedMessages[0].createdAt;
  };

  const lastMessageTime = getLastMessageTime();

  return (
    <CardHeader className="px-4 py-3 border-b flex flex-row items-center justify-between space-y-0">
      <div className="flex items-center space-x-3">
        <div>
          <h2 className="text-lg font-semibold">{websiteDomain}</h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {!isActive && (
              <Badge variant="destructive" className="h-5 px-1.5 text-white">Chat Ended</Badge>
            )}
            {visitorStatus && isActive && (
              <>
                {visitorStatus.isOnline ? (
                  <Badge variant="success" className="h-5 px-1.5">Online</Badge>
                ) : (
                  <span>Last seen {formatLastSeen(visitorStatus.lastSeen)}</span>
                )}
                {visitorStatus.isTyping && (
                  <span className="text-muted-foreground">• typing...</span>
                )}
              </>
            )}
          </div>
          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              <span>{messages.length} messages</span>
            </div>
            {lastMessageTime && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>Last message: {formatLastSeen(new Date(lastMessageTime))}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
          <X className="h-4 w-4" />
        </Button>
      </div>
    </CardHeader>
  );
}; 