package ro.urhomie.booking.business.dtos;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateBookingDto {

    @NotNull(message = "Client ID must not be null")
    private Long clientId;

    @NotNull(message = "Provider ID must not be null")
    private Long providerId;

    @NotNull(message = "Service ID must not be null")
    private String serviceId;

    @NotNull(message = "Scheduled date/time must not be null")
    @Future(message = "Scheduled time must be in the future")
    private LocalDateTime scheduledAt;

    private String extraDetails;
}
