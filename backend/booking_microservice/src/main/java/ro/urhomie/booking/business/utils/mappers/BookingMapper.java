package ro.urhomie.booking.business.utils.mappers;

import ro.urhomie.booking.business.dtos.BookingDto;
import ro.urhomie.booking.business.dtos.BookingSearchDto;
import ro.urhomie.booking.business.dtos.CreateBookingDto;
import ro.urhomie.booking.persistence.entities.Booking;
import ro.urhomie.booking.persistence.utils.enums.BookingStatus;

import java.util.List;

public class BookingMapper {

    public static BookingDto entityToDto(Booking booking) {
        return BookingDto.builder()
                .id(booking.getId())
                .clientId(booking.getClientId())
                .providerId(booking.getProviderId())
                .serviceId(booking.getServiceId())
                .scheduledAt(booking.getScheduledAt())
                .finishAt(booking.getFinishAt())
                .status(booking.getStatus())
                .extraDetails(booking.getExtraDetails())
                .createdAt(booking.getCreatedAt())
                .updatedAt(booking.getUpdatedAt())
                .build();
    }

    public static Booking dtoToEntity(BookingDto bookingDto) {
        return Booking.builder()
                .id(bookingDto.getId())
                .clientId(bookingDto.getClientId())
                .providerId(bookingDto.getProviderId())
                .serviceId(bookingDto.getServiceId())
                .scheduledAt(bookingDto.getScheduledAt())
                .finishAt(bookingDto.getFinishAt())
                .status(bookingDto.getStatus())
                .extraDetails(bookingDto.getExtraDetails())
                .createdAt(bookingDto.getCreatedAt())
                .updatedAt(bookingDto.getUpdatedAt())
                .build();
    }

    public static Booking createDtoToEntity(CreateBookingDto createBookingDto) {
        return Booking.builder()
                .clientId(createBookingDto.getClientId())
                .providerId(createBookingDto.getProviderId())
                .serviceId(createBookingDto.getServiceId())
                .scheduledAt(createBookingDto.getScheduledAt())
                .status(BookingStatus.PENDING)
                .extraDetails(createBookingDto.getExtraDetails())
                .build();
    }

    public static BookingSearchDto buildSearchDto(List<Booking> bookings, int page, int size) {
        return BookingSearchDto.builder()
                .bookings(bookings.stream().map(BookingMapper::entityToDto).toList())
                .page(page)
                .size(size)
                .totalElements(bookings.size())
                .totalPages((int) Math.ceil((double) bookings.size() / size))
                .build();
    }
}
