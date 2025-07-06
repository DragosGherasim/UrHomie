import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import { useAuth } from "../../../../shared/context/AuthContext";
import {
  fetchServiceCategories,
  fetchCategoryTemplate,
} from "../../../../services/api/serviceCatalog/fetch";
import { postNewService } from "../../../../services/api/serviceCatalog/create";
import { fetchUserProfile } from "../../../../services/api/userProfile/fetch";
import { ServiceFormFields } from "../components/ServiceFormFields";
import LoadingSpinner from "../../../../shared/components/ui/LoadingSpinner";
import FormOverlaySpinner from "../../../../shared/components/ui/FormOverlaySpinner";
import { handleApiError } from "../../../../shared/utils/handleApiError";

interface Category {
  id: string;
  name: string;
}

interface TemplateField {
  name: string;
  type: string;
  label: string;
  options?: string[];
}

const AddServiceForm = () => {
  const navigate = useNavigate();
  const { userId, logout } = useAuth();

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [templateFields, setTemplateFields] = useState<TemplateField[]>([]);
  const [formData, setFormData] = useState<Record<string, any>>({
    title: "",
    description: "",
    city: "",
    address: "",
    basePrice: 0,
    durationDays: 0,
    durationHours: 0,
    phoneNumber: "",
  });

  const [errorMap, setErrorMap] = useState<Record<string, string[]>>({});
  const [multiSelectState, setMultiSelectState] = useState<Record<string, string[]>>({});
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingTemplate, setLoadingTemplate] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [fatalError, setFatalError] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchServiceCategories();
        setCategories(data);
        if (data.length > 0) {
          setSelectedCategoryId(data[0].id);
        }
      } catch (err: any) {
        handleApiError(err, {
          logout,
          knownMessages: {
            forbidden: "Failed to load your form. Please try again later.",
          },
          fallbackMessage: "Failed to load your form.",
          onDefault: () => setFatalError(true),
        });
      } finally {
        setLoadingInitial(false);
      }
    };
    loadCategories();
  }, [logout]);

  useEffect(() => {
    if (!selectedCategoryId) return;

    const loadTemplate = async () => {
      setLoadingTemplate(true);
      try {
        const data: { fields: TemplateField[] } = await fetchCategoryTemplate(selectedCategoryId);
        setTemplateFields(data.fields);

        const multiDefaults: Record<string, string[]> = {};

        data.fields.forEach((field) => {
          if (field.type === "multi-select") {
            multiDefaults[field.name] = [];
          } else if (field.type === "select" && field.options?.length) {
            setFormData((prev) => ({
              ...prev,
              [field.name]: field.options![0],
            }));
          } else if (field.type === "checkbox") {
            setFormData((prev) => ({ ...prev, [field.name]: false }));
          } else if (field.type === "number") {
            setFormData((prev) => ({ ...prev, [field.name]: 0 }));
          }
        });

        setMultiSelectState(multiDefaults);
      } catch (err: any) {
        handleApiError(err, {
          logout,
          knownMessages: {
            forbidden: "You don't have permission to access service templates.",
          },
          fallbackMessage: "Unable to load template.",
          onDefault: () => setFatalError(true),
        });
      } finally {
        setLoadingTemplate(false);
      }
    };

    loadTemplate();
  }, [selectedCategoryId, logout]);

  useEffect(() => {
    const preloadProviderProfile = async () => {
      if (!userId) return;
      try {
        const data = await fetchUserProfile(userId, "service_provider");

        setFormData((prev) => ({
          ...prev,
          city: prev.city || data.city || "",
          address: prev.address || data.address || "",
          phoneNumber: prev.phoneNumber || data.phoneNumber || "",
        }));
      } catch (err: any) {
        handleApiError(err, {
          logout,
          knownMessages: {
            unauthorized: "Please log in to continue.",
            not_found: "Profile not found.",
          },
          fallbackMessage: "Failed to prefill your profile info.",
          onDefault: () => setFatalError(true),
        });
      }
    };

    preloadProviderProfile();
  }, [userId, logout]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else if (type === "number") {
      const isValidPattern = /^(0|[1-9]\d{0,1})?$/.test(value);
      if (!isValidPattern) return;

      const parsed = parseInt(value);
      let validated = parsed;

      if (name === "durationDays") {
        validated = isNaN(parsed) || parsed < 0 || parsed > 14 ? 0 : parsed;
      } else if (name === "durationHours") {
        validated = isNaN(parsed) || parsed < 0 || parsed > 23 ? 0 : parsed;
      }

      setFormData((prev) => ({ ...prev, [name]: validated }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleMultiSelectToggle = (fieldName: string, option: string) => {
    setMultiSelectState((prev) => {
      const current = prev[fieldName] || [];
      const updated = current.includes(option)
        ? current.filter((opt) => opt !== option)
        : [...current, option];
      return { ...prev, [fieldName]: updated };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategoryId) return;

    setErrorMap({});

    const details: Record<string, any> = {};
    templateFields.forEach((field) => {
      if (field.type === "multi-select") {
        details[field.name] = multiSelectState[field.name] || [];
      } else {
        details[field.name] = formData[field.name];
      }
    });

    const { durationDays, durationHours } = formData;
    const durationEstimate =
      durationDays === 0 && durationHours === 0 ? "" : `${durationDays}d ${durationHours}h`;

    const payload = {
      categoryId: selectedCategoryId,
      providerId: userId,
      title: formData.title,
      description: formData.description,
      basePrice: formData.basePrice,
      durationEstimate,
      city: formData.city,
      address: formData.address,
      phoneNumber: formData.phoneNumber,
      details,
    };

    setLoadingSubmit(true);
    try {
      await postNewService(payload);
      toast.success("Service added successfully!");
      navigate("/dashboard/my-services");
    } catch (err: any) {
      handleApiError(err, {
        logout,
        knownMessages: {
          validation_failed: "Please check the highlighted fields.",
        },
        onKnown: {
          validation_failed: () => {
            const parsedErrors: Record<string, string[]> = {};
            for (const [key, val] of Object.entries(err.validationErrors || {})) {
              const finalKey = key.startsWith("details.") ? key.split(".")[1] : key;
              parsedErrors[finalKey] = Array.isArray(val) ? val : [String(val)];
            }
            setErrorMap(parsedErrors);
          },
        },
        fallbackMessage: "Failed to submit service. Please try again later.",
      });
    } finally {
      setLoadingSubmit(false);
    }
  };

   const renderErrorState = () => (
    <div className="flex flex-col items-center justify-center text-center text-white mt-10 space-y-4">
      <h2 className="text-2xl font-bold">Something went wrong</h2>
      <p className="text-red-300 max-w-md">
        Failed to load your form. Please try again later.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Retry
      </button>
    </div>
  );

  if (loadingInitial) {
    return <LoadingSpinner text="Loading..." />;
  }

  if (fatalError) {
    return renderErrorState();
  }

  return (
    <div className="w-full max-w-3xl bg-white p-8 rounded-2xl shadow-2xl relative">
      {(loadingTemplate || loadingSubmit) && (
        <FormOverlaySpinner
          text={loadingSubmit ? "Submitting service..." : "Updating form..."}
        />
      )}

      <h2 className="text-2xl font-bold text-gray-800 mb-6">Add a New Service</h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-2 gap-6 max-h-[75vh] overflow-y-auto pr-[18px]"
      >
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            name="categoryId"
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            className="w-full border px-4 py-2 rounded-md"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

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
            disabled={loadingSubmit}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddServiceForm;