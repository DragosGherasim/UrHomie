export const clearSession = (
  setAccessToken: (token: string | null) => void,
  setRole: (r: "client" | "service_provider" | null) => void,
  setUserId: (id: number | null) => void
): void => {
  setAccessToken(null);
  setRole(null);
  setUserId(null);
};