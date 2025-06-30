import React from "react";

interface TemplateField {
  name: string;
  type: string;
  label: string;
  options?: string[];
}

interface Props {
  formData: Record<string, any>;
  errorMap?: Record<string, string[]>;
  handleChange?: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  templateFields: TemplateField[];
  multiSelectState?: Record<string, string[]>;
  handleMultiSelectToggle?: (fieldName: string, option: string) => void;
  readOnlyMode?: boolean;
}

export const ServiceFormFields: React.FC<Props> = ({
  formData,
  errorMap = {},
  handleChange,
  templateFields,
  multiSelectState = {},
  handleMultiSelectToggle,
  readOnlyMode = false,
}) => {
  const renderError = (field: string) =>
    errorMap[field] && (
      <p className="text-sm text-red-500 mt-1">{errorMap[field][0]}</p>
    );

  const renderInput = (name: string, value: any, type: string = "text") => {
    if (readOnlyMode) return <p className="text-gray-800">{value}</p>;

    return (
      <input
        type={type}
        name={name}
        value={value}
        onChange={handleChange}
        className={`w-full border px-4 py-2 rounded-md ${
          errorMap[name] ? "border-red-500" : ""
        }`}
      />
    );
  };

  return (
    <>
      <div className="col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        {renderInput("title", formData.title)}
        {renderError("title")}
      </div>

      <div className="col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        {readOnlyMode ? (
          <p className="text-gray-800">{formData.description}</p>
        ) : (
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={`w-full border px-4 py-2 rounded-md ${
              errorMap.description ? "border-red-500" : ""
            }`}
          />
        )}
        {renderError("description")}
      </div>

      <div className="col-span-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          City
        </label>
        {renderInput("city", formData.city)}
        {renderError("city")}
      </div>

      <div className="col-span-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Address
        </label>
        {renderInput("address", formData.address)}
        {renderError("address")}
      </div>
      <div className="col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number
        </label>
        {renderInput("phoneNumber", formData.phoneNumber)}
        {renderError("phoneNumber")}
      </div>

      <div className="col-span-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Base Price
        </label>
        {renderInput("basePrice", formData.basePrice)}
        {renderError("basePrice")}
      </div>

      <div className="col-span-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Duration Estimate
        </label>
        {readOnlyMode ? (
          <p>{formData.durationEstimate}</p>
        ) : (
          <div className="flex gap-2">
            <div className="flex-1">
              <input
                type="number"
                name="durationDays"
                value={formData.durationDays}
                onChange={handleChange}
                className={`w-full border px-3 py-2 rounded-md ${
                  errorMap.durationEstimate
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                min={0}
                max={14}
              />

              <label className="block text-sm text-gray-600 mt-1 text-center">
                0–14 Days
              </label>
            </div>
            <div className="flex-1">
              <input
                type="number"
                name="durationHours"
                value={formData.durationHours}
                onChange={handleChange}
                className={`w-full border px-3 py-2 rounded-md ${
                  errorMap.durationEstimate
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                min={0}
                max={23}
              />
              <label className="block text-sm text-gray-600 mt-1 text-center">
                0–23 Hours
              </label>
            </div>
          </div>
        )}
        {renderError("durationEstimate")}
      </div>

      {templateFields.map((field) => (
        <div className="col-span-2" key={field.name}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {field.label}
          </label>
          {readOnlyMode ? (
            <p className="text-gray-800">
              {Array.isArray(formData[field.name])
                ? formData[field.name].join(", ")
                : typeof formData[field.name] === "boolean"
                ? formData[field.name]
                  ? "Yes"
                  : "No"
                : formData[field.name]}
            </p>
          ) : field.type === "multi-select" && field.options ? (
            <div className="flex flex-wrap gap-2">
              {field.options.map((opt) => (
                <button
                  type="button"
                  key={opt}
                  onClick={() => handleMultiSelectToggle?.(field.name, opt)}
                  className={`px-3 py-1 border rounded-md text-sm ${
                    multiSelectState[field.name]?.includes(opt)
                      ? "bg-green-500 text-white"
                      : "bg-white"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          ) : field.type === "select" && field.options ? (
            <select
              name={field.name}
              value={formData[field.name] || field.options[0]}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-md"
            >
              {field.options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          ) : field.type === "number" ? (
            <input
              type="number"
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-md"
            />
          ) : (
            <input
              type="text"
              name={field.name}
              value={formData[field.name] || ""}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-md"
            />
          )}
          {renderError(field.name)}
        </div>
      ))}
    </>
  );
};
