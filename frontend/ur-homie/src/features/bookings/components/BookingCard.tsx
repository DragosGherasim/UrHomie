import React from "react";

interface BookingCardProps {
  id: number;
  title: string;
  description: string;
  basePrice: number;
  scheduledAt: string;
  status: string;
  providerPhone: string;
  extraDetails?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  finishAt?: string | null;
  onCancel?: () => void;
  onMoreDetails?: () => void;
}

const BookingCard: React.FC<BookingCardProps> = ({
  title,
  description,
  scheduledAt,
  status,
  basePrice,
  providerPhone,
  extraDetails,
  onCancel,
  onMoreDetails,
}) => {
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
    <div className="bg-white rounded-xl shadow-md p-4 flex flex-col justify-between hover:shadow-lg transition">
      <div className="mb-2">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <p className="text-sm text-gray-700 line-clamp-2">{description}</p>
      </div>

      <div className="text-sm text-gray-600 mt-2 space-y-1">
        <p>
          <strong>Base price:</strong> {basePrice} RON
        </p>
        <p>
          <strong>Provider phone:</strong> {providerPhone}
        </p>
        <p>
          <strong>Scheduled at:</strong> {formatDateTime(scheduledAt)}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          <span className={`font-medium ${statusColor}`}>{status}</span>
        </p>
      </div>

      <div className="flex justify-between pt-4">
        {onCancel && (status === "PENDING" || status === "CONFIRMED") ? (
          <button
            onClick={onCancel}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Cancel Booking
          </button>
        ) : (
          <div></div>
        )}

        {onMoreDetails && (
          <button
            onClick={onMoreDetails}
            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
          >
            More details
          </button>
        )}
      </div>
    </div>
  );
};

export default BookingCard;