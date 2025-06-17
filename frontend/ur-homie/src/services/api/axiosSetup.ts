import axios from "axios";
import { authClient } from "../grpc/clients/authClient";
import { Empty } from "../grpc/proto/user_auth_pb";

let updateAccessToken: (token: string | null) => void = () => {};
let getAccessToken: () => string | null = () => null;

export const setTokenSetter = (setter: typeof updateAccessToken) => {
  updateAccessToken = setter;
};

export const setAccessTokenGetter = (getter: typeof getAccessToken) => {
  getAccessToken = getter;
};

const apiClient = axios.create({
  baseURL: "http://localhost:80/api/",
});

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token && config.headers) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      typeof window !== "undefined"
    ) {
      originalRequest._retry = true;

      try {
        const newToken = await new Promise<string>((resolve, reject) => {
          authClient.refreshToken(new Empty(), {}, (err, resp) => {
            if (err || !resp.getJwt()) {
              reject(new Error("refresh_failed"));
              return;
            }

            const jwt = resp.getJwt();
            updateAccessToken(jwt);
            resolve(jwt);
          });
        });

        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        error._refreshFailed = true;
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;