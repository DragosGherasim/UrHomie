package ro.urhomie.booking.business.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ro.urhomie.booking.business.dtos.booking_log.BookingLogDto;
import ro.urhomie.booking.business.services.interfaces.BookingLogService;
import ro.urhomie.booking.business.utils.mappers.BookingLogMappers;
import ro.urhomie.booking.persistence.repositories.BookingLogRepository;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BookingLogServiceImpl implements BookingLogService {

    private final BookingLogRepository bookingLogRepo;

    @Override
    public Optional<BookingLogDto> getBookingLogWithCancelledStatus(Long bookingId) {
        return bookingLogRepo.findBookingLogWithCancelledStatus(bookingId)
                .map(BookingLogMappers::entityToDto);
    }
}
