import apiClient from "../axiosSetup";

export const postNewService = async (payload: any): Promise<any> => {
  try {
    const res = await apiClient.post("/service-catalog/services", payload);
    return res.data;
  } catch (err: any) {
    const status = err.response?.status;
    const data = err.response?.data;

    if (status === 401) throw new Error("unauthorized");
    if (status === 403) throw new Error("forbidden");

    if (status === 422 && data) {
      const parsedErrors: Record<string, string[]> = {};

      Object.entries(data).forEach(([key, val]) => {
        const normalizedKey = key.charAt(0).toLowerCase() + key.slice(1);
        parsedErrors[normalizedKey] = Array.isArray(val) ? val : [String(val)];
      });

      const error = new Error("validation_failed") as any;
      error.validationErrors = parsedErrors;
      throw error;
    }

    throw new Error("create_service_failed");
  }
};
