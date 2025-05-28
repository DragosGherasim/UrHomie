import apiClient from "../axiosSetup";

export const fetchUserProfile = async (
  userId: string,
  role: "client" | "service_provider"
) => {
  try {
    const endpoint =
      role === "client" ? `client/${userId}` : `service-provider/${userId}`;

    const response = await apiClient.get(`/${endpoint}`);
    return response.data;
  } catch (err: any) {
    const status = err.response?.status;

    if (status === 401) throw new Error("unauthorized");
    if (status === 403) throw new Error("forbidden");
    if (status === 404) throw new Error("not_found");

    throw new Error("unknown_error");
  }
};
