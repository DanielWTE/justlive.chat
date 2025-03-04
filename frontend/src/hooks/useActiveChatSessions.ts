import useSWR from 'swr';
import { fetcher, type ApiResponse } from './fetcher';
import { useWebsites } from './useWebsites';

interface Message {
  id: string;
  content: string;
  roomId: string;
  createdAt: string;
  isVisitor: boolean;
  isRead: boolean;
  readAt?: string;
  isSystem?: boolean;
}

interface ChatRoom {
  id: string;
  websiteId: string;
  messages: Message[];
  status: string;
  lastActivity?: string;
  updatedAt?: string;
  createdAt: string;
  visitorName?: string;
  visitorEmail?: string;
  visitorUrl?: string;
  visitorPageTitle?: string;
  participants?: Array<{
    isOnline: boolean;
    isTyping: boolean;
    lastSeen: string;
  }>;
}

interface ChatRoomsResponse {
  rooms: ChatRoom[];
}

export interface ChatSession {
  roomId: string;
  websiteId: string;
  messages: Message[];
  lastActivity: Date;
  isActive: boolean;
  visitorInfo?: {
    name: string;
    email: string;
    url?: string;
    pageTitle?: string;
  };
  visitorStatus: {
    isOnline: boolean;
    isTyping: boolean;
    lastSeen: Date;
    isAdmin?: boolean;
  };
}

export function useActiveChatSessions() {
  const { websites, isLoading: websitesLoading } = useWebsites();
  
  // Only fetch if we have websites
  const shouldFetch = !websitesLoading && websites && websites.length > 0;
  const websiteId = shouldFetch ? websites[0].id : null;
  
  const { data, error, isLoading } = useSWR<ApiResponse<ChatRoomsResponse>>(
    websiteId ? `${process.env.NEXT_PUBLIC_API_URL}chat/rooms?websiteId=${websiteId}&status=active` : null,
    fetcher,
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: true,
      dedupingInterval: 5000,
    }
  );

  // Transform the API response into our ChatSession format
  const activeSessions: ChatSession[] = data?.data?.rooms.map(room => ({
    roomId: room.id,
    websiteId: room.websiteId,
    messages: room.messages,
    lastActivity: new Date(room.lastActivity || room.updatedAt || room.createdAt),
    isActive: room.status === "active",
    visitorInfo: room.visitorName ? {
      name: room.visitorName,
      email: room.visitorEmail || '',
      url: room.visitorUrl || '',
      pageTitle: room.visitorPageTitle || '',
    } : undefined,
    visitorStatus: {
      isOnline: room.participants?.[0]?.isOnline || false,
      isTyping: room.participants?.[0]?.isTyping || false,
      lastSeen: new Date(
        room.participants?.[0]?.lastSeen ||
        room.updatedAt ||
        room.createdAt
      ),
    },
  })) || [];

  return {
    activeSessions,
    activeSessionsCount: activeSessions.length,
    loading: isLoading || websitesLoading,
    error: error || data?.error,
  };
} 