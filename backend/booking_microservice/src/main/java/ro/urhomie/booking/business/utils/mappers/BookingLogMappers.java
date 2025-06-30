package ro.urhomie.booking.business.utils.mappers;

import ro.urhomie.booking.business.dtos.booking_log.BookingLogDto;
import ro.urhomie.booking.persistence.entities.BookingLog;

public class BookingLogMappers {

    public static BookingLogDto entityToDto(BookingLog log) {
        return BookingLogDto.builder()
                .id(log.getId())
                .bookingId(log.getBooking().getId())
                .changedById(log.getChangedById())
                .oldStatus(log.getOldStatus())
                .newStatus(log.getNewStatus())
                .declineMessage(log.getDeclineMessage())
                .build();
    }
}
