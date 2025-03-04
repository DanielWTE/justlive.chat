import useSWR from "swr";
import { fetcher, type ApiResponse } from "./fetcher";
export interface UserProfile {
  data: {
    id: string;
    email: string;
    name?: string;
    avatarUrl?: string;
    createdAt: string;
    updatedAt: string;
  }
}

export function useProfile() {
  const { data, error, mutate } = useSWR<ApiResponse<UserProfile>>(
    `${process.env.NEXT_PUBLIC_API_URL}users/profile`,
    () => fetcher<UserProfile>(`${process.env.NEXT_PUBLIC_API_URL}users/profile`)
  );

  return {
    profile: data?.data ?? null,
    error: error || data?.error,
    loading: !data && !error,
    mutate,
  };
} 