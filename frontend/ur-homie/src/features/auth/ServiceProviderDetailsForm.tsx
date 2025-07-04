import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import { SignUpRequest } from "../../services/grpc/proto/user_auth_pb";

import { authClient } from "../../services/grpc/authClient";
import { listenForRegistrationStatus } from "../../websocket/registrationStatusListener";
import { createChangeHandler } from "../../components/register/form";
import { validateMinLength, containsOnlySafeChars } from "../../utils/validations";
import { buildProviderSignUpRequest } from "../../services/grpc/requests/authRequests";

const ServiceProviderDetailsForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const generalData = location.state as any;

  useEffect(() => {
    if (!generalData) {
      toast.error("Missing registration data.");
      navigate("/register");
    }
  }, [generalData, navigate]);

  const initialProviderDetails = generalData?.providerDetails || {};

  const [details, setDetails] = useState({
    education: initialProviderDetails.education || "",
    certifications: initialProviderDetails.certifications || "",
    experienceDescription: initialProviderDetails.experienceDescription || "",
    startTime: initialProviderDetails.startTime || "08:00",
    endTime: initialProviderDetails.endTime || "17:00",
    coverageArea: initialProviderDetails.coverageArea || "5",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const handleChange = createChangeHandler(details, setDetails);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    const { education, certifications, experienceDescription } = details;

    if (!validateMinLength(education, 2) || !containsOnlySafeChars(education))
      newErrors.education = "Invalid education field.";

    if (!validateMinLength(certifications, 2) || !containsOnlySafeChars(certifications))
      newErrors.certifications = "Invalid certifications.";

    if (!validateMinLength(experienceDescription, 10) || !containsOnlySafeChars(experienceDescription))
      newErrors.experienceDescription = "Invalid description (min. 10 chars).";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const req: SignUpRequest = buildProviderSignUpRequest(generalData, details);

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

  const handleBack = () => {
    navigate("/register", {
      state: {
        ...generalData,
        providerDetails: details,
      },
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50">
      <Toaster />
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-2xl flex flex-col gap-4">
        <h2 className="text-2xl font-bold mb-6 text-green-700 text-center">Service Provider Details</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Education</label>
          <input
            type="text"
            name="education"
            value={details.education}
            onChange={handleChange}
            className={`border p-2 w-full rounded ${errors.education ? "border-red-500" : ""}`}
          />
          {errors.education && <p className="text-red-600 text-sm mt-1">{errors.education}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Certifications</label>
          <input
            type="text"
            name="certifications"
            value={details.certifications}
            onChange={handleChange}
            className={`border p-2 w-full rounded ${errors.certifications ? "border-red-500" : ""}`}
          />
          {errors.certifications && <p className="text-red-600 text-sm mt-1">{errors.certifications}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Experience Description</label>
          <textarea
            name="experienceDescription"
            value={details.experienceDescription}
            onChange={handleChange}
            className={`border p-2 w-full rounded ${errors.experienceDescription ? "border-red-500" : ""}`}
            rows={3}
          />
          {errors.experienceDescription && (
            <p className="text-red-600 text-sm mt-1">{errors.experienceDescription}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Working Schedule</label>
          <div className="grid grid-cols-2 gap-4">
            <select name="startTime" value={details.startTime} onChange={handleChange as any} className="border p-2 w-full rounded">
              {["06:00", "07:00", "08:00", "09:00", "10:00"].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <select name="endTime" value={details.endTime} onChange={handleChange as any} className="border p-2 w-full rounded">
              {["15:00", "16:00", "17:00", "18:00", "19:00"].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Coverage Area (km)</label>
          <select name="coverageArea" value={details.coverageArea} onChange={handleChange as any} className="border p-2 w-full rounded">
            {["5", "25", "50", "100"].map(area => <option key={area} value={area}>{area} km</option>)}
          </select>
        </div>

        <div className="flex justify-between mt-6">
          <button type="button" onClick={handleBack} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded">
            Back
          </button>
          <button type="submit" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default ServiceProviderDetailsForm;