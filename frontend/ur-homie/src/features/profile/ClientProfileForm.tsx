import React from "react";
import { formatLabel } from "../../utils/formattersUtils";

interface ClientProfileFormProps {
  formData: {
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    country: string;
    city: string;
    address: string;
  };
  isEditing: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  errorMap?: Record<string, string[]>;
}

const ClientProfileForm: React.FC<ClientProfileFormProps> = ({
  formData,
  isEditing,
  onChange,
  onSubmit,
  onCancel,
  setIsEditing,
  errorMap,
}) => {
  return (
    <div className="relative bg-white p-8 rounded-2xl shadow-2xl w-full max-w-3xl">
      <div className="flex justify-between items-start mb-6 relative">
        <h2 className="text-2xl font-bold text-gray-800">Your Client Profile</h2>
        {isEditing ? (
          <button
            onClick={onCancel}
            className="absolute top-0 right-0 text-gray-500 hover:text-red-500 text-xl font-bold"
            aria-label="Close profile"
          >
            ×
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-md transition"
          >
            Edit
          </button>
        )}
      </div>

      <form onSubmit={onSubmit} className="grid grid-cols-2 gap-6">
        {Object.entries(formData).map(([key, value]) =>
          key !== "id" ? (
            <div key={key} className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 capitalize mb-1">
                {formatLabel ? formatLabel(key) : key}
              </label>
              <input
                type="text"
                name={key}
                value={value}
                readOnly={key === "email" || !isEditing}
                onChange={onChange}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none ${
                  isEditing && key !== "email"
                    ? `border-gray-300 focus:ring-2 focus:ring-green-500 ${
                        errorMap?.[key] ? "border-red-500" : ""
                      }`
                    : "border-transparent bg-gray-100 text-gray-600 cursor-text"
                }`}
              />
              {errorMap?.[key] && (
                <p className="text-sm text-red-500 mt-1">{errorMap[key][0]}</p>
              )}
            </div>
          ) : null
        )}

        {isEditing && (
          <div className="col-span-2">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-xl font-semibold mx-auto block"
            >
              Save Changes
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ClientProfileForm;