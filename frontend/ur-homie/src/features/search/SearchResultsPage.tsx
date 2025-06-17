import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import ServiceCard from "../dashboard/provided-services/components/ServiceCard";
import { fetchServicesBySearch } from "../../services/api/serviceCatalog/fetch";
import FormOverlaySpinner from "../../shared/components/ui/FormOverlaySpinner";
import heroClient from "../../assets/images/hero-client.png";
import HomeNav from "../../shared/components/layout/HomeNav";
import { useAuth } from "../../shared/context/AuthContext";
import { handleApiError } from "../../shared/utils/handleApiError";

const SearchResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, role } = useAuth();

  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("query") ?? "";

  const [services, setServices] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetchServicesBySearch(query, currentPage);
        setServices(response.services);
        setTotalPages(response.totalPages);
      } catch (err: any) {
        handleApiError(err, {
          logout,
          knownMessages: {
            forbidden: "You are not allowed to perform this action.",
            not_found: "No services found.",
            invalid_parameters: "Invalid search. Redirecting...",
          },
          fallbackMessage: "Something went wrong. Redirecting to Home.",
          onKnown: {
            invalid_parameters: () => navigate("/not-found?type=search"),
          },
          onDefault: () => {
            if (err.message !== "not_found") {
              navigate("/home");
            }
          },
        });

        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, currentPage, logout, navigate]);

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center text-center text-white mt-10 space-y-4">
      <h2 className="text-2xl font-bold">No results found</h2>
      <p className="text-gray-200 max-w-md">
        We couldn't find any services matching your search.
      </p>
      <button
        onClick={() => navigate("/home")}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Back to Home
      </button>
    </div>
  );

  return (
    <div
      className="relative w-full min-h-screen bg-cover bg-[center_40%]"
      style={{ backgroundImage: `url(${heroClient})` }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-0" />

      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="h-16 bg-green-50/60 backdrop-blur-sm shadow-sm z-10">
          <HomeNav role={role} />
        </header>

        <main className="flex-1 p-6 flex justify-center items-start">
          <div className="max-w-6xl w-full">
            <h1 className="text-3xl font-bold mb-6 text-white drop-shadow-md">
              Search Results for: "{query || "All services"}"
            </h1>

            <div className="relative min-h-[300px]">
              {loading && (
                <FormOverlaySpinner
                  text="Loading search results..."
                  color="green"
                  size="md"
                />
              )}

              {!loading &&
                (error === "not_found" || services.length === 0) &&
                renderEmptyState()}

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
      </div>
    </div>
  );
};

export default SearchResultsPage;
