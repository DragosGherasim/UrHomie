package ro.urhomie.booking.business.dtos.booking;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingMoreDetailsDto {

    private Long id;

    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    LocalDateTime finishAt;
    String extraDetails;
    String declineMessage;
}
