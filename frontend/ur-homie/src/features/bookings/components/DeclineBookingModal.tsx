import React, { useState } from "react";

interface DeclineBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (message: string) => void;
}

const DeclineBookingModal: React.FC<DeclineBookingModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [message, setMessage] = useState("");

  const handleConfirm = () => {
    if (message.trim()) {
      onConfirm(message.trim());
      setMessage("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            Cancel Booking
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 text-xl font-bold"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Reason for cancelling
          </label>
          <textarea
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Please provide a brief explanation"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={handleConfirm}
            disabled={!message.trim()}
            className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 transition"
          >
            Confirm Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeclineBookingModal;
