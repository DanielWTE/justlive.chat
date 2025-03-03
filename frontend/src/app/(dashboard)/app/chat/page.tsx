"use client";

import React from "react";
import { io, Socket } from "socket.io-client";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { ClientToServerEvents, ServerToClientEvents } from "@/types/socket";
import { Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

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

interface ChatSession {
  roomId: string;
  websiteId: string;
  messages: Message[];
  lastActivity: Date;
  isActive: boolean;
  visitorId?: string;
  visitorInfo?: {
    name: string;
    email: string;
  };
  visitorStatus: {
    isOnline: boolean;
    isTyping: boolean;
    lastSeen: Date;
    isAdmin?: boolean;
  };
}

export default function ChatPage() {
  const [socket, setSocket] = React.useState<Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null>(null);
  const [chatSessions, setChatSessions] = React.useState<
    Record<string, ChatSession>
  >({});
  const [activeRoomId, setActiveRoomId] = React.useState<string | null>(null);
  const [isConnected, setIsConnected] = React.useState(false);
  const [websites, setWebsites] = React.useState<
    Array<{ id: string; name: string; domain: string }>
  >([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [loadedMessageRooms, setLoadedMessageRooms] = React.useState<
    Set<string>
  >(new Set());
  const [isMobileView, setIsMobileView] = React.useState(false);

  // Load chat sessions from server via socket connection
  React.useEffect(() => {
    // Chat sessions will be loaded from the server via socket connection
    // when we subscribe to websites
    setIsLoading(false);
  }, []);

  // Function to load message history for a room
  const loadMessageHistory = React.useCallback(
    async (roomId: string, websiteId: string) => {
      // Skip if we've already loaded messages for this room
      if (loadedMessageRooms.has(roomId)) {
        console.log(`Messages for room ${roomId} already loaded`);
        return;
      }

      try {
        console.log(`Loading message history for room ${roomId}`);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}chat/messages/${roomId}`,
          {
            credentials: "include",
            headers: {
              "x-website-id": websiteId,
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error(
            `Failed to load messages: ${response.status} ${response.statusText}`,
            errorData
          );
          throw new Error("Failed to load messages");
        }

        const data = await response.json();
        console.log(
          `Loaded ${data.messages?.length || 0} messages for room ${roomId}`
        );

        setChatSessions((prev) => {
          // Get existing messages for this room
          const existingMessages = prev[roomId]?.messages || [];

          // Create a map of existing message IDs for quick lookup
          const existingMessageIds = new Set(
            existingMessages.map((msg: Message) => msg.id)
          );

          // Process new messages, converting dates
          const newMessages = data.messages.map((msg: any) => ({
            ...msg,
            createdAt: new Date(msg.createdAt),
            readAt: msg.readAt ? new Date(msg.readAt) : undefined,
            isSystem: msg.isSystem || false,
          }));

          // Filter out messages that already exist in our state
          const uniqueNewMessages = newMessages.filter(
            (msg: any) => !existingMessageIds.has(msg.id)
          );

          console.log(
            `Adding ${uniqueNewMessages.length} unique new messages to room ${roomId}`
          );

          // Combine existing and new messages
          const combinedMessages = [...existingMessages, ...uniqueNewMessages];

          // Sort messages by creation time
          const sortedMessages = combinedMessages.sort(
            (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
          );

          return {
            ...prev,
            [roomId]: {
              ...prev[roomId],
              messages: sortedMessages,
            },
          };
        });

        // Mark this room as having had its messages loaded
        setLoadedMessageRooms((prev) => new Set([...prev, roomId]));
      } catch (error) {
        console.error("Failed to load message history:", error);
      }
    },
    [loadedMessageRooms, setChatSessions]
  );

  // Fetch websites on mount
  React.useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}websites/list`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setWebsites(data.websites);
      })
      .catch((err) => console.error("Failed to fetch websites:", err));
  }, []);

  // Load message history for active sessions after websites are loaded
  React.useEffect(() => {
    if (websites.length > 0 && Object.keys(chatSessions).length > 0) {
      console.log("Loading message history for all sessions...");
      // Load for all sessions, not just active ones
      Object.values(chatSessions).forEach((session) => {
        console.log(
          `Loading message history for session ${session.roomId} (status: ${
            session.isActive ? "active" : "ended"
          })`
        );
        loadMessageHistory(session.roomId, session.websiteId);
      });
    }
  }, [websites, chatSessions, loadMessageHistory]);

  // Load all chat sessions from the database on mount
  React.useEffect(() => {
    if (websites.length === 0) return;

    const loadAllChatSessions = async () => {
      try {
        console.log("Loading all chat sessions from database...");
        const websiteId = websites[0].id;

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}chat/rooms?websiteId=${websiteId}`,
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to load chat sessions: ${response.status}`);
        }

        const data = await response.json();
        console.log(`Loaded ${data.rooms.length} chat sessions from database`);

        // Convert to our local format and update state
        const sessions: Record<string, ChatSession> = {};

        data.rooms.forEach((room: any) => {
          // Process messages and ensure no duplicates
          const processedMessages = room.messages.map((msg: any) => ({
            id: msg.id,
            content: msg.content,
            roomId: msg.roomId,
            createdAt: new Date(msg.createdAt),
            isVisitor: msg.isVisitor,
            isRead: msg.isRead,
            readAt: msg.readAt ? new Date(msg.readAt) : undefined,
            isSystem: msg.isSystem || false,
          }));

          // Create a map to identify duplicate messages by ID
          const messageMap = new Map<string, Message>();
          processedMessages.forEach((msg: Message) => {
            messageMap.set(msg.id, msg);
          });

          // Convert back to array with no duplicates
          const uniqueMessages = Array.from(messageMap.values());

          // Sort messages by creation time
          const sortedMessages = uniqueMessages.sort(
            (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
          );

          sessions[room.id] = {
            roomId: room.id,
            websiteId: room.websiteId,
            messages: sortedMessages,
            lastActivity: new Date(
              room.lastActivity || room.updatedAt || room.createdAt
            ),
            isActive: room.status === "active",
            visitorStatus: {
              isOnline: room.participants?.[0]?.isOnline || false,
              isTyping: room.participants?.[0]?.isTyping || false,
              lastSeen: new Date(
                room.participants?.[0]?.lastSeen ||
                  room.updatedAt ||
                  room.createdAt
              ),
            },
          };
        });

        // Update state with the new sessions
        setChatSessions((prev) => {
          // For each new session, check if we already have it
          const updatedSessions: Record<string, ChatSession> = { ...prev };

          Object.entries(sessions).forEach(([roomId, newSession]) => {
            if (updatedSessions[roomId]) {
              // If we already have this session, merge the messages
              const existingMessages = updatedSessions[roomId].messages;
              const existingMessageIds = new Set(
                existingMessages.map((msg: Message) => msg.id)
              );

              // Filter out messages that already exist
              const uniqueNewMessages = newSession.messages.filter(
                (msg: Message) => !existingMessageIds.has(msg.id)
              );

              // Combine and sort messages
              const combinedMessages = [
                ...existingMessages,
                ...uniqueNewMessages,
              ].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

              // Update the session with merged messages
              updatedSessions[roomId] = {
                ...newSession,
                messages: combinedMessages,
              };
            } else {
              // If this is a new session, just add it
              updatedSessions[roomId] = newSession;
            }
          });

          return updatedSessions;
        });

        // Mark all rooms as having had their messages loaded
        setLoadedMessageRooms(new Set(Object.keys(sessions)));
      } catch (error) {
        console.error("Failed to load chat sessions:", error);
      }
    };

    loadAllChatSessions();
  }, [websites]);

  // Initialize socket connection
  React.useEffect(() => {
    if (websites.length === 0) {
      console.log("Waiting for websites to be loaded...");
      return;
    }

    console.log("Initializing socket with websiteId:", websites[0].id);
    const socketInstance = io(`${process.env.NEXT_PUBLIC_API_URL}`, {
      auth: {
        isAdmin: true,
        websiteId: websites[0].id, // Use first website's ID for initial auth
      },
      withCredentials: true,
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      extraHeaders: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });

    socketInstance.on("connect", () => {
      console.log("Connected to chat server");
      setIsConnected(true);

      // Subscribe to all websites for admin
      websites.forEach((website) => {
        console.log("Subscribing to website:", website.id);
        socketInstance.emit("chat:admin:subscribe", { websiteId: website.id });
      });
    });

    // Handle new chat session
    socketInstance.on("chat:session:new", (data) => {
      console.log("New chat session:", data);

      // First update the chat sessions state
      setChatSessions((prev) => {
        // Check if we already have this session
        if (prev[data.roomId]) {
          console.log(
            `Session ${data.roomId} already exists, updating status to ${
              data.isActive ? "active" : "inactive"
            }`
          );
          return {
            ...prev,
            [data.roomId]: {
              ...prev[data.roomId],
              isActive: data.isActive,
              lastActivity: new Date(),
              // Update visitor info if provided
              ...(data.visitorInfo ? { visitorInfo: data.visitorInfo } : {}),
            },
          };
        }

        console.log(
          `Creating new session ${data.roomId} with status ${
            data.isActive ? "active" : "inactive"
          }`
        );

        const updatedSessions = {
          ...prev,
          [data.roomId]: {
            roomId: data.roomId,
            websiteId: data.websiteId,
            messages: [],
            lastActivity: new Date(),
            isActive: data.isActive,
            visitorId: data.visitorId,
            visitorInfo: data.visitorInfo, // Add visitor info
            visitorStatus: {
              isOnline: true,
              isTyping: false,
              lastSeen: new Date(),
            },
          },
        };

        // After state update, load message history
        // We need to use the updated session data directly since state update is async
        setTimeout(() => {
          console.log(
            `Loading message history for new session ${data.roomId} with websiteId ${data.websiteId}`
          );
          loadMessageHistory(data.roomId, data.websiteId);
        }, 100);

        return updatedSessions;
      });
    });

    // Handle chat messages
    socketInstance.on("chat:message", (message) => {
      console.log("Received message:", message);

      // Ensure the chat session exists
      setChatSessions((prev) => {
        // If we don't have this session yet, create it
        if (!prev[message.roomId]) {
          console.log(`Creating new session for room ${message.roomId}`);
          // We need to get the websiteId from somewhere
          // For now, use the first website as a fallback
          const websiteId = websites[0]?.id;

          if (!websiteId) {
            console.error("Cannot create session: No websiteId available");
            return prev;
          }

          return {
            ...prev,
            [message.roomId]: {
              roomId: message.roomId,
              websiteId,
              messages: [
                {
                  ...message,
                  createdAt: new Date(message.createdAt),
                  readAt: message.readAt ? new Date(message.readAt) : undefined,
                },
              ],
              lastActivity: new Date(),
              isActive: true,
              visitorStatus: {
                isOnline: true,
                isTyping: false,
                lastSeen: new Date(),
              },
            },
          };
        }

        // Check if this message already exists in the session
        const existingMessages = prev[message.roomId]?.messages || [];
        const messageExists = existingMessages.some(
          (msg: Message) => msg.id === message.id
        );

        if (messageExists) {
          console.log(
            `Message ${message.id} already exists in room ${message.roomId}, skipping`
          );
          return prev;
        }

        console.log(
          `Adding new message ${message.id} to room ${message.roomId}`
        );

        // Otherwise, add the message to the existing session
        return {
          ...prev,
          [message.roomId]: {
            ...prev[message.roomId],
            messages: [
              ...(prev[message.roomId]?.messages || []),
              {
                ...message,
                createdAt: new Date(message.createdAt),
                readAt: message.readAt ? new Date(message.readAt) : undefined,
              },
            ],
            lastActivity: new Date(),
          },
        };
      });
    });

    // Handle message read status
    socketInstance.on("chat:message:read", (data) => {
      setChatSessions((prev) => ({
        ...prev,
        [data.roomId]: {
          ...prev[data.roomId],
          messages: prev[data.roomId].messages.map((msg) =>
            msg.id === data.messageId
              ? { ...msg, isRead: true, readAt: new Date(data.readAt) }
              : msg
          ),
        },
      }));
    });

    // Handle participant status
    socketInstance.on("chat:participant:status", (data) => {
      console.log("Participant status update:", data);

      setChatSessions((prev) => {
        // If we don't have this session yet, ignore the update
        if (!prev[data.roomId]) {
          console.log(
            `Ignoring participant status for unknown room ${data.roomId}`
          );
          return prev;
        }

        return {
          ...prev,
          [data.roomId]: {
            ...prev[data.roomId],
            visitorStatus: {
              isOnline: data.isOnline,
              isTyping: data.isTyping,
              lastSeen: new Date(data.lastSeen),
              isAdmin: data.isAdmin,
            },
            lastActivity: new Date(),
          },
        };
      });
    });

    // Handle visitor left event
    socketInstance.on("chat:visitor:left", (data) => {
      console.log("Visitor left chat:", data);

      setChatSessions((prev) => {
        // If we don't have this session yet, ignore the update
        if (!prev[data.roomId]) {
          console.log(
            `Ignoring visitor left event for unknown room ${data.roomId}`
          );
          return prev;
        }

        // Wenn eine System-Nachricht vom Server mitgeschickt wurde, verwenden wir diese
        let updatedMessages = [...prev[data.roomId].messages];

        if (data.systemMessage) {
          // Prüfe, ob diese Nachricht bereits existiert (basierend auf ID oder Inhalt)
          const messageExists = updatedMessages.some(
            (msg) =>
              msg.id === data.systemMessage?.id ||
              (msg.isSystem && msg.content === data.systemMessage?.content)
          );

          if (!messageExists) {
            // Konvertiere das Datum zurück zu einem Date-Objekt
            const systemMessage = {
              ...data.systemMessage,
              createdAt: new Date(data.systemMessage.createdAt),
            };

            // Füge die System-Nachricht hinzu
            updatedMessages = [...updatedMessages, systemMessage];
            console.log(
              `Added system message from server for room ${data.roomId}`
            );
          }
        } else {
          // Fallback: Erstelle eine lokale System-Nachricht, wenn keine vom Server kommt
          const systemMessageId = `system-${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 9)}`;

          // Prüfe, ob bereits eine ähnliche Nachricht existiert
          const messageExists = updatedMessages.some(
            (msg) => msg.isSystem && msg.content === data.message
          );

          if (!messageExists) {
            const systemMessage = {
              id: systemMessageId,
              content: data.message,
              roomId: data.roomId,
              createdAt: new Date(),
              isVisitor: false,
              isRead: true,
              isSystem: true,
            };

            updatedMessages = [...updatedMessages, systemMessage];
            console.log(`Added local system message for room ${data.roomId}`);
          }
        }

        return {
          ...prev,
          [data.roomId]: {
            ...prev[data.roomId],
            visitorStatus: {
              ...prev[data.roomId].visitorStatus,
              isOnline: false,
              isTyping: false,
              lastSeen: new Date(),
            },
            messages: updatedMessages,
            lastActivity: new Date(),
            isActive: false, // Markiere den Chat als inaktiv
          },
        };
      });

      console.log(`Processed visitor left event for room ${data.roomId}`);
    });

    // Handle session end
    socketInstance.on("chat:session:end", (data) => {
      console.log("Chat session ended:", data);

      setChatSessions((prev) => {
        // If we don't have this session, ignore the update
        if (!prev[data.roomId]) {
          console.log(`Ignoring session end for unknown room ${data.roomId}`);
          return prev;
        }

        console.log(`Marking room ${data.roomId} as inactive in local state`);

        // Check if the session is already marked as inactive
        if (prev[data.roomId] && !prev[data.roomId].isActive) {
          console.log(`Room ${data.roomId} is already marked as inactive`);
        }

        return {
          ...prev,
          [data.roomId]: {
            ...prev[data.roomId],
            isActive: false,
            visitorStatus: {
              ...prev[data.roomId].visitorStatus,
              isOnline: false,
              isTyping: false,
              lastSeen: new Date(),
            },
            lastActivity: new Date(),
          },
        };
      });

      // If this was the active room, clear it
      if (activeRoomId === data.roomId) {
        console.log(
          `Clearing active room ID ${data.roomId} due to session end`
        );
        setActiveRoomId(null);
      }
    });

    // Handle room deleted
    socketInstance.on("chat:room:deleted", (data) => {
      console.log("Chat room deleted:", data);

      // Remove from local state
      setChatSessions((prev) => {
        const newSessions = { ...prev };
        delete newSessions[data.roomId];
        return newSessions;
      });

      // If this was the active room, clear it
      if (activeRoomId === data.roomId) {
        setActiveRoomId(null);
      }

      // Remove from loaded message rooms
      setLoadedMessageRooms((prev) => {
        const newSet = new Set(prev);
        newSet.delete(data.roomId);
        return newSet;
      });
    });

    // Handle visitor info updates
    socketInstance.on("chat:visitor:info", (data) => {
      console.log("Visitor info received:", data);

      setChatSessions((prev) => {
        // If we don't have this session, ignore the update
        if (!prev[data.roomId]) {
          console.log(`Ignoring visitor info for unknown room ${data.roomId}`);
          return prev;
        }

        console.log(`Updating visitor info for room ${data.roomId}`);

        return {
          ...prev,
          [data.roomId]: {
            ...prev[data.roomId],
            visitorInfo: data.visitorInfo,
          },
        };
      });
    });

    socketInstance.on("chat:error", (error) => {
      console.error("Chat error:", error.message);
    });

    socketInstance.on("disconnect", () => {
      console.log("Disconnected from chat server");
      setIsConnected(false);
    });

    socketInstance.on("connect_error", (error) => {
      console.error("Connection error:", error);
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [websites]);

  // Load message history when active room changes
  React.useEffect(() => {
    if (activeRoomId && chatSessions[activeRoomId]) {
      const websiteId = chatSessions[activeRoomId].websiteId;
      if (websiteId) {
        console.log(
          `Loading message history for selected room ${activeRoomId} with websiteId ${websiteId}`
        );
        loadMessageHistory(activeRoomId, websiteId);
      }
    }
  }, [activeRoomId, chatSessions, loadMessageHistory]);

  // Check if we're on mobile view
  React.useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobileView();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkMobileView);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobileView);
  }, []);

  // Function to handle selecting a chat session
  const handleSelectChatSession = (roomId: string) => {
    setActiveRoomId(roomId);
  };

  // Function to go back to chat list on mobile
  const handleBackToList = () => {
    setActiveRoomId(null);
  };

  const handleSendMessage = (content: string) => {
    if (socket && activeRoomId && isConnected) {
      console.log("Sending message:", { content, roomId: activeRoomId });
      socket.emit("chat:message", {
        content,
        roomId: activeRoomId,
        isAdmin: true,
      });
    }
  };

  const handleCloseChat = () => {
    if (socket && activeRoomId) {
      console.log(`Closing chat window for room ${activeRoomId}`);

      // We don't end the session here, just close the window
      console.log(`Clearing active room ID ${activeRoomId}`);
      setActiveRoomId(null);
    }
  };

  // End a chat session
  const handleEndChat = (roomId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent selecting the chat

    console.log(`Ending chat session ${roomId}`);

    if (socket && roomId) {
      // Send end session event to server
      console.log(`Emitting chat:session:end event for room ${roomId}`);
      socket.emit("chat:session:end", { roomId });

      // Update local state to mark session as inactive
      console.log(`Updating local state to mark session ${roomId} as inactive`);
      setChatSessions((prev) => {
        if (!prev[roomId]) {
          console.log(`Room ${roomId} not found in chat sessions`);
          return prev;
        }

        console.log(`Setting isActive to false for room ${roomId}`);
        return {
          ...prev,
          [roomId]: {
            ...prev[roomId],
            isActive: false,
            visitorStatus: {
              ...prev[roomId].visitorStatus,
              isOnline: false,
              isTyping: false,
              lastSeen: new Date(),
            },
            lastActivity: new Date(),
          },
        };
      });

      // If this was the active room, clear it
      if (activeRoomId === roomId) {
        console.log(`Clearing active room ID ${roomId}`);
        setActiveRoomId(null);
      }
    } else {
      console.error(`Cannot end chat: socket=${!!socket}, roomId=${roomId}`);
    }
  };

  // Delete a chat session
  const handleDeleteChat = (roomId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent selecting the chat

    if (socket && roomId) {
      // Send delete chat event to server
      socket.emit("chat:room:delete", { roomId });

      // Remove from local state
      setChatSessions((prev) => {
        const newSessions = { ...prev };
        delete newSessions[roomId];
        return newSessions;
      });

      // If this was the active room, clear it
      if (activeRoomId === roomId) {
        setActiveRoomId(null);
      }

      // Remove from loaded message rooms
      setLoadedMessageRooms((prev) => {
        const newSet = new Set(prev);
        newSet.delete(roomId);
        return newSet;
      });
    }
  };

  const getWebsiteName = (websiteId: string) => {
    return websites.find((w) => w.id === websiteId)?.name || "Unknown Website";
  };

  const getWebsiteDomain = (websiteId: string) => {
    return websites.find((w) => w.id === websiteId)?.domain || "unknown.com";
  };

  // Get the timestamp of the last message in a chat session
  const getLastMessageTime = (session: ChatSession) => {
    if (session.messages.length === 0) {
      return session.lastActivity;
    }

    // Sort messages by createdAt in descending order and get the first one
    const lastMessage = [...session.messages].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    )[0];

    return lastMessage.createdAt;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Live Chat</h2>
          <p className="text-sm md:text-base text-muted-foreground">
            Manage your active chat sessions with website visitors
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row h-[calc(100vh-8rem)] md:h-[calc(100vh-10rem)] gap-2 md:gap-4">
        {/* Chat Sessions List - Hidden on mobile when a chat is active */}
        <div className={`md:w-1/3 w-full border rounded-lg shadow-sm overflow-hidden bg-card flex flex-col ${isMobileView && activeRoomId ? 'hidden' : 'block'}`}>
          <div className="p-3 md:p-4 border-b flex items-center justify-between">
            <h3 className="text-base md:text-lg font-semibold">Chat Sessions</h3>
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  isConnected ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span className="text-xs md:text-sm text-muted-foreground">
                {isConnected ? "Connected" : "Disconnected"}
              </span>
            </div>
          </div>
          <div className="overflow-y-auto flex-1">
            {Object.values(chatSessions).length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                <p className="text-muted-foreground mb-2">No chat sessions</p>
                <p className="text-sm text-muted-foreground">
                  Chat sessions will appear here when visitors start
                  conversations
                </p>
              </div>
            ) : (
              Object.values(chatSessions)
                .sort((a, b) => {
                  // Sort by lastActivity (most recent first)
                  return b.lastActivity.getTime() - a.lastActivity.getTime();
                })
                .map((session) => (
                  <div
                    key={session.roomId}
                    className={`p-3 md:p-4 border-b cursor-pointer hover:bg-accent transition-colors ${
                      activeRoomId === session.roomId ? "bg-accent" : ""
                    } ${
                      !session.isActive
                        ? "opacity-85 border-l-4 border-l-red-500"
                        : "opacity-85 border-l-4 border-l-green-500"
                    }`}
                    onClick={() => handleSelectChatSession(session.roomId)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm md:text-base">
                            {getWebsiteName(session.websiteId)}
                          </p>
                          {session.isActive &&
                            session.visitorStatus.isOnline && (
                              <span className="inline-flex h-2 w-2 rounded-full bg-green-500" />
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">
                          {getWebsiteDomain(session.websiteId)}
                        </p>
                        {session.visitorInfo?.email ? (
                          <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            <span className="truncate max-w-[150px] md:max-w-full">
                              {session.visitorInfo.email}
                            </span>
                          </p>
                        ) : (
                          <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            No E-Mail
                          </p>
                        )}
                        <div className="flex flex-wrap items-center gap-1 md:gap-2 text-xs md:text-sm text-muted-foreground">
                          <span>
                            {session.isActive ? (
                              session.visitorStatus.isOnline ? (
                                "Online"
                              ) : (
                                "Away"
                              )
                            ) : (
                              <span className="text-destructive font-medium">
                                Ended
                              </span>
                            )}
                          </span>
                          <span>•</span>
                          <span>{session.messages.length} messages</span>
                          {session.visitorStatus.isTyping &&
                            !session.visitorStatus.isAdmin && (
                              <>
                                <span>•</span>
                                <span className="text-xs text-primary animate-pulse">
                                  typing...
                                </span>
                              </>
                            )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="text-xs text-muted-foreground text-right">
                          <div>
                            {new Date(
                              getLastMessageTime(session)
                            ).toLocaleDateString([], {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                            })}
                          </div>
                          <div>
                            {new Date(
                              getLastMessageTime(session)
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {session.isActive && (
                            <button
                              onClick={(e) => handleEndChat(session.roomId, e)}
                              className="p-1 text-xs text-muted-foreground hover:text-destructive"
                              title="End chat"
                            >
                              End
                            </button>
                          )}
                          <button
                            onClick={(e) => handleDeleteChat(session.roomId, e)}
                            className="p-1 text-xs text-muted-foreground hover:text-destructive"
                            title="Delete chat"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>

        {/* Chat Window - Full width on mobile when a chat is active */}
        <div className={`md:flex-1 w-full border rounded-lg shadow-sm overflow-hidden ${isMobileView && !activeRoomId ? 'hidden' : 'flex flex-col h-full'}`}>
          {/* Back button for mobile view */}
          {isMobileView && activeRoomId && (
            <div className="p-2 border-b sticky top-0 bg-background z-10">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleBackToList}
                className="flex items-center gap-1 text-sm"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to chats</span>
              </Button>
            </div>
          )}
          
          {activeRoomId && chatSessions[activeRoomId] ? (
            <div className="flex-1 flex flex-col h-full">
              <ChatWindow
                websiteId={chatSessions[activeRoomId].websiteId}
                roomId={activeRoomId}
                onSendMessage={handleSendMessage}
                onClose={handleCloseChat}
                socket={socket}
                isConnected={isConnected}
                messages={chatSessions[activeRoomId].messages}
                websiteDomain={getWebsiteDomain(
                  chatSessions[activeRoomId].websiteId
                )}
                websiteName={getWebsiteName(chatSessions[activeRoomId].websiteId)}
                visitorStatus={chatSessions[activeRoomId].visitorStatus}
                isActive={chatSessions[activeRoomId].isActive}
                visitorInfo={chatSessions[activeRoomId].visitorInfo}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-4 text-center">
              <p className="text-muted-foreground mb-2">
                {isConnected
                  ? "Select a chat session"
                  : "Connecting to chat server..."}
              </p>
              <p className="text-sm text-muted-foreground">
                {isConnected
                  ? "Choose a conversation from the list to start messaging"
                  : "Please wait while we connect to the chat server"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
