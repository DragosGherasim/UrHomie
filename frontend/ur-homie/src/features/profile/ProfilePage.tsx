import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import heroImage from "../../assets/images/hero.png";
import LoadingSpinner from "../../components/LoadingSpinner";
import ClientProfileForm from "./ClientProfileForm";
import ServiceProviderProfileForm from "./ServiceProviderProfileForm";

const ProfilePage = () => {
  const { accessToken, isAuthenticated, userId, role } = useAuth();
  const [formData, setFormData] = useState<any>(null);
  const [originalData, setOriginalData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const endpoint =
          role === "client"
            ? `client/${userId}`
            : `service-provider/${userId}`;

        const response = await axios.get(
          `http://localhost:80/api/user-management/${endpoint}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        console.log("Received profile:", response.data);
        setFormData(response.data);
        setOriginalData(response.data);
      } catch {
        navigate("/home");
      }
    };

    if (isAuthenticated && accessToken && userId) {
      fetchProfile();
    }
  }, [isAuthenticated, accessToken, userId, navigate, role]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (isEditing) {
      setFormData((prev: any) => (prev ? { ...prev, [name]: value } : prev));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    setOriginalData(formData);
  };

  const handleClose = () => {
    setFormData(originalData);
    setIsEditing(false);
  };

  return (
    <div
      className="relative w-full h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${heroImage})` }}
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
            />
          ) : (
            <ServiceProviderProfileForm
              formData={formData}
              isEditing={isEditing}
              onChange={handleChange}
              onSubmit={handleSubmit}
              onCancel={handleClose}
              setIsEditing={setIsEditing}
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
