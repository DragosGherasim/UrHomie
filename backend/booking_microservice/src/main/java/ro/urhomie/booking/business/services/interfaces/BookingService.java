package ro.urhomie.booking.business.services.interfaces;

import ro.urhomie.booking.business.dtos.booking.BookingDto;
import ro.urhomie.booking.business.dtos.booking.BookingSearchDto;
import ro.urhomie.booking.business.dtos.booking.CreateBookingDto;

import java.util.Optional;

public interface BookingService {
    BookingSearchDto getBookingByClientId(Long clientId, int page, int size);
    BookingSearchDto getBookingByProviderId(Long serviceProviderId, int page, int size);
    Optional<BookingDto> getBookingById(Long id);
    BookingDto createBooking(CreateBookingDto createBookingDto);
    BookingDto confirmBooking(BookingDto Dto);
    BookingDto cancelBooking(BookingDto booking, String message, String userRole);
    BookingDto finishBooking(BookingDto bookingDto);
}
