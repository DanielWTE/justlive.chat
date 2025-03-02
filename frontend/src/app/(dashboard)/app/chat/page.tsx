'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MessageSquare, Search, User, Clock, ArrowRight, Menu } from "lucide-react";
import { useState } from "react";

interface ChatConversation {
  id: string;
  website: string;
  visitor: {
    id: string;
    name: string;
  };
  lastMessage: string;
  status: 'active' | 'closed';
  updatedAt: string;
}

// Example data - will be replaced with real data later
const exampleConversations: ChatConversation[] = [
  {
    id: "1",
    website: "mystore.com",
    visitor: {
      id: "v1",
      name: "John Doe",
    },
    lastMessage: "Hi, I need help with my order #123",
    status: "active",
    updatedAt: "2024-03-10T14:30:00Z",
  },
];

export default function ChatPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState(exampleConversations[0]);

  const ConversationsList = () => (
    <div className="flex-1 overflow-y-auto">
      {exampleConversations.map((conversation) => (
        <button
          key={conversation.id}
          className="w-full p-4 text-left hover:bg-accent hover:text-accent-foreground border-b transition-colors"
          onClick={() => {
            setSelectedChat(conversation);
            setIsOpen(false);
          }}
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="font-medium flex items-center">
                <User className="h-4 w-4 mr-2" />
                {conversation.visitor.name}
              </p>
              <p className="text-sm text-muted-foreground line-clamp-1">
                {conversation.lastMessage}
              </p>
            </div>
            <span className="text-xs text-muted-foreground flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {new Date(conversation.updatedAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {conversation.website}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              conversation.status === 'active'
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-700'
            }`}>
              {conversation.status}
            </span>
          </div>
        </button>
      ))}
    </div>
  );

  return (
    <div className="flex h-full">
      {/* Mobile Conversations List Trigger */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden absolute left-4 top-4"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 p-0">
          <div className="flex flex-col h-full">
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  className="pl-9"
                />
              </div>
            </div>
            <ConversationsList />
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Conversations List */}
      <div className="hidden md:flex w-80 border-r flex-col">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              className="pl-9"
            />
          </div>
        </div>
        <ConversationsList />
      </div>

      {/* Chat Area */}
      {selectedChat ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold">Chat with {selectedChat.visitor.name}</h2>
                <p className="text-sm text-muted-foreground">
                  From {selectedChat.website}
                </p>
              </div>
              <Button variant="outline" size="sm">
                Close Chat
              </Button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 space-y-4 overflow-y-auto">
            <div className="flex items-start gap-3 max-w-md">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                <User className="h-4 w-4" />
              </span>
              <div className="flex flex-col gap-2">
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-sm">{selectedChat.lastMessage}</p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(selectedChat.updatedAt).toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>

          {/* Message Input */}
          <div className="p-4 border-t">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Type your message..."
                className="flex-1"
              />
              <Button>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="mr-2 h-5 w-5" />
                No Active Conversations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                When visitors start chatting on your website, their conversations will appear here.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
} 