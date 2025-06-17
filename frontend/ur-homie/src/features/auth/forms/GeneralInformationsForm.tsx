import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-hot-toast";

import { authClient } from "../../../services/grpc/clients/authClient";
import { listenForRegistrationStatus } from "../../../services/websocket/registrationStatusSocket";
import { createChangeHandler } from "../../../shared/utils/formUtils";
import { formatLabel } from "../../../shared/utils/formattersUtils";
import { buildClientSignUpRequest } from "../../../services/grpc/requests/authRequests";
import { validateGeneralForm } from "../validation/generalFormValidation";
import { GeneralFormData } from "../../../shared/types/forms";
import { AuthInput } from "../components/AuthInput";
import FormOverlaySpinner from "../../../shared/components/ui/FormOverlaySpinner";
import RoleSelector from "../components/RoleSelector";

const GeneralInformationsForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as any;

  const [role, setRole] = useState<"client" | "service_provider" | "">(
    locationState?.role || ""
  );
  const [providerDetails] = useState(locationState?.providerDetails || null);

  const [formData, setFormData] = useState<GeneralFormData>({
    email: locationState?.email || "",
    password: "",
    firstName: locationState?.firstName || "",
    lastName: locationState?.lastName || "",
    phoneNumber: locationState?.phoneNumber || "",
    country: locationState?.country || "",
    city: locationState?.city || "",
    address: locationState?.address || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = createChangeHandler(formData, setFormData);

  const handleRoleChange = (selectedRole: "client" | "service_provider") => {
    setRole(selectedRole);
    setErrors((prev) => ({ ...prev, role: "" }));
  };

  const handleContinue = () => {
    const validationErrors = validateGeneralForm(formData, role);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);

    if (role === "service_provider") {
      navigate("/register/service-provider", {
        state: { ...formData, role, providerDetails },
      });
      return;
    }

    const req = buildClientSignUpRequest(formData);
    authClient.signUp(req, {}, (err, resp) => {
      if (err || resp.getErrorMessage()) {
        toast.error(
          err?.message || resp.getErrorMessage() || "Registration error."
        );
        setIsSubmitting(false);
        return;
      }

      const correlationId = resp.getCorrelationId();
      if (!correlationId) {
        toast.error("No tracking ID received.");
        setIsSubmitting(false);
        return;
      }

      listenForRegistrationStatus(correlationId, (status, errorMsg) => {
        setIsSubmitting(false);
        if (status === "completed") {
          toast.success("Registration successful! Redirecting...");
          setTimeout(() => navigate("/login"), 2000);
        } else {
          toast.error(errorMsg || "Registration failed.");
        }
      });
    });
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-green-50">
      <form className="bg-white p-8 rounded shadow-md w-full max-w-2xl relative z-0">
        <h2 className="text-2xl font-bold mb-6 text-green-700 text-center">
          General Information
        </h2>

        <div className="grid grid-cols-2 gap-4">
          {Object.entries(formData).map(([key, value]) => (
            <AuthInput
              key={key}
              label={formatLabel(key)}
              name={key}
              type={
                key === "password"
                  ? showPassword
                    ? "text"
                    : "password"
                  : "text"
              }
              value={value}
              onChange={handleChange}
              showToggle={key === "password"}
              showPassword={showPassword}
              onToggle={() => setShowPassword((prev) => !prev)}
              error={errors[key]}
            />
          ))}
        </div>

        <RoleSelector
          value={role}
          onChange={handleRoleChange}
          error={errors["role"]}
        />

        <button
          type="button"
          onClick={handleContinue}
          className="mt-6 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded mx-auto block"
        >
          Continue
        </button>

        {isSubmitting && (
          <FormOverlaySpinner text="Registering..." color="green" size="md" />
        )}
      </form>
    </div>
  );
};

export default GeneralInformationsForm;
