import { useCallback, useEffect } from "react";
import useSWR from "swr";
import { fetcher, type SessionData, type ApiResponse, type User } from "./fetcher";

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export interface SessionState {
  user: User | null;
  error: string | undefined;
  errorCode?: string;
  isLoading: boolean;
  isAuthenticated: boolean;
  isSessionExpired: boolean;
  mutate: () => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

export function useSession(): SessionState {
  const { data, error, mutate } = useSWR<ApiResponse<SessionData>>(
    `${API_URL}auth/session`,
    () => fetcher<SessionData>(`${API_URL}auth/session`),
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      refreshInterval: 5 * 60 * 1000,
      shouldRetryOnError: false,
    }
  );

  const isSessionExpired = data?.code === 'SESSION_EXPIRED';

  const refresh = useCallback(async () => {
    try {
      await mutate();
    } catch (error) {
      console.error("Failed to refresh session:", error);
    }
  }, [mutate]);

  const logout = useCallback(async () => {
    try {
      await fetch(`${API_URL}auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      await mutate();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }, [mutate]);

  useEffect(() => {
    if (data?.data?.session?.expiresAt) {
      const expiresAt = new Date(data.data.session.expiresAt).getTime();
      const now = Date.now();
      const timeUntilExpiry = expiresAt - now;
      
      if (timeUntilExpiry > 0 && timeUntilExpiry < 10 * 60 * 1000) {
        const refreshTimer = setTimeout(() => {
          refresh();
        }, timeUntilExpiry - 60 * 1000);
        
        return () => clearTimeout(refreshTimer);
      }
    }
  }, [data?.data?.session?.expiresAt, refresh]);

  return {
    user: data?.data?.user ?? null,
    error: error?.message || data?.error,
    errorCode: data?.code,
    isLoading: !data && !error,
    isAuthenticated: !!data?.data?.user,
    isSessionExpired,
    mutate: refresh,
    logout,
    refresh,
  };
} 