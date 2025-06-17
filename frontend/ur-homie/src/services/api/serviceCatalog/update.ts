import apiClient from "../axiosSetup";

export const patchServiceById = async (
  serviceId: string,
  patchData: Partial<any>
): Promise<any> => {
  try {
    const res = await apiClient.patch(
      `/service-catalog/services/${serviceId}`,
      patchData
    );
    return res.data;
  } catch (err: any) {
    const status = err.response?.status;
    const data = err.response?.data;

    if (status === 401) throw new Error("unauthorized");
    if (status === 403) throw new Error("forbidden");
    if (status === 404) throw new Error("not_found");

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

    throw new Error("patch_failed");
  }
};
