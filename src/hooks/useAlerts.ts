import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/integrations/backend/client";

export interface Alert {
  id?: number;
  entity_id?: string;
  type?: string;
  severity?: string;
  message?: string;
  timestamp?: string;
}

export function useAlerts(entityId?: string, hours: number = 12) {
  return useQuery({
    queryKey: ["alerts", { entityId, hours }],
    queryFn: async () => apiGet<Alert[]>("/alerts", { entity_id: entityId, hours }),
  });
}


