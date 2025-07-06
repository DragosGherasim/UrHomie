import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import { fetchServiceById } from "../../../../services/api/serviceCatalog/fetch";
import { deleteServiceById } from "../../../../services/api/serviceCatalog/delete";
import { fetchUserProfile } from "../../../../services/api/userProfile/fetch";

import FormOverlaySpinner from "../../../../shared/components/ui/FormOverlaySpinner";
import ConfirmDeleteModal from "../../../../shared/components/ui/ConfirmDeleteModal";
import { useAuth } from "../../../../shared/context/AuthContext";
import { formatLabel } from "../../../../shared/utils/formattersUtils";
import { handleApiError } from "../../../../shared/utils/handleApiError";
import ServiceDetailsLayout from "../layout/ServiceDetailsLayout";
import ProvidedServiceEditForm from "../forms/EditServiceForm";
import BookingModal from "../../../bookings/components/AddBookingModal";

const ServiceDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { role, userId, logout } = useAuth();

  const [service, setService] = useState<any | null>(null);
  const [providerInfo, setProviderInfo] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetchServiceById(id!);
        setService(res);

        if (res?.providerId && role === "client") {
          const provider = await fetchUserProfile(
            res.providerId,
            "service_provider"
          );
          setProviderInfo(provider);
        }
      } catch (err: any) {
        handleApiError(err, {
          logout,
          knownMessages: {
            not_found: "",
            unauthorized: "Please log in to view this service.",
            forbidden: "You are not allowed to view this service.",
          },
          onKnown: {
            not_found: () =>
              navigate("/not-found?type=service", { replace: true }),
              unauthorized: () => navigate("/home", { replace: true }),
              forbidden: () => navigate("/home", { replace: true }),
          },
          onDefault: () => {
            toast.error("Something went wrong. Please try again later.");
            navigate("/home", { replace: true });
          },
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
    else navigate("/not-found?type=service", { replace: true });
  }, [id, navigate, logout, role]);

  const handleDelete = async () => {
    if (!id) return;
    try {
      await deleteServiceById(id);
      toast.success("Service deleted successfully!");
      navigate("/dashboard/my-services");
    } catch (err: any) {
      handleApiError(err, {
        logout,
        onDefault: () => toast.error("Delete failed."),
      });
    }
  };

  return (
    <ServiceDetailsLayout>
      {loading ? (
        <FormOverlaySpinner text="Loading service..." color="green" />
      ) : service ? (
        <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl max-w-3xl w-full p-6 md:p-10">
          {isEditing ? (
            <ProvidedServiceEditForm
              serviceId={service.id}
              categoryId={service.categoryId}
              initialFormData={{
                title: service.title,
                description: service.description,
                basePrice: service.basePrice,
                city: service.city,
                address: service.address,
                phoneNumber: service.phoneNumber,
                durationEstimate: service.durationEstimate,
                ...service.details,
              }}
              originalDetails={service.details}
              onClose={() => setIsEditing(false)}
              onSaveSuccess={(updated) => {
                setService(updated);
                setIsEditing(false);
              }}
            />
          ) : (
            <>
              <div className="space-y-2 mb-4">
                <h1 className="text-3xl font-bold text-gray-900">
                  {service.title}
                </h1>
                <p className="text-gray-700">{service.description}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <strong className="text-gray-800">City:</strong>{" "}
                  {service.city}
                </div>
                <div>
                  <strong className="text-gray-800">Address:</strong>{" "}
                  {service.address}
                </div>
                <div>
                  <strong className="text-gray-800">Phone number:</strong>{" "}
                  {service.phoneNumber}
                </div>

                <div>
                  <strong className="text-gray-800">Base price:</strong>{" "}
                  {service.basePrice} RON
                </div>
                <div>
                  <strong className="text-gray-800">Estimated duration:</strong>{" "}
                  {service.durationEstimate}
                </div>

                {service.details &&
                  Object.entries(service.details).map(([key, value]) => (
                    <div key={key}>
                      <strong className="text-gray-800">
                        {formatLabel(key)}:
                      </strong>{" "}
                      {Array.isArray(value) ? value.join(", ") : String(value)}
                    </div>
                  ))}
              </div>

              {role === "client" && providerInfo && (
                <div className="mt-8 border-t pt-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Service Provider Information
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <strong>Full name:</strong> {providerInfo.firstName}{" "}
                      {providerInfo.lastName}
                    </div>
                    <div>
                      <strong>Email:</strong> {providerInfo.email}
                    </div>
                    <div>
                      <strong>Education:</strong> {providerInfo.education}
                    </div>
                    <div>
                      <strong>Certifications:</strong>{" "}
                      {providerInfo.certifications}
                    </div>
                    <div>
                      <strong>Experience:</strong>{" "}
                      {providerInfo.experienceDescriptions}
                    </div>
                  </div>
                </div>
              )}

              {role === "service_provider" && service.providerId === userId && (
                <div className="flex gap-4 justify-end mt-6">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-md"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-md"
                  >
                    Delete
                  </button>
                </div>
              )}

              {role === "client" && (
                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => setShowBookingModal(true)}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-md"
                  >
                    Book this service
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      ) : null}

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={async () => {
          setShowDeleteModal(false);
          await handleDelete();
        }}
        message="Are you sure you want to permanently delete this service?"
      />

      {service && showBookingModal && (
        <BookingModal
          isOpen={showBookingModal}
          onClose={() => setShowBookingModal(false)}
          serviceId={service.id}
          providerId={service.providerId}
          onSuccess={() => navigate("/my-bookings")}
        />
      )}
    </ServiceDetailsLayout>
  );
};

export default ServiceDetailsPage;
