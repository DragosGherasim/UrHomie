import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authClient } from "../services/grpc/authClient";
import { Empty, LogInRequest, ValidateJwtRequest } from "../services/grpc/proto/user_auth_pb";

interface AuthContextProps {
  accessToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  role: "client" | "service_provider" | null;
  userId: string | null;
  login: (email: string, password: string, onError: (message: string) => void) => void;
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [role, setRole] = useState<"client" | "service_provider" | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const refresh = new Empty();
    authClient.refreshToken(refresh, {}, (err, resp) => {
      if (err || !resp.getJwt()) {
        setAccessToken(null);
        setRole(null);
        setUserId(null);
        setLoading(false);
        return;
      }

      const jwt = resp.getJwt();
      setAccessToken(jwt);

      const validateReq = new ValidateJwtRequest();
      validateReq.setJwt(jwt);

      authClient.validateJwt(validateReq, {}, (err2, validateResp) => {
        if (!err2 && validateResp.getIsValid()) {
          const extractedRole = validateResp.getRole().toLowerCase();
          const extractedId = validateResp.getSub();

          if (extractedRole === "client" || extractedRole === "service_provider") {
            setRole(extractedRole);
            setUserId(extractedId);
            sessionStorage.setItem("user_role", extractedRole);
          }
        }
        setLoading(false);
      });
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
      if (err) {
        onError("Authentication service is currently unavailable. Please try again later.");
        return;
      }

      if (resp.getErrorMessage()) {
        onError(resp.getErrorMessage());
        return;
      }

      const jwt = resp.getJwt();
      setAccessToken(jwt);

      const validateReq = new ValidateJwtRequest();
      validateReq.setJwt(jwt);

      authClient.validateJwt(validateReq, {}, (err2, validateResp) => {
        if (!err2 && validateResp.getIsValid()) {
          const extractedRole = validateResp.getRole().toLowerCase();
          const extractedId = validateResp.getSub();

          if (extractedRole === "client" || extractedRole === "service_provider") {
            setRole(extractedRole);
            setUserId(extractedId);
            sessionStorage.setItem("user_role", extractedRole);
          }
        }

        navigate("/home");
      });
    });
  };

  const logout = () => {
    const req = new Empty();
    authClient.logOut(req, {}, () => {
      setAccessToken(null);
      setRole(null);
      setUserId(null);
      sessionStorage.removeItem("user_role");
      navigate("/login");
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
