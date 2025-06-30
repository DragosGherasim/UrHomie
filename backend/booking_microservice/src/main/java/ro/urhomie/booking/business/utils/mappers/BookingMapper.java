package ro.urhomie.booking.business.utils.mappers;

import ro.urhomie.booking.business.dtos.booking.BookingDto;
import ro.urhomie.booking.business.dtos.booking.BookingSearchDto;
import ro.urhomie.booking.business.dtos.booking.CreateBookingDto;
import ro.urhomie.booking.persistence.entities.Booking;
import ro.urhomie.booking.persistence.entities.BookingDetails;
import ro.urhomie.booking.persistence.utils.enums.BookingStatus;

import java.util.List;

public class BookingMapper {

    public static BookingDto entityToDto(Booking booking) {
        BookingDetails details = booking.getBookingDetails();

        return BookingDto.builder()
                .id(booking.getId())
                .clientId(booking.getClientId())
                .providerId(booking.getProviderId())
                .serviceId(booking.getServiceId())
                .status(booking.getStatus())
                .finishAt(booking.getFinishAt())
                .createdAt(booking.getCreatedAt())
                .updatedAt(booking.getUpdatedAt())

                .firstName(details != null ? details.getFirstName() : null)
                .lastName(details != null ? details.getLastName() : null)
                .city(details != null ? details.getCity() : null)
                .address(details != null ? details.getAddress() : null)
                .phoneNumber(details != null ? details.getPhoneNumber() : null)
                .scheduledAt(details != null ? details.getScheduledAt() : null)
                .extraDetails(details != null ? details.getExtraDetails() : null)
                .build();
    }

    public static Booking dtoToEntity(BookingDto dto) {
        Booking booking = Booking.builder()
                .id(dto.getId())
                .clientId(dto.getClientId())
                .providerId(dto.getProviderId())
                .serviceId(dto.getServiceId())
                .status(dto.getStatus())
                .finishAt(dto.getFinishAt())
                .createdAt(dto.getCreatedAt())
                .updatedAt(dto.getUpdatedAt())
                .build();

        BookingDetails details = BookingDetails.builder()
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .city(dto.getCity())
                .address(dto.getAddress())
                .phoneNumber(dto.getPhoneNumber())
                .scheduledAt(dto.getScheduledAt())
                .extraDetails(dto.getExtraDetails())
                .build();

        booking.setBookingDetails(details);
        return booking;
    }

    public static Booking createDtoToEntity(CreateBookingDto dto) {
        Booking booking = Booking.builder()
                .clientId(dto.getClientId())
                .providerId(dto.getProviderId())
                .serviceId(dto.getServiceId())
                .status(BookingStatus.PENDING)
                .build();

        BookingDetails details = BookingDetails.builder()
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .city(dto.getCity())
                .address(dto.getAddress())
                .phoneNumber(dto.getPhoneNumber())
                .scheduledAt(dto.getScheduledAt())
                .extraDetails(dto.getExtraDetails())
                .build();

        booking.setBookingDetails(details);
        return booking;
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
