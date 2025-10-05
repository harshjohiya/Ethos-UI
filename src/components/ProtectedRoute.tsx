import { Navigate, useLocation } from "react-router-dom";
import { useSupabaseAuth } from "@/integrations/supabase/SupabaseProvider";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useSupabaseAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect to auth page with return url
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
export { useSupabaseAuth as useAuth } from "@/integrations/supabase/SupabaseProvider";
