import { Navigate } from "react-router-dom";
import { useAuth, AppRole } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: AppRole;
  redirectTo?: string;
}

export const ProtectedRoute = ({
  children,
  requiredRole,
  redirectTo = "/auth",
}: ProtectedRouteProps) => {
  const { user, role, loading, isPending } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to={redirectTo} replace />;
  if (isPending) return <Navigate to="/pending" replace />;

  if (requiredRole === "admin" && role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
