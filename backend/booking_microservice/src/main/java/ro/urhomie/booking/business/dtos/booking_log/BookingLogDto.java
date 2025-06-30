package ro.urhomie.booking.business.dtos.booking_log;

import lombok.*;
import ro.urhomie.booking.persistence.utils.enums.BookingStatus;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingLogDto {

    public long id;

    public long bookingId;
    public long changedById;

    public BookingStatus oldStatus;
    public BookingStatus newStatus;

    public String declineMessage;
}
