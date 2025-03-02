export interface ApiResponse<T> {
  data: T | null;
  error?: string;
}

export const fetcher = async <T>(url: string): Promise<ApiResponse<T>> => {
  try {
    const response = await fetch(url, {
      credentials: "include",
    });

    if (!response.ok) {
      return { data: null, error: response.statusText || "Request failed" };
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
}

export interface SessionData {
  user: User;
} 