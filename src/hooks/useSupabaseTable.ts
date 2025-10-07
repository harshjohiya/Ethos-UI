import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface UseSupabaseTableOptions<T> {
  table: string;
  select?: string;
  limit?: number;
  orderBy?: { column: string; ascending?: boolean };
  eq?: Array<{ column: string; value: string | number | boolean | null }>;
}

export function useSupabaseTable<T = unknown>(options: UseSupabaseTableOptions<T>) {
  const { table, select = "*", limit, orderBy, eq } = options;

  return useQuery({
    queryKey: ["supabase", table, { select, limit, orderBy, eq }],
    queryFn: async () => {
      let q = supabase.from(table).select(select);
      if (orderBy) {
        q = q.order(orderBy.column, { ascending: orderBy.ascending !== false });
      }
      if (limit) {
        q = q.limit(limit);
      }
      if (eq && eq.length > 0) {
        for (const cond of eq) {
          q = q.eq(cond.column, cond.value as any);
        }
      }
      const { data, error } = await q;
      if (error) throw error;
      return data as T[];
    },
  });
}


