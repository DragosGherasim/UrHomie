import apiClient from "../axiosSetup";

export const createBooking = async (payload: {
  clientId: number;
  providerId: number;
  serviceId: string;
  scheduledAt: string;
  extraDetails: string;
  firstName: string;
  lastName: string;
  city: string;
  address: string;
  phoneNumber: string;
}): Promise<any> => {
  try {
    const res = await apiClient.post("/booking-service/booking", payload);
    return res.data;
  } catch (err: any) {
    const status = err.response?.status;
    const data = err.response?.data;

    if (status === 400) throw new Error("bad_request");
    if (status === 401) throw new Error("unauthorized");
    if (status === 403) throw new Error("forbidden");
    if (status === 404) throw new Error("not_found");
    if (status === 409) throw new Error("conflict");

    if (status === 422 && data) {
      const parsedErrors: Record<string, string[]> = {};
      Object.entries(data).forEach(([key, val]) => {
        parsedErrors[key] = Array.isArray(val) ? val : [String(val)];
      });
      const error = new Error("validation_failed") as any;
      error.validationErrors = parsedErrors;
      throw error;
    }

    throw new Error("booking_failed");
  }
};
