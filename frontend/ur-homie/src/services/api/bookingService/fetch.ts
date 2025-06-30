import apiClient from "../axiosSetup";

export const fetchClientBookings = async (
  clientId: number,
  page: number = 0,
  size: number = 6
): Promise<{ bookings: any[]; totalPages: number }> => {
  try {
    const res = await apiClient.get(`/booking-service/booking/by-client/${clientId}`, {
      params: { page, size },
    });
    return res.data;
  } catch (err: any) {
    const status = err.response?.status;
    if (status === 401) throw new Error("unauthorized");
    if (status === 403) throw new Error("forbidden");
    if (status === 404) throw new Error("not_found");
    throw new Error("fetch_bookings_failed");
  }
};

export const fetchProviderRequests = async (
  providerId: number,
  page: number = 0,
  size: number = 6
): Promise<{ bookings: any[]; totalPages: number }> => {
  try {
    const res = await apiClient.get(`/booking-service/booking/by-provider/${providerId}`, {
      params: { page, size },
    });
    return res.data;
  } catch (err: any) {
    const status = err.response?.status;
    if (status === 401) throw new Error("unauthorized");
    if (status === 403) throw new Error("forbidden");
    if (status === 404) throw new Error("not_found");
    throw new Error("fetch_requests_failed");
  }
};

export const fetchDeclineMessage = async (bookingId: number): Promise<string> => {
  try {
    const res = await apiClient.get(`/booking-service/booking-log/${bookingId}/cancelled`);
    return res.data.declineMessage;
  } catch (err: any) {
    const status = err.response?.status;
    if (status === 404) throw new Error("not_found");
    if (status === 403) throw new Error("forbidden");
    if (status === 401) throw new Error("unauthorized");
    throw new Error("fetch_decline_message_failed");
  }
};