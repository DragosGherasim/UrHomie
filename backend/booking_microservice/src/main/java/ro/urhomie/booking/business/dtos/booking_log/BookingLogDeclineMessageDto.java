package ro.urhomie.booking.business.dtos.booking_log;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingLogDeclineMessageDto {

    public long id;
    public String declineMessage;
}
