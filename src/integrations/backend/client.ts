import { supabase } from "@/integrations/supabase/client";

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

async function getAuthHeader(): Promise<Record<string, string>> {
  try {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch {
    return {};
  }
}

export async function apiGet<T>(path: string, params?: Record<string, string | number | undefined>): Promise<T> {
  const url = new URL(path, BASE_URL);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
    });
  }
  const headers: HeadersInit = { "Content-Type": "application/json", ...(await getAuthHeader()) };
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`GET ${url} failed: ${res.status}`);
  return (await res.json()) as T;
}

export async function apiPost<T>(path: string, body?: unknown): Promise<T> {
  const url = new URL(path, BASE_URL);
  const headers: HeadersInit = { "Content-Type": "application/json", ...(await getAuthHeader()) };
  const res = await fetch(url, { method: "POST", headers, body: JSON.stringify(body ?? {}) });
  if (!res.ok) throw new Error(`POST ${url} failed: ${res.status}`);
  return (await res.json()) as T;
}


