package ro.urhomie.booking.business.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CancelBookingDto {

    @NotBlank(message = "Cancellation message is required")
    private String message;
}
