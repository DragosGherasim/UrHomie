import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { fetchClientBookings } from "../../../services/api/bookingService/fetch";
import { fetchServiceById } from "../../../services/api/serviceCatalog/fetch";
import { cancelBooking } from "../../../services/api/bookingService/update";
import { handleApiError } from "../../../shared/utils/handleApiError";
import { useAuth } from "../../../shared/context/AuthContext";
import BookingCard from "../components/BookingCard";
import FormOverlaySpinner from "../../../shared/components/ui/FormOverlaySpinner";
import DeclineBookingModal from "../components/DeclineBookingModal";
import BookingDetailsModal from "../components/BookingDetailsModal";

type BookingWithService = {
  id: number;
  scheduledAt: string;
  status: string;
  serviceTitle: string;
  serviceDescription: string;
  basePrice: number;
  providerPhone: string;
  extraDetails?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  finishAt?: string | null;
};

const MyBookingsPage = () => {
  const { userId, logout } = useAuth();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState<BookingWithService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedBookingDetails, setSelectedBookingDetails] = useState<BookingWithService | null>(null);

  useEffect(() => {
    const loadBookings = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        setError(null);

        const res = await fetchClientBookings(userId, page);
        const rawBookings = res.bookings;

        const enriched = await Promise.all(
          rawBookings.map(async (booking: any) => {
            try {
              const service = await fetchServiceById(booking.serviceId);
              return {
                id: booking.id,
                scheduledAt: booking.scheduledAt,
                status: booking.status,
                serviceTitle: service.title,
                serviceDescription: service.description,
                basePrice: service.basePrice,
                providerPhone: service.phoneNumber,
                extraDetails: booking.extraDetails,
                createdAt: booking.createdAt,
                updatedAt: booking.updatedAt,
                finishAt: booking.finishAt,
              };
            } catch {
              return {
                id: booking.id,
                scheduledAt: booking.scheduledAt,
                status: booking.status,
                serviceTitle: "Unavailable Service",
                serviceDescription: "This service is no longer available.",
                basePrice: 0,
                providerPhone: "Unavailable",
                extraDetails: "Unavailable",
                createdAt: booking.createdAt,
                updatedAt: booking.updatedAt,
                finishAt: booking.finishAt,
              };
            }
          })
        );

        setBookings(enriched);
        setTotalPages(res.totalPages);
      } catch (err: any) {
        handleApiError(err, {
          logout,
          knownMessages: {
            unauthorized: "Please log in to see your bookings.",
            forbidden: "Access denied.",
            not_found: "No bookings found.",
          },
          onKnown: {
            not_found: () => {
              setBookings([]);
              setTotalPages(1);
              setError("not_found");
            },
          },
          onDefault: () => {
            toast.error("Failed to load bookings.");
            setError("unknown");
          },
        });
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, [userId, page, logout]);

  const handleOpenCancelModal = (bookingId: number) => {
    setSelectedBookingId(bookingId);
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = async (message: string) => {
    if (!selectedBookingId) return;

    try {
      await cancelBooking(selectedBookingId, message);
      toast.success("Booking cancelled.");
      setBookings((prev) =>
        prev.map((b) =>
          b.id === selectedBookingId ? { ...b, status: "CANCELLED" } : b
        )
      );
    } catch (err) {
      toast.error("Failed to cancel booking.");
      console.error(err);
    } finally {
      setCancelModalOpen(false);
      setSelectedBookingId(null);
    }
  };

  const handleOpenDetailsModal = (booking: BookingWithService) => {
    setSelectedBookingDetails(booking);
    setDetailsModalOpen(true);
  };

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center text-center text-white mt-10 space-y-4">
      <h2 className="text-2xl font-bold">You don't have any bookings yet</h2>
      <p className="text-gray-200 max-w-md">
        Find a service and make your first booking to get started.
      </p>
      <button
        onClick={() => navigate("/home")}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Explore Services
      </button>
    </div>
  );

  const renderErrorState = () => (
    <div className="flex flex-col items-center justify-center text-center text-white mt-10 space-y-4">
      <h2 className="text-2xl font-bold">Something went wrong</h2>
      <p className="text-red-300 max-w-md">
        Failed to load your bookings. Please try again later.
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
          My Bookings
        </h1>

        <div className="relative min-h-[300px]">
          {loading && (
            <FormOverlaySpinner
              text="Loading bookings..."
              color="green"
              size="md"
            />
          )}

          {!loading && error && error !== "not_found" && renderErrorState()}
          {!loading && error === "not_found" && renderEmptyState()}

          {!loading && !error && bookings.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-500 animate-fade-in">
                {bookings.map((b) => (
                  <BookingCard
                    key={b.id}
                    id={b.id}
                    title={b.serviceTitle}
                    description={b.serviceDescription}
                    basePrice={b.basePrice}
                    scheduledAt={b.scheduledAt}
                    status={b.status}
                    providerPhone={b.providerPhone}
                    extraDetails={b.extraDetails}
                    createdAt={b.createdAt}
                    updatedAt={b.updatedAt}
                    finishAt={b.finishAt}
                    onCancel={() => handleOpenCancelModal(b.id)}
                    onMoreDetails={() => handleOpenDetailsModal(b)}
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

      <DeclineBookingModal
        isOpen={cancelModalOpen}
        onClose={() => {
          setCancelModalOpen(false);
          setSelectedBookingId(null);
        }}
        onConfirm={handleConfirmCancel}
      />

      {selectedBookingDetails && (
        <BookingDetailsModal
          isOpen={detailsModalOpen}
          onClose={() => {
            setDetailsModalOpen(false);
            setSelectedBookingDetails(null);
          }}
          booking={selectedBookingDetails}
        />
      )}
    </main>
  );
};

export default MyBookingsPage;
