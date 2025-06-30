package ro.urhomie.booking.business.services;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ro.urhomie.booking.business.dtos.booking.BookingDto;
import ro.urhomie.booking.business.dtos.booking.BookingSearchDto;
import ro.urhomie.booking.business.dtos.booking.CreateBookingDto;
import ro.urhomie.booking.business.services.interfaces.BookingService;
import ro.urhomie.booking.business.utils.mappers.BookingMapper;
import ro.urhomie.booking.persistence.entities.Booking;
import ro.urhomie.booking.persistence.entities.BookingLog;
import ro.urhomie.booking.persistence.repositories.BookingLogRepository;
import ro.urhomie.booking.persistence.repositories.BookingRepository;
import ro.urhomie.booking.persistence.utils.enums.BookingStatus;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BookingServiceImp implements BookingService {

    protected final BookingRepository bookingRepo;
    private final BookingLogRepository bookingLogRepo;

    @Override
    public Optional<BookingDto> getBookingById(Long id) {
        return bookingRepo.findById(id).map(BookingMapper::entityToDto);
    }

    @Override
    public BookingSearchDto getBookingByClientId(Long clientId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);

        Page<Booking> resultPage = bookingRepo.findByClientId(clientId, pageable);

        return BookingMapper.buildSearchDto(resultPage.getContent(), page, size);
    }

    @Override
    public BookingSearchDto getBookingByProviderId(Long serviceProviderId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);

        Page<Booking> resultPage = bookingRepo.findByProviderId(serviceProviderId, pageable);

        return BookingMapper.buildSearchDto(resultPage.getContent(), page, size);
    }

    @Override
    @Transactional
    public BookingDto createBooking(CreateBookingDto createBookingDto) {
        Booking booking = BookingMapper.createDtoToEntity(createBookingDto);

        Booking created = bookingRepo.save(booking);

        BookingLog log = BookingLog.builder()
                .booking(created)
                .changedById(createBookingDto.getClientId())
                .newStatus(BookingStatus.PENDING)
                .build();

        bookingLogRepo.save(log);

        return BookingMapper.entityToDto(created);
    }

    @Override
    @Transactional
    public BookingDto confirmBooking(BookingDto bookingDto) {
        if (!bookingDto.getStatus().equals(BookingStatus.PENDING)) {
            throw new IllegalStateException("Only pending bookings can be confirmed");
        }

        BookingStatus oldStatus = bookingDto.getStatus();
        bookingDto.setStatus(BookingStatus.CONFIRMED);

        Booking updated = bookingRepo.save(BookingMapper.dtoToEntity(bookingDto));

        BookingLog log = BookingLog.builder()
                .booking(updated)
                .changedById(bookingDto.getProviderId())
                .oldStatus(oldStatus)
                .newStatus(BookingStatus.CONFIRMED)
                .build();

        bookingLogRepo.save(log);

        return BookingMapper.entityToDto(updated);
    }

    @Override
    @Transactional
    public BookingDto cancelBooking(BookingDto bookingDto, String message, String userRole) {
        if (bookingDto.getStatus() == BookingStatus.CANCELLED || bookingDto.getStatus() == BookingStatus.FINISHED) {
            throw new IllegalStateException("Cannot cancel a finished or already cancelled booking");
        }

        BookingStatus oldStatus = bookingDto.getStatus();
        bookingDto.setStatus(BookingStatus.CANCELLED);

        Booking updated = bookingRepo.save(BookingMapper.dtoToEntity(bookingDto));

        Long changedById = switch (userRole) {
            case "CLIENT" -> bookingDto.getClientId();
            case "SERVICE_PROVIDER" -> bookingDto.getProviderId();
            default -> null;
        };

        BookingLog log = BookingLog.builder()
                .booking(updated)
                .changedById(changedById)
                .oldStatus(oldStatus)
                .newStatus(BookingStatus.CANCELLED)
                .declineMessage(message)
                .build();

        bookingLogRepo.save(log);

        return BookingMapper.entityToDto(updated);
    }

    @Override
    @Transactional
    public BookingDto finishBooking(BookingDto bookingDto) {
        if (!bookingDto.getStatus().equals(BookingStatus.CONFIRMED)) {
            throw new IllegalStateException("Only confirmed bookings can be marked as finished");
        }

        BookingStatus oldStatus = bookingDto.getStatus();
        bookingDto.setStatus(BookingStatus.FINISHED);
        bookingDto.setFinishAt(LocalDateTime.now());

        Booking updated = bookingRepo.save(BookingMapper.dtoToEntity(bookingDto));

        BookingLog log = BookingLog.builder()
                .booking(updated)
                .changedById(bookingDto.getProviderId())
                .oldStatus(oldStatus)
                .newStatus(BookingStatus.FINISHED)
                .build();

        log.setOldStatus(oldStatus);
        log.setNewStatus(BookingStatus.FINISHED);

        bookingLogRepo.save(log);

        return BookingMapper.entityToDto(updated);
    }
}
