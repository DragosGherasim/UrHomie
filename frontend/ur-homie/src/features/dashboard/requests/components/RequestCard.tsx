import React, { useState } from "react";
import DeclineModal from "./DeclineRequestModal";
import RequestCardDetailsModal from "./RequestDetailsModal";

interface RequestCardProps {
  id: number;
  scheduledAt: string;
  clientName: string;
  city: string;
  address: string;
  phoneNumber: string;
  status: string;
  serviceTitle: string;
  extraDetails?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  finishAt?: string | null;
  onConfirm: (id: number) => void;
  onFinish: (id: number) => void;
  onDecline: (id: number, message: string) => void;
}

const RequestCard: React.FC<RequestCardProps> = ({
  id,
  scheduledAt,
  clientName,
  city,
  address,
  phoneNumber,
  status,
  serviceTitle,
  extraDetails,
  createdAt, 
  updatedAt, 
  finishAt,  
  onConfirm,
  onFinish,
  onDecline,
}) => {
  const [declineOpen, setDeclineOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("ro-RO", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  const statusColor =
    {
      PENDING: "text-yellow-600",
      CONFIRMED: "text-green-600",
      CANCELLED: "text-red-600",
      FINISHED: "text-gray-500",
    }[status] || "text-gray-800";

  return (
    <div className="bg-white rounded-xl shadow-md p-4 flex flex-col justify-between hover:shadow-lg transition space-y-3 relative">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">{serviceTitle}</h2>
        <p className="text-sm text-gray-700">
          Scheduled at: {formatDateTime(scheduledAt)}
        </p>
        <div className="text-sm text-gray-600 mt-2 space-y-1">
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
            <strong>Status:</strong>{" "}
            <span className={`font-medium ${statusColor}`}>{status}</span>
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center mt-2">
        {status === "PENDING" ? (
          <>
            <div className="flex gap-2">
              <button
                onClick={() => onConfirm(id)}
                className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded"
              >
                Accept
              </button>
              <button
                onClick={() => setDeclineOpen(true)}
                className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded"
              >
                Decline
              </button>
            </div>
            <button
              onClick={() => setDetailsOpen(true)}
              className="bg-gray-800 hover:bg-gray-900 text-white py-1 px-3 rounded"
            >
              More details
            </button>
          </>
        ) : status === "CONFIRMED" ? (
          <>
            <button
              onClick={() => onFinish(id)}
              className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded"
            >
              Mark as Finished
            </button>
            <button
              onClick={() => setDetailsOpen(true)}
              className="bg-gray-800 hover:bg-gray-900 text-white py-1 px-3 rounded"
            >
              More details
            </button>
          </>
        ) : (
          <div className="flex justify-end w-full">
            <button
              onClick={() => setDetailsOpen(true)}
              className="bg-gray-800 hover:bg-gray-900 text-white py-1 px-3 rounded"
            >
              More details
            </button>
          </div>
        )}
      </div>

      <DeclineModal
        isOpen={declineOpen}
        onClose={() => setDeclineOpen(false)}
        onConfirm={(message) => onDecline(id, message)}
      />

      <RequestCardDetailsModal
        isOpen={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        request={{
          id,
          scheduledAt,
          clientName,
          city,
          address,
          phoneNumber,
          status,
          serviceTitle,
          extraDetails,
          createdAt,
          updatedAt,
          finishAt,
        }}
      />
    </div>
  );
};

export default RequestCard;
