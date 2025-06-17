import apiClient from "../axiosSetup";

export const deleteServiceById = async (serviceId: string) => {
  try {
    await apiClient.delete(`/service-catalog/services/${serviceId}`);
  } catch (err: any) {
    const status = err.response?.status;
    if (status === 401) throw new Error("unauthorized");
    if (status === 403) throw new Error("forbidden");
    if (status === 404) throw new Error("not_found");
    throw new Error("delete_failed");
  }
};
