package ro.urhomie.service_catalog.presentation.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import ro.urhomie.service_catalog.business.dtos.provided_service.*;
import ro.urhomie.service_catalog.business.services.interfaces.ProvidedServiceService;

@RestController
@RequestMapping("service-catalog/services")
@RequiredArgsConstructor
public class ProvidedServiceController {

    private static final Logger logger = LoggerFactory.getLogger(ProvidedServiceController.class);

    private final ProvidedServiceService providedServiceService;

    @Operation(
            summary = "Get services by provider ID",
            description = "Returns a paginated list of services registered by a specific provider"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved the list of services"),
            @ApiResponse(responseCode = "404", description = "No services found for the specified provider ID"),
            @ApiResponse(responseCode = "422", description = "Validation error: invalid provider ID or pagination parameters")
    })
    @GetMapping("/by-provider/{id}")
    public ResponseEntity<ProvidedServiceSearchDto> getServicesByProviderId(
            @PathVariable("id") long providerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        logger.info("GET /by-provider/{} called with page={}, size={}", providerId, page, size);

        try {
            ProvidedServiceSearchDto response = providedServiceService.getServicesByProviderId(providerId, page, size);

            if (response.getServices().isEmpty()) {
                logger.warn("No services found for provider ID {}", providerId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }

            logger.info("Successfully retrieved {} services for provider ID {}", response.getServices().size(), providerId);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Error retrieving services for provider ID {}: {}", providerId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Operation(summary = "Search services",
            description = "Search for services by title, description, location, or category")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved matching services"),
            @ApiResponse(responseCode = "404", description = "No matching services found for the given criteria"),
            @ApiResponse(responseCode = "422", description = "Validation error: invalid search criteria or pagination inputs")
    })
    @GetMapping
    public ResponseEntity<ProvidedServiceSearchDto> searchServices(
            @Valid @ModelAttribute ProvidedServiceSearchFilterDto filter) {

        logger.info("GET /service-catalog/services search called with filter: {}", filter);

        try {
            ProvidedServiceSearchDto response = providedServiceService.searchServices(filter);

            if (response.getServices().isEmpty()) {
                logger.warn("No matching services found for filter: {}", filter);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }

            logger.info("Search returned {} results", response.getServices().size());
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Error searching services: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Operation(
            summary = "Register a new service in the catalog",
            description = "Creates and registers a new service offering with the specified category, " +
                    "pricing, and configuration details. The service becomes immediately available for discovery and booking."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Service successfully registered and added to the catalog"),
            @ApiResponse(responseCode = "400", description = "Malformed request body or invalid JSON structure"),
            @ApiResponse(responseCode = "415", description = "Content-Type must be application/json"),
            @ApiResponse(responseCode = "422", description = "Business validation failed - check required fields, category existence, or pricing constraints")
    })
    @PreAuthorize("hasAuthority('SERVICE_PROVIDER') and @providerAccessChecker.isOwnerServiceProvider(#request.providerId, authentication.principal)")
    @PostMapping
    public ResponseEntity<ProvidedServiceDto> createService(
            @Valid @RequestBody CreateProvidedServiceRequest request) {

        var auth = SecurityContextHolder.getContext().getAuthentication();
        String principal = auth.getPrincipal().toString();

        logger.info("POST /service-catalog/services received from principal {} for provider ID {}", principal, request.getProviderId());

        try {
            ProvidedServiceDto created = providedServiceService.createService(request);

            logger.info("Service created successfully with ID {} by provider {}", created.getId(), request.getProviderId());
            return ResponseEntity.status(HttpStatus.CREATED).body(created);

        } catch (Exception e) {
            logger.error("Error creating service for provider ID {}: {}", request.getProviderId(), e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}