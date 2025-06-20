package ro.urhomie.booking.persistence.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import ro.urhomie.booking.persistence.entities.Booking;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    Page<Booking> findByClientId(Long clientId, Pageable pageable);
    Page<Booking> findByProviderId(Long serviceProviderId, Pageable pageable);
}
