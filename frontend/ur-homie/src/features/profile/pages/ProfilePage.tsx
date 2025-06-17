import { useEffect, useState } from "react";
import { useAuth } from "../../../shared/context/AuthContext";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../../shared/components/ui/LoadingSpinner";
import ClientProfileForm from "../forms/ClientProfileForm";
import ServiceProviderProfileForm from "../forms/ServiceProviderProfileForm";
import { fetchUserProfile } from "../../../services/api/userProfile/fetch";
import { patchUserProfile } from "../../../services/api/userProfile/update";
import { toast } from "react-hot-toast";
import { buildPatchPayload } from "../../../shared/utils/buildPatchPayloadUtils";
import ProfileLayout from "../layout/ProfileLayout";
import { handleApiError } from "../../../shared/utils/handleApiError";

const ProfilePage = () => {
  const { accessToken, isAuthenticated, userId, role, logout } = useAuth();
  const [formData, setFormData] = useState<any>(null);
  const [originalData, setOriginalData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [errorMap, setErrorMap] = useState<Record<string, string[]>>();
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchUserProfile(userId!, role!);
        setFormData(data);
        setOriginalData(data);
      } catch (err: any) {
        handleApiError(err, {
          logout,
          knownMessages: {
            not_found: "Profile not found.",
          },
          onKnown: {
            not_found: () => navigate("/not-found?type=profile"),
          },
          fallbackMessage: "Failed to load profile.",
        });
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
      handleApiError(err, {
        logout,
        knownMessages: {
          not_found: "Profile not found.",
          forbidden: "You don't have permission to update this profile.",
        },
        onKnown: {
          not_found: () => navigate("/not-found?type=profile"),
        },
        fallbackMessage: "Failed to update profile.",
      });
    }
  };

  const handleClose = () => {
    setFormData(originalData);
    setIsEditing(false);
    setErrorMap(undefined);
  };

  return (
    <ProfileLayout>
      {formData ? (
        role === "client" ? (
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
        )
      ) : (
        <LoadingSpinner text="Loading profile..." />
      )}
    </ProfileLayout>
  );
};

export default ProfilePage;