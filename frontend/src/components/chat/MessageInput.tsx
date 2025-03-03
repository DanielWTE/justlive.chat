import React, { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  onTyping: (isTyping: boolean) => void;
  disabled?: boolean;
  isActive?: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({ 
  onSendMessage, 
  onTyping,
  disabled,
  isActive = true
}) => {
  const [message, setMessage] = React.useState('');
  const typingTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const handleTyping = () => {
    onTyping(true);
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      onTyping(false);
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled && isActive) {
      onSendMessage(message.trim());
      setMessage('');
      onTyping(false);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  };

  React.useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const getPlaceholderText = () => {
    if (!isActive) return "This chat has ended";
    if (disabled) return "Connecting...";
    return "Type a message...";
  };

  return (
    <form onSubmit={handleSubmit} className="w-full p-3">
      <div className="flex gap-2">
        <Input
          type="text"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            handleTyping();
          }}
          placeholder={getPlaceholderText()}
          disabled={disabled || !isActive}
          className="flex-1"
        />
        <Button
          type="submit"
          disabled={!message.trim() || disabled || !isActive}
          size="icon"
          className="h-10 w-10"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}; 