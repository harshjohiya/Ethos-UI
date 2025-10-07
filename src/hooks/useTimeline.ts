import { useQuery } from "@tanstack/react-query";
import { getEntityTimeline } from "@/lib/supabase-queries";

export interface TimelineEvent {
  source: string;
  timestamp: string;
  entity_id: string;
  location_id?: string;
  card_id?: string;
  ap_id?: string;
  device_hash?: string;
  room_id?: string;
  book_id?: string;
  description?: string;
}

export function useTimeline(entityId: string | undefined, limit = 100) {
  return useQuery({
    enabled: !!entityId,
    queryKey: ["timeline", entityId, limit],
    queryFn: async () => {
      if (!entityId) return [];
      return await getEntityTimeline(entityId, limit);
    },
    staleTime: 1000 * 60, // 1 minute
  });
}


