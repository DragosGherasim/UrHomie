import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

import heroClient from "../../assets/images/hero-client.png";
import heroProvider from "../../assets/images/hero-serv-prov.png";

import LoadingSpinner from "../../components/ui/LoadingSpinner";
import ClientProfileForm from "./ClientProfileForm";
import ServiceProviderProfileForm from "./ServiceProviderProfileForm";

import { fetchUserProfile } from "../../services/api/userProfile/fetch";
import { patchUserProfile } from "../../services/api/userProfile/update";
import { toast } from "react-hot-toast";
import { buildPatchPayload } from "../../utils/buildPatchPayloadUtils";

const ProfilePage = () => {
  const { accessToken, isAuthenticated, userId, role, logout } = useAuth();
  const [formData, setFormData] = useState<any>(null);
  const [originalData, setOriginalData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [errorMap, setErrorMap] = useState<Record<string, string[]>>();
  const navigate = useNavigate();

  const backgroundImage = role === "client" ? heroClient : heroProvider;

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchUserProfile(userId!, role!);
        setFormData(data);
        setOriginalData(data);
      } catch (err: any) {
        const msg = err.message;

        if (msg === "unauthorized") toast.error("You must be logged in.");
        else if (msg === "forbidden")
          toast.error("You don't have permission to access this profile.");
        else if (msg === "not_found") toast.error("Profile not found.");
        else toast.error("Something went wrong. Please try again later.");

        logout();
      }
    };

    if (isAuthenticated && accessToken && userId) {
      loadProfile();
    }
  }, [isAuthenticated, accessToken, userId, navigate, role]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    if (isEditing) {
      setFormData((prev: any) => (prev ? { ...prev, [name]: value } : prev));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMap(undefined);

    const payload = buildPatchPayload(originalData, formData);

    if (Object.keys(payload).length === 0) {
      toast("No changes were made.");
      setIsEditing(false);
      return;
    }

    try {
      const result = await patchUserProfile(userId!, role!, payload);

      if (!result.success) {
        setErrorMap(result.errors || {});
      } else {
        setIsEditing(false);
        setOriginalData(result.data);
        setFormData(result.data);
        toast.success("Your profile has been updated successfully!");
      }
    } catch (err: any) {
      const msg = err.message;

      if (msg === "unauthorized") toast.error("You must be logged in.");
      else if (msg === "forbidden")
        toast.error("You don't have permission to access this profile.");
      else if (msg === "not_found") toast.error("Profile not found.");
      else toast.error("Something went wrong. Please try again later.");

      logout();
    }
  };

  const handleClose = () => {
    setFormData(originalData);
    setIsEditing(false);
    setErrorMap(undefined);
  };

  return (
    <div
      className="relative w-full h-screen bg-cover bg-[center_40%]"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-0" />

      {formData ? (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          {role === "client" ? (
            <ClientProfileForm
              formData={formData}
              isEditing={isEditing}
              onChange={handleChange}
              onSubmit={handleSubmit}
              onCancel={handleClose}
              setIsEditing={setIsEditing}
              errorMap={errorMap}
            />
          ) : (
            <ServiceProviderProfileForm
              formData={formData}
              isEditing={isEditing}
              onChange={handleChange}
              onSubmit={handleSubmit}
              onCancel={handleClose}
              setIsEditing={setIsEditing}
              errorMap={errorMap}
            />
          )}
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <LoadingSpinner text="Loading profile..." />
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
