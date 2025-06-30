import React, { useEffect, useState } from "react";
import { fetchDeclineMessage } from "../../../../services/api/bookingService/fetch";
import { handleApiError } from "../../../../shared/utils/handleApiError";
import FormOverlaySpinner from "../../../../shared/components/ui/FormOverlaySpinner";
import { useAuth } from "../../../../shared/context/AuthContext";

interface RequestDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: {
    id: number;
    serviceTitle: string;
    scheduledAt: string;
    status: string;
    clientName: string;
    city: string;
    address: string;
    phoneNumber: string;
    extraDetails?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    finishAt?: string | null;
  };
}

const RequestDetailsModal: React.FC<RequestDetailsModalProps> = ({
  isOpen,
  onClose,
  request,
}) => {
  const {
    id,
    serviceTitle,
    scheduledAt,
    status,
    clientName,
    city,
    address,
    phoneNumber,
    extraDetails,
    createdAt,
    updatedAt,
    finishAt,
  } = request;

  const { logout } = useAuth();
  const [declineMessage, setDeclineMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadDeclineMessage = async () => {
      if (!isOpen || status !== "CANCELLED") return;

      try {
        setLoading(true);
        const message = await fetchDeclineMessage(id);
        setDeclineMessage(message);
      } catch (err: any) {
        handleApiError(err, {
          logout,
          knownMessages: {
            not_found: "No decline message found.",
            forbidden: "Access denied.",
            unauthorized: "You must be logged in.",
          },
          onDefault: () => {
            setDeclineMessage(null);
          },
        });
      } finally {
        setLoading(false);
      }
    };

    loadDeclineMessage();
  }, [id, status, isOpen, logout]);

  const formatDateTime = (dateString: string | null | undefined) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString("ro-RO", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto relative">
        {loading && (
          <FormOverlaySpinner
            text="Loading details..."
            color="green"
            size="md"
          />
        )}

        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold text-gray-800">Request Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 text-xl font-bold"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="space-y-3 text-sm text-gray-800">
          <p>
            <strong>Service:</strong> {serviceTitle}
          </p>
          <p>
            <strong>Scheduled at:</strong> {formatDateTime(scheduledAt)}
          </p>
          <p>
            <strong>Client:</strong> {clientName}
          </p>
          <p>
            <strong>Phone:</strong> {phoneNumber}
          </p>
          <p>
            <strong>City:</strong> {city}
          </p>
          <p>
            <strong>Address:</strong> {address}
          </p>
          {extraDetails?.trim() && (
            <p>
              <strong>Extra details:</strong> {extraDetails}
            </p>
          )}
          <p>
            <strong>Status:</strong> {status}
          </p>
          <p>
            <strong>Created at:</strong> {formatDateTime(createdAt)}
          </p>
          <p>
            <strong>Updated at:</strong> {formatDateTime(updatedAt)}
          </p>
          {finishAt && (
            <p>
              <strong>Finished at:</strong> {formatDateTime(finishAt)}
            </p>
          )}
          {declineMessage && (
            <div className="p-3 bg-red-50 border border-red-300 text-sm text-red-700 rounded-md">
              <strong>Cancelling Reason:</strong> {declineMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestDetailsModal;
