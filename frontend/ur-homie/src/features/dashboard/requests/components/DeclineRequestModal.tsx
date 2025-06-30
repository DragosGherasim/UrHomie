import React, { useState } from "react";

interface DeclineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (message: string) => void;
}

const DeclineModal: React.FC<DeclineModalProps> = ({
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
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Decline Request</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            ×
          </button>
        </div>

        <textarea
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4 text-sm"
          placeholder="Enter a reason for declining this request"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
        />

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-1 text-gray-700 border border-gray-300 rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!message.trim()}
            className="px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
          >
            Confirm Decline
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeclineModal;
