import { useMutation } from "@tanstack/react-query";
import { apiPost } from "@/integrations/backend/client";

export interface PredictResponse {
  entity_id: string;
  prediction: string | null;
  explanation: string;
}

export function usePredict() {
  return useMutation({
    mutationFn: async (payload: { entity_id: string; timestamp?: string }) =>
      apiPost<PredictResponse>("/predict", payload),
  });
}


