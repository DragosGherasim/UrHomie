import React from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/ui/LoadingSpinner";

const ProtectedRoute = ({ children }: { children: React.JSX.Element }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <LoadingSpinner />;

  return isAuthenticated ? children : <Navigate to="/landing" />;
};

export default ProtectedRoute;
