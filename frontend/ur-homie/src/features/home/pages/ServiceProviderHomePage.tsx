import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { fetchProviderServices } from "../../../services/api/serviceCatalog/fetch";
import { useAuth } from "../../../shared/context/AuthContext";
import LoadingSpinner from "../../../shared/components/ui/LoadingSpinner";
import { handleApiError } from "../../../shared/utils/handleApiError";

const ServiceCard = ({ id, name }: { id: string; name: string }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/services/${id}`)}
      className="bg-white/90 backdrop-blur p-4 rounded shadow hover:shadow-md transition cursor-pointer hover:bg-white"
    >
      <h3 className="text-md font-semibold text-green-700 truncate">{name}</h3>
    </div>
  );
};

const ServiceProviderHomePage = () => {
  const navigate = useNavigate();
  const { userId, logout } = useAuth();

  const [topServices, setServices] = useState<{ id: string; title: string }[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const loadServices = async () => {
      try {
        const res = await fetchProviderServices(userId, 0, 3);
        setServices(res.services);
      } catch (err: any) {
        handleApiError(err, {
          logout,
          knownMessages: {
            forbidden: "You don't have permission to access your services.",
            not_found: "No services found for this provider.",
          },
          onKnown: {
            not_found: () => {
              setServices([]);
            },
          },
          fallbackMessage:
            "Failed to load your services. Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, [userId, logout]);

  return (
    <section className="min-h-[calc(100vh-64px)] bg-[length:100%] bg-no-repeat bg-[center_35%] flex items-center justify-center px-6 py-10">
      <div className="max-w-6xl w-full text-white">
        <div className="bg-black/50 p-6 md:p-10 rounded-xl shadow-lg">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Manage your services with ease
              </h1>
              <p className="text-green-100 text-sm">
                Here's a quick snapshot of your active listings.
              </p>
            </div>
            <button
              onClick={() => navigate("/dashboard/add-service")}
              className="mt-4 md:mt-0 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md font-medium"
            >
              + Add New Service
            </button>
          </div>

          {loading ? (
            <LoadingSpinner text="Loading your services..." />
          ) : topServices.length === 0 ? (
            <p className="text-green-100">
              You have not added any services yet.
            </p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {topServices.map((service) => (
                  <ServiceCard
                    key={service.id}
                    id={service.id}
                    name={service.title}
                  />
                ))}
              </div>

              <div className="text-right mt-4">
                <button
                  onClick={() => navigate("/dashboard/my-services")}
                  className="text-sm text-green-300 hover:text-white underline"
                >
                  View all services →
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default ServiceProviderHomePage;
