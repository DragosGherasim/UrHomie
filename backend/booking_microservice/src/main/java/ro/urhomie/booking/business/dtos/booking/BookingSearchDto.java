package ro.urhomie.booking.business.dtos.booking;

import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingSearchDto {
    private List<BookingDto> bookings;
    private int page;
    private int size;
    private long totalElements;
    private long totalPages;
}
