package ro.urhomie.booking.presentation.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;
import ro.urhomie.booking.business.dtos.booking.BookingDto;
import ro.urhomie.booking.business.dtos.booking.BookingSearchDto;
import ro.urhomie.booking.business.dtos.booking.CancelBookingDto;
import ro.urhomie.booking.business.dtos.booking.CreateBookingDto;
import ro.urhomie.booking.business.services.interfaces.BookingService;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Optional;

@RestController
@RequestMapping("booking-service/booking")
@RequiredArgsConstructor
public class BookingController {

    private static final Logger logger = LoggerFactory.getLogger(BookingController.class);
    private final BookingService bookingService;

    @Operation(
            summary = "Get bookings by client ID",
            description = "Returns a paginated list of bookings made by a client"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved the list of bookings"),
            @ApiResponse(responseCode = "404", description = "No bookings found for the specified client ID")
    })
    @PreAuthorize("hasAuthority('CLIENT') and @userAccessChecker.isSameClient(#clientId, authentication.principal)")
    @GetMapping("/by-client/{id}")
    public ResponseEntity<BookingSearchDto> getBookingsByClientId(
            @PathVariable("id") Long clientId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        logger.info("GET /by-client/{} called with page={}, size={}", clientId, page, size);

        BookingSearchDto result = bookingService.getBookingByClientId(clientId, page, size);

        if (result.getBookings().isEmpty()) {
            logger.info("No bookings found for client ID {}", clientId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        logger.info("Successfully retrieved the list of bookings for client ID {}", clientId);
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    @Operation(
            summary = "Get bookings by service provider ID",
            description = "Returns a paginated list of bookings for a service provider"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved the list of bookings"),
            @ApiResponse(responseCode = "404", description = "No bookings found for the specified service provider ID")
    })
    @PreAuthorize("hasAuthority('SERVICE_PROVIDER') and @userAccessChecker.isSameProvider(#serviceProviderId, authentication.principal)")
    @GetMapping("/by-provider/{id}")
    public ResponseEntity<BookingSearchDto> getBookingsByProviderId(
            @PathVariable("id") Long serviceProviderId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        logger.info("GET /by-provider/{} called with page={}, size={}", serviceProviderId, page, size);

        BookingSearchDto result = bookingService.getBookingByProviderId(serviceProviderId, page, size);

        if (result.getBookings().isEmpty()) {
            logger.info("No bookings found for service provider ID {}", serviceProviderId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        logger.info("Successfully retrieved the list of bookings for service provider ID {}", serviceProviderId);
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    @Operation(
            summary = "Create a new booking",
            description = "Creates a booking for a specific service by a client, scheduled at a future time"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Boo2king successfully created"),
            @ApiResponse(responseCode = "400", description = "Invalid json syntax"),
            @ApiResponse(responseCode = "409", description = "Data integrity violation - possible constraint conflict"),
            @ApiResponse(responseCode = "415", description = "Unsupported media type"),
            @ApiResponse(responseCode = "422", description = "Validation error: invalid input data")
    })
    @PreAuthorize("hasAuthority('CLIENT') and @userAccessChecker.isSameClient(#createBookingDto.clientId, authentication.principal)")
    @PostMapping
    public ResponseEntity<BookingDto> createBooking(@Valid @RequestBody CreateBookingDto createBookingDto) {
        logger.info("POST /booking-service/booking called to create booking for client {} and service {}", createBookingDto.getClientId(), createBookingDto.getServiceId());

        BookingDto created = bookingService.createBooking(createBookingDto);
        logger.info("Booking created successfully with ID {} by client ID {} for provided service ID {}", created.getId(), createBookingDto.getClientId(), createBookingDto.getServiceId());

        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @Operation(
            summary = "Confirm a pending booking",
            description = "Allows the service provider to confirm a pending booking"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Booking confirmed successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid state for confirmation"),
            @ApiResponse(responseCode = "404", description = "Booking not found")
    })
    @PreAuthorize("hasAuthority('SERVICE_PROVIDER') and @userAccessChecker.isOwnerAsProvider(#id, authentication.principal)")
    @PatchMapping("/{id}/confirm")
    public ResponseEntity<BookingDto> confirmBookingById(@PathVariable Long id) {
        logger.info("PATCH /booking-service/booking/{}/confirm called", id);

        Optional<BookingDto> bookingDtoOpt = bookingService.getBookingById(id);

        if (bookingDtoOpt.isEmpty()) {
            logger.warn("Booking with ID {} not found. Cannot confirm.", id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        BookingDto bookingToConfirm = bookingDtoOpt.get();
        BookingDto confirmed = bookingService.confirmBooking(bookingToConfirm);

        logger.info("Booking with ID {} successfully confirmed. New status: {}", confirmed.getId(), confirmed.getStatus());
        return ResponseEntity.status(HttpStatus.OK).body(confirmed);
    }

    @Operation(
            summary = "Cancel a booking",
            description = "Allows client or service provider to cancel a booking with a message"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Booking cancelled successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid state for cancellation"),
            @ApiResponse(responseCode = "404", description = "Booking not found"),
            @ApiResponse(responseCode = "422", description = "Validation failed")
    })
    @PreAuthorize("(hasAuthority('CLIENT') and @userAccessChecker.isOwnerAsClient(#id, authentication.principal))" +
            " or (hasAuthority('SERVICE_PROVIDER') and @userAccessChecker.isOwnerAsProvider(#id, authentication.principal))")
    @PatchMapping("/{id}/cancel")
    public ResponseEntity<BookingDto> cancelBooking(
            @PathVariable Long id,
            @Valid @RequestBody CancelBookingDto cancelDto,
            Authentication authentication) {

        logger.info("PATCH /booking-service/booking/{}/cancel called with reason: {}", id, cancelDto.getMessage());

        Optional<BookingDto> bookingDtoOpt = bookingService.getBookingById(id);

        if (bookingDtoOpt.isEmpty()) {
            logger.warn("Booking with ID {} not found. Cannot cancel.", id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        String userRole = authentication.getAuthorities().stream()
                .findFirst()
                .map(GrantedAuthority::getAuthority)
                .orElseThrow(() -> new RuntimeException("Role not found"));



        BookingDto cancelled = bookingService.cancelBooking(bookingDtoOpt.get(), cancelDto.getMessage(), userRole);

        logger.info("Booking with ID {} successfully cancelled. Message: {}", cancelled.getId(), cancelDto.getMessage());
        return ResponseEntity.ok(cancelled);
    }

    @Operation(
            summary = "Mark a booking as finished",
            description = "Allows service provider to mark a booking as finished"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Booking marked as finished"),
            @ApiResponse(responseCode = "400", description = "Invalid state for finishing"),
            @ApiResponse(responseCode = "404", description = "Booking not found")
    })
    @PreAuthorize("hasAuthority('SERVICE_PROVIDER') and @userAccessChecker.isOwnerAsProvider(#id, authentication.principal)")
    @PatchMapping("/{id}/finish")
    public ResponseEntity<BookingDto> finishBooking(@PathVariable Long id) {
        logger.info("PATCH /booking-service/booking/{}/finish called", id);

        Optional<BookingDto> bookingDtoOpt = bookingService.getBookingById(id);

        if (bookingDtoOpt.isEmpty()) {
            logger.warn("Booking with ID {} not found. Cannot mark as finished.", id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        BookingDto finished = bookingService.finishBooking(bookingDtoOpt.get());

        logger.info("Booking with ID {} successfully marked as finished.", finished.getId());
        return ResponseEntity.ok(finished);
    }
}
