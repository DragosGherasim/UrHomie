package ro.urhomie.booking.business.services.interfaces;

import ro.urhomie.booking.business.dtos.booking_log.BookingLogDto;

import java.util.Optional;

public interface BookingLogService {
    Optional<BookingLogDto> getBookingLogWithCancelledStatus(Long bookingId);
}
