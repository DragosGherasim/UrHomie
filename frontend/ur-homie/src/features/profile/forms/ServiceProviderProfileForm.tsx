import React from "react";
import { formatLabel } from "../../../shared/utils/formattersUtils";

interface ServiceProviderProfileFormProps {
  formData: {
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    country: string;
    city: string;
    address: string;
    education: string;
    certifications: string;
    experienceDescriptions: string;
    workSchedule: string;
    coverageArea: number;
  };
  isEditing: boolean;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  errorMap?: Record<string, string[]>;
}

const ServiceProviderProfileForm: React.FC<ServiceProviderProfileFormProps> = ({
  formData,
  isEditing,
  onChange,
  onSubmit,
  onCancel,
  setIsEditing,
  errorMap,
}) => {
  return (
    <div className="relative bg-white p-8 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
      <div className="flex justify-between items-start mb-6 relative">
        <h2 className="text-2xl font-bold text-gray-800">
          Your Service Provider Profile
        </h2>
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

      <form
        onSubmit={onSubmit}
        className="grid grid-cols-2 gap-6 max-h-[75vh] overflow-y-auto pr-[18px]"
      >
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            readOnly
            className="w-full px-4 py-2 border border-transparent bg-gray-100 text-gray-600 rounded-md cursor-not-allowed"
          />
        </div>

        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            readOnly={!isEditing}
            onChange={onChange}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none ${
              isEditing
                ? `border-gray-300 focus:ring-2 focus:ring-green-500 ${
                    errorMap?.firstName ? "border-red-500" : ""
                  }`
                : "border-transparent bg-gray-100 text-gray-600 cursor-text"
            }`}
          />
          {errorMap?.firstName && (
            <p className="text-sm text-red-500 mt-1">{errorMap.firstName[0]}</p>
          )}
        </div>

        {[
          "lastName",
          "phoneNumber",
          "country",
          "city",
          "address",
          "education",
          "certifications",
          "experienceDescriptions",
          "workSchedule",
          "coverageArea",
        ].map((key) => (
          <div key={key} className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 capitalize mb-1">
              {formatLabel(key)}
            </label>

            {["certifications", "experienceDescriptions"].includes(key) ? (
              <textarea
                name={key}
                value={(formData as any)[key]}
                readOnly={!isEditing}
                onChange={onChange}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none resize-none overflow-hidden ${
                  isEditing
                    ? `border-gray-300 focus:ring-2 focus:ring-green-500 ${
                        errorMap?.[key] ? "border-red-500" : ""
                      }`
                    : "border-transparent bg-gray-100 text-gray-600 cursor-text"
                }`}
                style={{ height: "auto" }}
                rows={1}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = "auto";
                  target.style.height = `${target.scrollHeight}px`;
                }}
              />
            ) : key === "coverageArea" ? (
              isEditing ? (
                <select
                  name="coverageArea"
                  value={formData.coverageArea}
                  onChange={onChange}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none border-gray-300 focus:ring-2 focus:ring-green-500 ${
                    errorMap?.coverageArea ? "border-red-500" : ""
                  }`}
                >
                  {[5, 25, 50, 100].map((area) => (
                    <option key={area} value={area}>
                      {area} km
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  name="coverageArea"
                  value={`${formData.coverageArea} km`}
                  readOnly
                  className="w-full px-4 py-2 border rounded-md focus:outline-none border-transparent bg-gray-100 text-gray-600 cursor-text"
                />
              )
            ) : (
              <input
                type="text"
                name={key}
                value={(formData as any)[key]}
                readOnly={!isEditing}
                onChange={onChange}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none ${
                  isEditing
                    ? `border-gray-300 focus:ring-2 focus:ring-green-500 ${
                        errorMap?.[key] ? "border-red-500" : ""
                      }`
                    : "border-transparent bg-gray-100 text-gray-600 cursor-text"
                }`}
              />
            )}

            {errorMap?.[key] && (
              <p className="text-sm text-red-500 mt-1">{errorMap[key][0]}</p>
            )}
          </div>
        ))}

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

export default ServiceProviderProfileForm;