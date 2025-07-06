package ro.urhomie.booking.presentation.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ro.urhomie.booking.business.dtos.booking_log.BookingLogDeclineMessageDto;
import ro.urhomie.booking.business.dtos.booking_log.BookingLogDto;
import ro.urhomie.booking.business.services.interfaces.BookingLogService;

import java.util.Optional;

@RestController
@RequestMapping("booking-service/booking-log")
@RequiredArgsConstructor
public class BookingLogController {

    private static final Logger logger = LoggerFactory.getLogger(BookingLogController.class);
    @Operation(
            summary = "Get decline message for a cancelled booking",
            description = "Returns the decline message and log ID for a cancelled booking"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved the decline message"),
            @ApiResponse(responseCode = "401", description = "Unauthorized - Authentication required"),
            @ApiResponse(responseCode = "403", description = "Forbidden - Access denied"),
            @ApiResponse(responseCode = "404", description = "No cancelled log found for the specified booking ID"),
    })
    @PreAuthorize("(hasAuthority('CLIENT') and @userAccessChecker.isOwnerAsClient(#bookingId, authentication.principal))" +
            " or (hasAuthority('SERVICE_PROVIDER') and @userAccessChecker.isOwnerAsProvider(#bookingId, authentication.principal))")
    @GetMapping("/{bookingId}/cancelled")
    public ResponseEntity<BookingLogDeclineMessageDto> getCancelledLog(@PathVariable Long bookingId) {
        logger.info("GET /booking-service/booking-log/{}/cancelled called", bookingId);

        Optional<BookingLogDto> bookingLogDtoOpt = bookingLogService.getBookingLogWithCancelledStatus(bookingId);

        if (bookingLogDtoOpt.isEmpty()) {
            logger.warn("No cancelled log found for booking ID {}", bookingId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        BookingLogDto logDto = bookingLogDtoOpt.get();

        BookingLogDeclineMessageDto responseDto = BookingLogDeclineMessageDto.builder()
                .id(logDto.getId())
                .declineMessage(logDto.getDeclineMessage())
                .build();

        logger.info("Successfully retrieved decline message for booking ID {}: {}", bookingId, responseDto.getDeclineMessage());
        return ResponseEntity.ok(responseDto);
    }

    private final BookingLogService bookingLogService;
}