import useSWR from "swr";
import { fetcher, type SessionData, type ApiResponse } from "./fetcher";

export function useSession() {
  const { data, error, mutate } = useSWR<ApiResponse<SessionData>>(
    `${process.env.NEXT_PUBLIC_API_URL}auth/session`,
    () => fetcher<SessionData>(`${process.env.NEXT_PUBLIC_API_URL}auth/session`)
  );

  return {
    user: data?.data?.user ?? null,
    error: error || data?.error,
    loading: !data && !error,
    mutate,
  };
} 