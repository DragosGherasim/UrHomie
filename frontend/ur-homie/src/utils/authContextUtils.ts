import { ValidateJwtRequest } from "../services/grpc/proto/user_auth_pb";
import { authClient } from "../services/grpc/clients/authClient";

export const clearSession = (
  setAccessToken: (token: string | null) => void,
  setRole: (r: "client" | "service_provider" | null) => void,
  setUserId: (id: string | null) => void
): void => {
  setAccessToken(null);
  setRole(null);
  setUserId(null);
  sessionStorage.removeItem("user_role");
};

export const validateAndStoreJwt = (
  jwt: string,
  setRole: (r: "client" | "service_provider" | null) => void,
  setUserId: (id: string | null) => void,
  onValidated?: () => void,
  onFinished?: () => void
): void => {
  const validateReq = new ValidateJwtRequest();
  validateReq.setJwt(jwt);

  authClient.validateJwt(validateReq, {}, (err, resp) => {
    if (!err && resp.getIsValid()) {
      const role = resp.getRole().toLowerCase();
      const userId = resp.getSub();

      if (role === "client" || role === "service_provider") {
        setRole(role);
        setUserId(userId);
        sessionStorage.setItem("user_role", role);
        onValidated?.();
      }
    }

    onFinished?.();
  });
};