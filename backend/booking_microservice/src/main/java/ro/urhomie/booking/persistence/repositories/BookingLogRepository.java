package ro.urhomie.booking.persistence.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ro.urhomie.booking.persistence.entities.BookingLog;

public interface BookingLogRepository extends JpaRepository<BookingLog, Long> {
}
