package ro.urhomie.booking.business.utils.mappers;

import ro.urhomie.booking.persistence.entities.Booking;
import ro.urhomie.booking.persistence.entities.BookingLog;
import ro.urhomie.booking.persistence.utils.enums.BookingStatus;

public class BookingLogMapper {

    public static BookingLog bookingToLog(Booking booking) {
        return bookingToLog(booking, "Booking created");
    }

    public static BookingLog bookingToLog(Booking booking, String message) {
        return BookingLog.builder()
                .booking(booking)
                .newStatus(BookingStatus.PENDING)
                .message(message)
                .build();
    }
}
