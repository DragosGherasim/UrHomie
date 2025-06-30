package ro.urhomie.booking.business.dtos.booking;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import ro.urhomie.booking.persistence.utils.enums.BookingStatus;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingDto {

    private Long id;
    private Long clientId;
    private Long providerId;

    private String serviceId;

    private String firstName;
    private String lastName;
    private String city;
    private String address;
    private String phoneNumber;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime scheduledAt;

    private String extraDetails;

    private BookingStatus status;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime updatedAt;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime finishAt;
}