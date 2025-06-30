package ro.urhomie.booking.persistence.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "booking_details")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 100)
    private String lastName;

    @Column(name = "city", length = 100)
    private String city;

    @Column(name = "address")
    private String address;

    @Column(name = "phone_number", length = 30)
    private String phoneNumber;

    @Column(name = "scheduled_at", nullable = false)
    private LocalDateTime scheduledAt;

    @Column(name = "extra_details", columnDefinition = "TEXT")
    private String extraDetails;
}
