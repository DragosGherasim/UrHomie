import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { toast } from "react-hot-toast";

import { createBooking } from "../../../services/api/bookingService/create";
import { handleApiError } from "../../../shared/utils/handleApiError";
import { useAuth } from "../../../shared/context/AuthContext";
import { fetchUserProfile } from "../../../services/api/userProfile/fetch";
import { formatLabel } from "../../../shared/utils/formattersUtils";

interface AddBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  serviceId: string;
  providerId: number;
}

const AddBookingModal: React.FC<AddBookingModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  serviceId,
  providerId,
}) => {
  const { userId, logout } = useAuth();

  const [scheduledAt, setScheduledAt] = useState("");
  const [extraDetails, setExtraDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMap, setErrorMap] = useState<Record<string, string[]>>({});

  const [clientInfo, setClientInfo] = useState({
    firstName: "",
    lastName: "",
    city: "",
    address: "",
    phoneNumber: "",
  });

  useEffect(() => {
    const loadClientInfo = async () => {
      try {
        const profile = await fetchUserProfile(userId!, "client");
        setClientInfo({
          firstName: profile.firstName,
          lastName: profile.lastName,
          city: profile.city,
          address: profile.address,
          phoneNumber: profile.phoneNumber,
        });
      } catch {
        toast.error("Failed to load user profile.");
      }
    };

    if (isOpen && userId) {
      loadClientInfo();
    }
  }, [isOpen, userId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setClientInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setErrorMap({});

    try {
      setLoading(true);
      await createBooking({
        clientId: userId!,
        providerId,
        serviceId,
        scheduledAt,
        extraDetails: extraDetails.trim(),
        ...clientInfo,
      });

      toast.success("Booking created successfully!");
      onClose();
      onSuccess?.();
    } catch (err: any) {
      if (err.message === "validation_failed" && err.validationErrors) {
        setErrorMap(err.validationErrors);
        return;
      }

      handleApiError(err, {
        logout,
        knownMessages: {
          conflict: "You already have a booking for this service.",
          bad_request: "Invalid request. Please check your input.",
          not_found: "Service not found or no longer available.",
        },
        onDefault: () =>
          toast.error("Unexpected error occurred while creating the booking."),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
          <div className="flex justify-between items-center px-6 pt-6 pb-2">
            <h2 className="text-2xl font-bold text-gray-800">
              Book This Service
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-red-500 text-2xl font-bold"
              aria-label="Close modal"
            >
              ×
            </button>
          </div>

          <div className="overflow-y-auto max-h-[75vh] px-6 pb-6 pr-[18px] space-y-4">
            {Object.entries(clientInfo).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {formatLabel(key)}
                </label>
                <input
                  type="text"
                  name={key}
                  value={value}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none ${
                    errorMap?.[key]
                      ? "border-red-500"
                      : "border-gray-300 focus:ring-2 focus:ring-green-500"
                  }`}
                />
                {errorMap?.[key] && (
                  <p className="text-sm text-red-500 mt-1">
                    {errorMap[key][0]}
                  </p>
                )}
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {formatLabel("scheduledAt")}
              </label>
              <input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none ${
                  errorMap?.scheduledAt
                    ? "border-red-500"
                    : "border-gray-300 focus:ring-2 focus:ring-green-500"
                }`}
              />
              {errorMap?.scheduledAt && (
                <p className="text-sm text-red-500 mt-1">
                  {errorMap.scheduledAt[0]}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {formatLabel("extraDetails")} (optional)
              </label>
              <textarea
                name="extraDetails"
                rows={3}
                value={extraDetails}
                onChange={(e) => setExtraDetails(e.target.value)}
                className={`w-full px-4 py-2 border rounded-md resize-none focus:outline-none ${
                  errorMap?.extraDetails
                    ? "border-red-500"
                    : "border-gray-300 focus:ring-2 focus:ring-green-500"
                }`}
              />
              {errorMap?.extraDetails && (
                <p className="text-sm text-red-500 mt-1">
                  {errorMap.extraDetails[0]}
                </p>
              )}
            </div>

            <div className="flex justify-center pt-4">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700"
              >
                {loading ? "Booking..." : "Confirm Booking"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default AddBookingModal;