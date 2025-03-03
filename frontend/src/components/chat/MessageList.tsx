import React from 'react';
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface Message {
  id: string;
  content: string;
  roomId: string;
  createdAt: Date;
  isVisitor: boolean;
  isRead: boolean;
  readAt?: Date;
}

interface MessageListProps {
  messages: Message[];
  isTyping?: boolean;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, isTyping }) => {
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            "flex",
            message.isVisitor ? "justify-start" : "justify-end"
          )}
        >
          <div
            className={cn(
              "max-w-[80%] px-3 py-2 rounded-lg",
              message.isVisitor
                ? "bg-muted"
                : "bg-primary text-primary-foreground"
            )}
          >
            <p className="text-sm break-words">{message.content}</p>
            <div className="flex items-center justify-end gap-2 mt-1">
              <span className="text-xs opacity-75">
                {formatTime(message.createdAt)}
              </span>
              {!message.isVisitor && (
                <span className="text-xs">
                  {message.isRead ? (
                    <span title={`Read ${message.readAt ? formatTime(message.readAt) : ''}`} className="text-green-500">
                      ✓✓
                    </span>
                  ) : (
                    <span title="Sent" className="text-muted-foreground">✓</span>
                  )}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
      {isTyping && (
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <div className="flex space-x-1">
            <Skeleton className="h-2 w-2 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <Skeleton className="h-2 w-2 rounded-full animate-bounce" style={{ animationDelay: "200ms" }} />
            <Skeleton className="h-2 w-2 rounded-full animate-bounce" style={{ animationDelay: "400ms" }} />
          </div>
          <span>typing...</span>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}; 