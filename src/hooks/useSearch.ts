import { useQuery } from "@tanstack/react-query";
import { profileQueries } from "@/lib/supabase-queries";
import type { Database } from "@/types/database.types";

export type SearchResult = Database['public']['Tables']['profiles']['Row'];

export function useSearch(query: string) {
  return useQuery({
    queryKey: ["search", query],
    queryFn: async () => {
      // If no query, return all profiles
      if (!query.trim()) {
        return await profileQueries.getAll();
      }
      // Otherwise search
      return await profileQueries.search(query);
    },
    staleTime: 1000 * 30, // 30 seconds
  });
}


