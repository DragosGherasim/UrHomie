import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ServiceCard from "../components/ServiceCard";
import FormOverlaySpinner from "../../../../shared/components/ui/FormOverlaySpinner";
import { fetchProviderServices } from "../../../../services/api/serviceCatalog/fetch";
import { useAuth } from "../../../../shared/context/AuthContext";
import { handleApiError } from "../../../../shared/utils/handleApiError";

const MyServicesPage = () => {
  const { userId, logout } = useAuth();
  const navigate = useNavigate();

  const [services, setServices] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const loadServices = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetchProviderServices(userId, currentPage);
        setServices(response.services);
        setTotalPages(response.totalPages);
      } catch (err: any) {
        handleApiError(err, {
          logout,
          knownMessages: {
            forbidden: "You don't have permission to view these services.",
            not_found: "No services found for this provider.",
          },
          onKnown: {
            not_found: () => {
              setServices([]);
              setTotalPages(1);
              setError("not_found");
            },
          },
          fallbackMessage:
            "Failed to load your services. Please try again later.",
        });

        if (err.message !== "not_found") {
          setError(err.message || "Unknown error");
        }
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, [userId, currentPage, logout]);

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center text-center text-white mt-10 space-y-4">
      <h2 className="text-2xl font-bold">You haven't added any services yet</h2>
      <p className="text-gray-200 max-w-md">
        Start by creating a new service to let clients discover your expertise.
      </p>
      <button
        onClick={() => navigate("/dashboard/add-service")}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Add Service
      </button>
    </div>
  );

  const renderErrorState = () => (
    <div className="flex flex-col items-center justify-center text-center text-white mt-10 space-y-4">
      <h2 className="text-2xl font-bold">Something went wrong</h2>
      <p className="text-red-300 max-w-md">
        Failed to load your services. Please try again later.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Retry
      </button>
    </div>
  );

  return (
    <main className="w-full flex justify-center items-start py-1 px-4 md:px-8">
      <div className="w-full max-w-6xl">
        <h1 className="text-3xl font-bold mb-6 text-white drop-shadow-md">
          My Services
        </h1>

        <div className="relative min-h-[300px]">
          {loading && (
            <FormOverlaySpinner
              text="Loading services..."
              color="green"
              size="md"
            />
          )}

          {!loading && error && error !== "not_found" && renderErrorState()}
          {!loading && error === "not_found" && renderEmptyState()}

          {!loading && !error && services.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-500 animate-fade-in">
                {services.map((s) => (
                  <ServiceCard
                    key={s.id}
                    title={s.title}
                    description={s.description}
                    imageUrl={s.categoryPreview.imagePath}
                    city={s.city}
                    address={s.address}
                    basePrice={s.basePrice}
                    durationEstimate={s.durationEstimate}
                    onClick={() => navigate(`/services/${s.id}`)}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center mt-8 items-center space-x-6">
                  <button
                    onClick={() => setCurrentPage((p) => p - 1)}
                    disabled={currentPage === 0}
                    className="w-32 text-center px-4 py-2 bg-green-600 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  <h2 className="text-xl font-bold text-white drop-shadow-md">
                    Page {currentPage + 1} of {totalPages}
                  </h2>

                  <button
                    onClick={() => setCurrentPage((p) => p + 1)}
                    disabled={currentPage + 1 >= totalPages}
                    className="w-32 text-center px-4 py-2 bg-green-600 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default MyServicesPage;