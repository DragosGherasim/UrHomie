import apiClient from "../axiosSetup";

interface PatchUserProfileResult {
  success: boolean;
  data?: any;
  errors?: Record<string, string[]>;
}

export const patchUserProfile = async (
  userId: string,
  role: "client" | "service_provider",
  payload: Record<string, any>
): Promise<PatchUserProfileResult> => {
  const endpoint = role === "client" ? `client/${userId}` : `service-provider/${userId}`;

  try {
    const response = await apiClient.patch(`/${endpoint}`, payload);

    return { success: true, data: response.data };
  } catch (error: any) {
    const status = error.response?.status;
    const errors = error.response?.data?.errors;

    if (status === 401) {
      throw new Error("unauthorized");
    }

    if (status === 422 || status === 409) {
      const normalizedErrors: Record<string, string[]> = {};

      for (const [key, value] of Object.entries(errors || {})) {
        const normalizedKey = key.charAt(0).toLowerCase() + key.slice(1);
        normalizedErrors[normalizedKey] = Array.isArray(value) ? value : [String(value)];
      }

      return { success: false, errors: normalizedErrors };
    }

    throw new Error("Unexpected error");
  }
};