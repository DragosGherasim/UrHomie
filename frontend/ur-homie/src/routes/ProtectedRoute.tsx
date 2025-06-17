import React from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "../shared/context/AuthContext";
import LoadingSpinner from "../shared/components/ui/LoadingSpinner";

interface ProtectedRouteProps {
  children: React.ReactElement;
  allowedRole?: "client" | "service_provider";
}

const ProtectedRoute = ({ children, allowedRole }: ProtectedRouteProps) => {
  const { isAuthenticated, loading, role } = useAuth();

  if (loading) return <LoadingSpinner />;

  if (!isAuthenticated) return <Navigate to="/landing" />;

  if (allowedRole && role !== allowedRole) return <Navigate to="/home" />;

  return children;
};
export default ProtectedRoute;