import { useEffect, useState } from "react";
import { useAuth } from "../../../../shared/context/AuthContext";
import { handleApiError } from "../../../../shared/utils/handleApiError";
import FormOverlaySpinner from "../../../../shared/components/ui/FormOverlaySpinner";
import RequestCard from "../components/RequestCard";
import { fetchProviderRequests } from "../../../../services/api/bookingService/fetch";
import { fetchServiceById } from "../../../../services/api/serviceCatalog/fetch";
import {
  confirmBooking,
  finishBooking,
  cancelBooking,
} from "../../../../services/api/bookingService/update";
import { toast } from "react-hot-toast";

const MyRequestsPage = () => {
  const { userId, logout } = useAuth();

  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const loadRequests = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        setError(null);

        const res = await fetchProviderRequests(userId, page);
        const serviceTitleCache = new Map<string, string>();

        const enriched = await Promise.all(
          res.bookings.map(async (booking) => {
            if (serviceTitleCache.has(booking.serviceId)) {
              return {
                ...booking,
                serviceTitle: serviceTitleCache.get(booking.serviceId)!,
              };
            }

            try {
              const service = await fetchServiceById(booking.serviceId);
              serviceTitleCache.set(booking.serviceId, service.title);
              return {
                ...booking,
                serviceTitle: service.title,
              };
            } catch {
              const fallbackTitle = "Unavailable Service";
              serviceTitleCache.set(booking.serviceId, fallbackTitle);
              return {
                ...booking,
                serviceTitle: fallbackTitle,
              };
            }
          })
        );

        setRequests(enriched);
        setTotalPages(res.totalPages);
      } catch (err: any) {
        handleApiError(err, {
          logout,
          knownMessages: {
            unauthorized: "Please log in to see your requests.",
            forbidden: "Access denied.",
            not_found: "No requests found.",
          },
          onKnown: {
            not_found: () => {
              setRequests([]);
              setTotalPages(1);
              setError("not_found");
            },
          },
          onDefault: () => {
            toast.error("Failed to load your requests.");
            setError("unknown");
          },
        });
      } finally {
        setLoading(false);
      }
    };

    loadRequests();
  }, [userId, page, logout]);

  const handleConfirm = async (id: number) => {
    try {
      await confirmBooking(id);
      toast.success("Booking confirmed.");
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "CONFIRMED" } : r))
      );
    } catch (err: any) {
      handleApiError(err, { logout });
    }
  };

  const handleFinish = async (id: number) => {
    try {
      await finishBooking(id);
      toast.success("Booking marked as complete.");
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "FINISHED" } : r))
      );
    } catch (err: any) {
      handleApiError(err, { logout });
    }
  };

  const handleDecline = async (id: number, message: string) => {
    try {
      await cancelBooking(id, message);
      toast.success("Booking declined.");
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "CANCELLED" } : r))
      );
    } catch (err: any) {
      handleApiError(err, {
        logout,
        knownMessages: {
          validation_failed: "Please enter a valid message for decline.",
        },
      });
    }
  };

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center text-center text-white mt-10 space-y-4">
      <h2 className="text-2xl font-bold">
        You haven't received any requests yet
      </h2>
      <p className="text-gray-200 max-w-md">
        Once a client books your service, the requests will appear here.
      </p>
    </div>
  );

  const renderErrorState = () => (
    <div className="flex flex-col items-center justify-center text-center text-white mt-10 space-y-4">
      <h2 className="text-2xl font-bold">Something went wrong</h2>
      <p className="text-red-300 max-w-md">
        Failed to load your requests. Please try again later.
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
          My Requests
        </h1>

        <div className="relative min-h-[300px]">
          {loading && (
            <FormOverlaySpinner
              text="Loading requests..."
              color="green"
              size="md"
            />
          )}

          {!loading && error && error !== "not_found" && renderErrorState()}
          {!loading && error === "not_found" && renderEmptyState()}

          {!loading && !error && requests.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-500 animate-fade-in">
                {requests.map((r) => (
                  <RequestCard
                    key={r.id}
                    id={r.id}
                    scheduledAt={r.scheduledAt}
                    clientName={`${r.firstName} ${r.lastName}`}
                    city={r.city}
                    address={r.address}
                    phoneNumber={r.phoneNumber}
                    status={r.status}
                    serviceTitle={r.serviceTitle}
                    extraDetails={r.extraDetails}
                    createdAt={r.createdAt}
                    updatedAt={r.updatedAt}
                    finishAt={r.finishAt}
                    onConfirm={handleConfirm}
                    onFinish={handleFinish}
                    onDecline={handleDecline}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center mt-8 items-center space-x-6">
                  <button
                    onClick={() => setPage((p) => p - 1)}
                    disabled={page === 0}
                    className="w-32 text-center px-4 py-2 bg-green-600 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  <h2 className="text-xl font-bold text-white drop-shadow-md">
                    Page {page + 1} of {totalPages}
                  </h2>

                  <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={page + 1 >= totalPages}
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

export default MyRequestsPage;
