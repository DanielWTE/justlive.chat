export interface ApiResponse<T> {
  data: T | null;
  error?: string;
  code?: string;
}

export const fetcher = async <T>(url: string, options?: RequestInit): Promise<ApiResponse<T>> => {
  try {
    const response = await fetch(url, {
      credentials: "include",
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { 
        data: null, 
        error: errorData.error || response.statusText || "Request failed",
        code: errorData.code
      };
    }

    const data = await response.json();
    return { data: data as T, error: undefined };
  } catch (error) {
    return { data: null, error: "Failed to fetch data" };
  }
};

// Types for session-specific usage
export interface User {
  id: string;
  email: string;
  name?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface SessionMetadata {
  expiresAt: string | null;
  issuedAt: string | null;
}

export interface SessionData {
  user: User;
  session: SessionMetadata;
} 