import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { patchServiceById } from "../../../../services/api/serviceCatalog/update";
import { fetchCategoryTemplate } from "../../../../services/api/serviceCatalog/fetch";
import { ServiceFormFields } from "../components/ServiceFormFields";
import FormOverlaySpinner from "../../../../shared/components/ui/FormOverlaySpinner";
import { handleApiError } from "../../../../shared/utils/handleApiError";
import { useAuth } from "../../../../shared/context/AuthContext";

interface TemplateField {
  name: string;
  type: string;
  label: string;
  options?: string[];
}

interface FormDataType {
  [key: string]: any;
}

interface Props {
  serviceId: string;
  initialFormData: FormDataType;
  originalDetails: Record<string, any>;
  categoryId: string;
  onClose: () => void;
  onSaveSuccess: (updatedData: any) => void;
}

const EditServiceForm: React.FC<Props> = ({
  serviceId,
  initialFormData,
  originalDetails,
  categoryId,
  onClose,
  onSaveSuccess,
}) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [templateFields, setTemplateFields] = useState<TemplateField[]>([]);
  const [multiSelectState, setMultiSelectState] = useState<
    Record<string, string[]>
  >({});
  const [errorMap, setErrorMap] = useState<Record<string, string[]>>({});
  const [loadingTemplate, setLoadingTemplate] = useState(true);
  const [saving, setSaving] = useState(false);

  const parseDuration = (
    estimate: string | null | undefined
  ): [number, number] => {
    const match = estimate?.match(/(?:(\d+)d)?\s*(?:(\d+)h)?/);
    return [parseInt(match?.[1] || "0"), parseInt(match?.[2] || "0")];
  };

  const [parsedDays, parsedHours] = parseDuration(
    initialFormData.durationEstimate
  );

  const [formData, setFormData] = useState<FormDataType>({
    ...initialFormData,
    phoneNumber: initialFormData.phoneNumber || "",
    durationDays: parsedDays,
    durationHours: parsedHours,
  });

  const [originalData] = useState<FormDataType>({
    ...initialFormData,
    phoneNumber: initialFormData.phoneNumber || "",
    durationDays: parsedDays,
    durationHours: parsedHours,
  });

  useEffect(() => {
    const loadTemplate = async () => {
      try {
        const data = await fetchCategoryTemplate(categoryId);
        setTemplateFields(data.fields);

        const multiDefaults: Record<string, string[]> = {};
        data.fields.forEach((field: TemplateField) => {
          if (field.type === "multi-select") {
            multiDefaults[field.name] = originalDetails[field.name] || [];
          }
        });

        setMultiSelectState(multiDefaults);
      } catch (err: any) {
        handleApiError(err, {
          logout,
          fallbackMessage: "Failed to load template.",
        });
      } finally {
        setLoadingTemplate(false);
      }
    };

    loadTemplate();
  }, [categoryId, originalDetails, logout]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else if (type === "number") {
      const parsed = parseInt(value);
      setFormData((prev) => ({ ...prev, [name]: isNaN(parsed) ? 0 : parsed }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleMultiSelectToggle = (fieldName: string, option: string) => {
    setMultiSelectState((prev) => {
      const current = prev[fieldName] || [];
      const updated = current.includes(option)
        ? current.filter((o) => o !== option)
        : [...current, option];
      return { ...prev, [fieldName]: updated };
    });
  };

  const buildPatchPayload = (): Record<string, any> => {
    const payload: Record<string, any> = {};

    [
      "title",
      "description",
      "basePrice",
      "city",
      "address",
      "phoneNumber",
    ].forEach((key) => {
      if (formData[key] !== originalData[key]) {
        payload[key] = formData[key];
      }
    });

    const days = formData.durationDays || 0;
    const hours = formData.durationHours || 0;
    const newDuration = days === 0 && hours === 0 ? "" : `${days}d ${hours}h`;

    if (newDuration !== originalData.durationEstimate) {
      payload.durationEstimate = newDuration;
    }

    const modifiedDetails: Record<string, any> = {};
    templateFields.forEach((field) => {
      const current =
        field.type === "multi-select"
          ? multiSelectState[field.name] || []
          : formData[field.name];
      const original = originalDetails[field.name];
      if (JSON.stringify(current) !== JSON.stringify(original)) {
        modifiedDetails[field.name] = current;
      }
    });

    if (Object.keys(modifiedDetails).length > 0) {
      payload.details = modifiedDetails;
    }

    return payload;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMap({});
    const payload = buildPatchPayload();

    if (Object.keys(payload).length === 0) {
      toast("No changes were made.");
      onClose();
      return;
    }

    setSaving(true);
    try {
      const updated = await patchServiceById(serviceId, payload);
      toast.success("Changes saved successfully!");
      onSaveSuccess(updated);
    } catch (err: any) {
      handleApiError(err, {
        logout,
        knownMessages: {
          not_found: "Service not found.",
          forbidden: "You cannot edit this service.",
          validation_failed: "Please correct the highlighted fields.",
        },
        onKnown: {
          not_found: () => navigate("/not-found?type=service"),
          validation_failed: () => {
            const parsed: Record<string, string[]> = {};
            const raw = err.validationErrors || {};
            for (const [key, val] of Object.entries(raw)) {
              const finalKey = key.startsWith("details.")
                ? key.split(".")[1]
                : key;
              parsed[finalKey] = Array.isArray(val) ? val : [String(val)];
            }
            setErrorMap(parsed);
          },
        },
        fallbackMessage: "Update failed. Try again later.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="relative bg-transparent p-0 w-full max-w-3xl">
      {(loadingTemplate || saving) && (
        <FormOverlaySpinner
          text={saving ? "Saving changes..." : "Loading template..."}
        />
      )}

      <div className="flex justify-between items-start mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Edit Service</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-red-500 text-xl font-bold"
        >
          ×
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-2 gap-6 max-h-[75vh] overflow-y-auto pr-[18px]"
      >
        <ServiceFormFields
          formData={formData}
          errorMap={errorMap}
          handleChange={handleChange}
          templateFields={templateFields}
          multiSelectState={multiSelectState}
          handleMultiSelectToggle={handleMultiSelectToggle}
        />

        <div className="col-span-2">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-xl font-semibold mx-auto block"
            disabled={saving}
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditServiceForm;