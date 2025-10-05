import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "./client";

interface SupabaseContextValue {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const SupabaseContext = createContext<SupabaseContextValue | undefined>(undefined);

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      setIsLoading(true);
      const { data, error } = await supabase.auth.getSession();
      if (!isMounted) return;
      if (error) {
        // eslint-disable-next-line no-console
        console.error("Supabase getSession error:", error);
      }
      setSession(data.session ?? null);
      setIsLoading(false);
    };

    init();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => {
      isMounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<SupabaseContextValue>(() => ({
    session,
    user: session?.user ?? null,
    isLoading,
    signOut: async () => {
      await supabase.auth.signOut();
    },
  }), [session, isLoading]);

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
}

export function useSupabaseAuth() {
  const ctx = useContext(SupabaseContext);
  if (!ctx) throw new Error("useSupabaseAuth must be used within SupabaseProvider");
  return ctx;
}


