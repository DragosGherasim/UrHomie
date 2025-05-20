import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";

import { authClient } from "../../services/grpc/authClient";
import { listenForRegistrationStatus } from "../../websocket/registrationStatusListener";
import { createChangeHandler } from "../../components/register/form";
import { validateEmail, validatePhone, containsOnlySafeChars } from "../../utils/validations";
import { buildClientSignUpRequest } from "../../services/grpc/requests/authRequests";
import { AuthInput } from "../../components/register/AuthInput";
import { formatLabel } from "../../utils/formatters";

const GeneralInformationsForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as any;

  const [role, setRole] = useState<"client" | "service_provider" | "">(locationState?.role || "");
  const [providerDetails] = useState(locationState?.providerDetails || null);

  const [formData, setFormData] = useState({
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

  const handleChange = createChangeHandler(formData, setFormData);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!role) newErrors["role"] = "Please select a role.";
    if (!validateEmail(formData.email)) newErrors["email"] = "Invalid email.";
    if (!formData.password || formData.password.length < 6)
      newErrors["password"] = "Password must be at least 6 characters.";

    ["firstName", "lastName", "country", "city", "address"].forEach(field => {
      if (!formData[field as keyof typeof formData] || !containsOnlySafeChars(formData[field as keyof typeof formData])) {
        newErrors[field] = "Invalid input. Avoid special characters.";
      }
    });

    if (!validatePhone(formData.phoneNumber)) newErrors["phoneNumber"] = "Invalid phone number.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRoleChange = (selectedRole: "client" | "service_provider") => {
    setRole(selectedRole);
    setErrors(prev => ({ ...prev, role: "" }));
  };

  const handleContinue = () => {
    if (!validateForm()) return;

    if (role === "service_provider") {
      navigate("/register/service-provider", {
        state: {
          ...formData,
          role,
          providerDetails,
        },
      });
      return;
    }

    const req = buildClientSignUpRequest(formData);

    authClient.signUp(req, {}, (err, resp) => {
      if (err || resp.getErrorMessage()) {
        toast.error(err?.message || resp.getErrorMessage() || "Registration error.");
        return;
      }

      const correlationId = resp.getCorrelationId();
      if (!correlationId) {
        toast.error("No tracking ID received.");
        return;
      }

      listenForRegistrationStatus(correlationId, (status, errorMsg) => {
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
    <div className="flex items-center justify-center min-h-screen bg-green-50">
      <Toaster />
      <form className="bg-white p-8 rounded shadow-md w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6 text-green-700 text-center">General Information</h2>

        <div className="grid grid-cols-2 gap-4">
          {Object.entries(formData).map(([key, value]) => (
            <AuthInput
              key={key}
              label={formatLabel(key)}
              name={key}
              type={key === "password" ? (showPassword ? "text" : "password") : "text"}
              value={value}
              onChange={handleChange}
              showToggle={key === "password"}
              showPassword={showPassword}
              onToggle={() => setShowPassword(prev => !prev)}
              error={errors[key]}
            />
          ))}
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Role</label>
          <div className="flex gap-4">
            {["client", "service_provider"].map(r => (
              <button
                key={r}
                type="button"
                onClick={() => handleRoleChange(r as "client" | "service_provider")}
                className={`py-2 px-6 rounded-full border transition ${
                  role === r ? "bg-green-500 text-white" : "bg-white text-green-600 hover:bg-green-100"
                }`}
              >
                {r.replace("_", " ").replace(/\b\w/g, c => c.toUpperCase())}
              </button>
            ))}
          </div>
          {errors["role"] && <p className="text-red-600 text-sm mt-2">{errors["role"]}</p>}
        </div>

        <button
          type="button"
          onClick={handleContinue}
          className="mt-6 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded mx-auto block"
        >
          Continue
        </button>
      </form>
    </div>
  );
};

export default GeneralInformationsForm;
