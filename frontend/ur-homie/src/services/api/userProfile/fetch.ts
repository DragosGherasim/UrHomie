import axios from "axios";

export const fetchUserProfile = async (
  userId: string,
  role: "client" | "service_provider",
  token: string
) => {
  try {
    const endpoint =
      role === "client" ? `client/${userId}` : `service-provider/${userId}`;

    const response = await axios.get(
      `http://localhost:80/api/user-management/${endpoint}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (err: any) {
    const status = err.response?.status;

    if (status === 401) throw new Error("unauthorized");
    if (status === 403) throw new Error("forbidden");
    if (status === 404) throw new Error("not_found");

    throw new Error("unknown_error");
  }
};