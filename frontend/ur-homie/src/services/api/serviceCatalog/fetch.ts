import apiClient from "../axiosSetup";

export const fetchServiceCategories = async () => {
  try {
    const res = await apiClient.get("/service-catalog/service-categories");
    return res.data;
  } catch (err: any) {
    const status = err.response?.status;
    if (status === 401) throw new Error("unauthorized");
    if (status === 403) throw new Error("forbidden");
    throw new Error("fetch_categories_failed");
  }
};

export const fetchCategoryTemplate = async (categoryId: string) => {
  try {
    const res = await apiClient.get(
      `/service-catalog/category-templates/${categoryId}`
    );
    return res.data;
  } catch (err: any) {
    const status = err.response?.status;
    if (status === 401) throw new Error("unauthorized");
    if (status === 403) throw new Error("forbidden");
    throw new Error("fetch_template_failed");
  }
};

interface FetchProviderServicesResponse {
  services: any[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export const fetchProviderServices = async (
  providerId: number,
  page: number = 0,
  size: number = 3
): Promise<FetchProviderServicesResponse> => {
  try {
    const res = await apiClient.get(
      `/service-catalog/services/by-provider/${providerId}`,
      {
        params: { page, size },
      }
    );
    return res.data;
  } catch (err: any) {
    const status = err.response?.status;

    if (status === 401) throw new Error("unauthorized");
    if (status === 403) throw new Error("forbidden");
    if (status === 404) throw new Error("not_found");
    if (status === 422) throw new Error("invalid_parameters");
    throw new Error("fetch_services_failed");
  }
};

export const fetchServiceById = async (serviceId: string): Promise<any> => {
  try {
    const res = await apiClient.get(`/service-catalog/services/${serviceId}`);
    return res.data;
  } catch (err: any) {
    const status = err.response?.status;

    if (status === 401) throw new Error("unauthorized");
    if (status === 403) throw new Error("forbidden");
    if (status === 404) throw new Error("not_found");
    if (status === 400) throw new Error("invalid_service_id");
    throw new Error("fetch_service_failed");
  }
};

export const fetchServicesBySearch = async (
  query: string,
  page: number = 0,
  size: number = 6
): Promise<FetchProviderServicesResponse> => {
  try {
    const res = await apiClient.get("/service-catalog/services", {
      params: { query, page, size },
    });

    return res.data;
  } catch (err: any) {
    const status = err.response?.status;

    if (status === 401) throw new Error("unauthorized");
    if (status === 403) throw new Error("forbidden");
    if (status === 404) throw new Error("not_found");
    if (status === 422) throw new Error("invalid_parameters");
    throw new Error("search_failed");
  }
};