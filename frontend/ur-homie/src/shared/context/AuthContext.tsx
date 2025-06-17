import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { authClient } from "../../services/grpc/clients/authClient";
import { Empty, LogInRequest } from "../../services/grpc/proto/user_auth_pb";
import { clearSession } from "../utils/authContextUtils";
import {
  setAccessTokenGetter,
  setTokenSetter,
} from "../../services/api/axiosSetup";

interface AuthContextProps {
  accessToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  role: "client" | "service_provider" | null;
  userId: number | null;
  login: (
    email: string,
    password: string,
    onError: (message: string) => void
  ) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps>({
  accessToken: null,
  isAuthenticated: false,
  loading: true,
  role: null,
  userId: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [role, setRole] = useState<"client" | "service_provider" | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setAccessTokenGetter(() => accessToken);
    setTokenSetter(setAccessToken);
  }, [accessToken]);

  useEffect(() => {
    authClient.refreshToken(new Empty(), {}, (err, resp) => {
      if (err || !resp.getJwt()) {
        clearSession(setAccessToken, setRole, setUserId);
        setLoading(false);
        return;
      }

      const token = resp.getJwt();
      const userRole = resp.getRole().toLowerCase() as
        | "client"
        | "service_provider";
      const userId = Number(resp.getSub());

      setAccessToken(token);
      setRole(userRole);
      setUserId(userId);
      setLoading(false);
    });
  }, []);

  const login = (
    email: string,
    password: string,
    onError: (message: string) => void
  ) => {
    const req = new LogInRequest();
    req.setEmail(email);
    req.setPassword(password);

    authClient.logIn(req, {}, (err, resp) => {
      if (err || resp.getErrorMessage()) {
        onError(err?.message || resp.getErrorMessage() || "Login failed");
        return;
      }

      const token = resp.getJwt();
      const userRole = resp.getRole().toLowerCase() as
        | "client"
        | "service_provider";
      const userId = Number(resp.getSub());

      setAccessToken(token);
      setRole(userRole);
      setUserId(userId);

      navigate("/home");
    });
  };

  const logout = () => {
    authClient.logOut(new Empty(), {}, () => {
      clearSession(setAccessToken, setRole, setUserId);
      navigate("/landing");
    });
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        isAuthenticated: !!accessToken,
        loading,
        role,
        userId,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);