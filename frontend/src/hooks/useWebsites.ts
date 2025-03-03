import useSWR from 'swr';
import { Website } from '@/types/website';
import { fetcher, type ApiResponse } from './fetcher';

export function useWebsites() {
  const { data, error, mutate } = useSWR<ApiResponse<{ websites: Website[] }>>(
    `${process.env.NEXT_PUBLIC_API_URL}websites/list`,
    () => fetcher<{ websites: Website[] }>(`${process.env.NEXT_PUBLIC_API_URL}websites/list`)
  );

  return {
    websites: data?.data?.websites ?? [],
    isLoading: !error && !data,
    isError: error,
    mutate
  };
}

export function useWebsite(id: string) {
  const { data, error, mutate } = useSWR<ApiResponse<{ website: Website }>>(
    id ? `${process.env.NEXT_PUBLIC_API_URL}websites/${id}` : null,
    (url: string) => fetcher<{ website: Website }>(url)
  );

  return {
    website: data?.data?.website,
    isLoading: !error && !data,
    isError: error,
    mutate
  };
} 