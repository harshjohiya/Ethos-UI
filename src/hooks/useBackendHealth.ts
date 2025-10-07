import { useQuery } from "@tanstack/react-query";

export function useBackendHealth() {
  return useQuery({
    queryKey: ["backend-health"],
    queryFn: async () => {
      const base = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
      const res = await fetch(new URL("/health", base));
      if (!res.ok) throw new Error(`Backend health failed: ${res.status}`);
      return res.json();
    },
    retry: 1,
  });
}


