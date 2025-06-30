package ro.urhomie.booking.business.dtos.booking;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
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

    @NotBlank(message = "First name cannot be empty")
    private String firstName;

    @NotBlank(message = "Last name cannot be empty")
    private String lastName;

    @NotBlank(message = "City cannot be empty")
    private String city;

    @NotBlank(message = "Address cannot be empty")
    private String address;

    @NotBlank(message = "Phone number cannot be empty")
    @Pattern(regexp = "^\\+?[0-9]{10,15}$", message = "Phone number must be 10–15 digits and may start with '+'.")
    private String phoneNumber;

    @NotNull(message = "Scheduled date/time must not be null")
    @Future(message = "Scheduled time must be in the future")
    private LocalDateTime scheduledAt;

    private String extraDetails;
}

