package ro.urhomie.booking.persistence.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ro.urhomie.booking.persistence.entities.BookingLog;

import java.util.Optional;

public interface BookingLogRepository extends JpaRepository<BookingLog, Long> {

    @Query("SELECT bl FROM BookingLog bl " +
            "WHERE bl.booking.id = :bookingId AND bl.newStatus = 'CANCELLED'")
    Optional<BookingLog> findBookingLogWithCancelledStatus(@Param("bookingId") Long bookingId);
}
