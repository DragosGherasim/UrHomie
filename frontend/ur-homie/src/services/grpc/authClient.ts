import { UserAuthenticationClient } from "../grpc/proto/User_authServiceClientPb";

export const authClient = new UserAuthenticationClient("http://localhost:80", null, {
  withCredentials: true,
});
