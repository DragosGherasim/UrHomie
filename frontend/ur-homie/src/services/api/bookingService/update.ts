import apiClient from "../axiosSetup";

export const cancelBooking = async (bookingId: number, message: string): Promise<void> => {
  if (!message.trim()) {
    const error = new Error("validation_failed") as any;
    error.validationErrors = { message: ["Message cannot be empty."] };
    throw error;
  }

  try {
    await apiClient.patch(`/booking-service/booking/${bookingId}/cancel`, { message });
  } catch (err: any) {
    const status = err.response?.status;
    const data = err.response?.data;

    if (status === 401) throw new Error("unauthorized");
    if (status === 403) throw new Error("forbidden");
    if (status === 404) throw new Error("not_found");

    if (status === 400) throw new Error("invalid_state");
    
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

    throw new Error("cancel_failed");
  }
};

export const confirmBooking = async (bookingId: number): Promise<void> => {
  try {
    await apiClient.patch(`/booking-service/booking/${bookingId}/confirm`);
  } catch (err: any) {
    const status = err.response?.status;
    
    if (status === 401) throw new Error("unauthorized");
    if (status === 403) throw new Error("forbidden");
    if (status === 404) throw new Error("not_found");
    if (status === 400) throw new Error("invalid_state");

    throw new Error("confirm_failed");
  }
};

export const finishBooking = async (bookingId: number): Promise<void> => {
  try {
    await apiClient.patch(`/booking-service/booking/${bookingId}/finish`);
  } catch (err: any) {
    const status = err.response?.status;

    if (status === 401) throw new Error("unauthorized");
    if (status === 403) throw new Error("forbidden");
    if (status === 404) throw new Error("not_found");
    if (status === 400) throw new Error("invalid_state");

    throw new Error("finish_failed");
  }
};