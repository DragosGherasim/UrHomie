import React from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";

const ProtectedRoute = ({ children }: { children: React.JSX.Element }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <LoadingSpinner />;

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
