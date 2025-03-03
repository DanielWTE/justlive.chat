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
  isSystem?: boolean;
}

interface MessageListProps {
  messages: Message[];
  isTyping?: boolean;
  isAdminTyping?: boolean;
}

export const MessageList: React.FC<MessageListProps> = ({ 
  messages, 
  isTyping,
  isAdminTyping = false
}) => {
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [shouldScrollToBottom, setShouldScrollToBottom] = React.useState(true);
  const prevMessagesLength = React.useRef(messages.length);

  // Function to check if user is near bottom
  const isNearBottom = () => {
    const container = containerRef.current;
    if (!container) return true;
    
    const threshold = 150; // pixels from bottom
    return container.scrollHeight - container.scrollTop - container.clientHeight < threshold;
  };

  // Handle scroll events
  const handleScroll = () => {
    setShouldScrollToBottom(isNearBottom());
  };

  // Scroll to bottom if needed
  const scrollToBottomIfNeeded = () => {
    if (shouldScrollToBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Scroll to bottom when new messages arrive
  React.useEffect(() => {
    // If new messages were added
    if (messages.length > prevMessagesLength.current) {
      // If the last message is from the visitor or we're already near bottom, scroll to bottom
      const lastMessage = messages[messages.length - 1];
      if ((lastMessage && !lastMessage.isVisitor) || isNearBottom()) {
        scrollToBottomIfNeeded();
      }
    }
    
    prevMessagesLength.current = messages.length;
  }, [messages]);

  // Scroll to bottom when typing indicator changes
  React.useEffect(() => {
    if (isTyping && shouldScrollToBottom) {
      scrollToBottomIfNeeded();
    }
  }, [isTyping]);

  // Initial scroll to bottom
  React.useEffect(() => {
    scrollToBottomIfNeeded();
  }, []);

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div 
      ref={containerRef}
      className="h-full overflow-y-auto p-4 space-y-3"
      onScroll={handleScroll}
      style={{ overflowY: 'auto', height: '100%' }}
    >
      {messages.length === 0 && (
        <div className="flex items-center justify-center">
          <p className="text-muted-foreground text-sm">No messages yet</p>
        </div>
      )}
      
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            message.isSystem 
              ? "flex justify-center"
              : "flex",
            !message.isSystem && message.isVisitor ? "justify-start" : "justify-end"
          )}
        >
          {message.isSystem ? (
            <div className="bg-muted/50 px-4 py-2 rounded-md text-sm text-muted-foreground max-w-[80%] text-center my-3 border border-border/50 shadow-sm w-fit mx-auto">
              {message.content}
            </div>
          ) : (
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
          )}
        </div>
      ))}
      
      {isTyping && !isAdminTyping && (
        <div className="flex justify-start mb-2">
          <div className="bg-muted px-3 py-2 rounded-lg max-w-[80px] shadow-sm">
            <div className="flex items-center space-x-1.5 py-0.5">
              <div className="h-2.5 w-2.5 rounded-full bg-primary/80 animate-pulse" style={{ animationDelay: "0ms", animationDuration: "1.2s" }} />
              <div className="h-2.5 w-2.5 rounded-full bg-primary/80 animate-pulse" style={{ animationDelay: "300ms", animationDuration: "1.2s" }} />
              <div className="h-2.5 w-2.5 rounded-full bg-primary/80 animate-pulse" style={{ animationDelay: "600ms", animationDuration: "1.2s" }} />
            </div>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
}; 