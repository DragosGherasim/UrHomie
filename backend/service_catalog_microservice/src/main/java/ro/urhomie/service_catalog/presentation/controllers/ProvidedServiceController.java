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

import java.util.Optional;

@RestController
@RequestMapping("service-catalog/services")
@RequiredArgsConstructor
public class ProvidedServiceController {

    private static final Logger logger = LoggerFactory.getLogger(ProvidedServiceController.class);

    private final ProvidedServiceService providedServiceService;

    @Operation(
            summary = "Get service by ID",
            description = "Retrieves detailed information about a specific service using its unique identifier"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Service found and returned successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid service ID format"),
            @ApiResponse(responseCode = "401", description = "Unauthorized - Authentication required"),
            @ApiResponse(responseCode = "404", description = "No service found with the specified ID")
    })
    @GetMapping("{id}")
    public ResponseEntity<ProvidedServiceDto> getServiceById(@PathVariable String id) {
        logger.info("GET /{} called - retrieving service by ID", id);

        if (id == null || id.trim().isEmpty()) {
            logger.warn("GET /{} failed: Invalid service ID - ID is null or empty", id);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        Optional<ProvidedServiceDto> serviceOpt = providedServiceService.getServiceById(id);
        if (serviceOpt.isEmpty()) {
            logger.warn("GET /{} failed: No service found for ID", id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        logger.info("GET /{} succeeded: Service found and returned successfully", id);
        return ResponseEntity.ok(serviceOpt.get());
    }

    @Operation(
            summary = "Get services by provider ID",
            description = "Returns a paginated list of services registered by a specific provider"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved the list of services"),
            @ApiResponse(responseCode = "401", description = "Unauthorized - Authentication required"),
            @ApiResponse(responseCode = "404", description = "No services found for the specified provider ID")
    })
    @GetMapping("/by-provider/{id}")
    public ResponseEntity<ProvidedServiceSearchDto> getServicesByProviderId(
            @PathVariable("id") long providerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        logger.info("GET /by-provider/{} called with page={}, size={}", providerId, page, size);

        ProvidedServiceSearchDto response = providedServiceService.getServicesByProviderId(providerId, page, size);
        if (response.getServices().isEmpty()) {
            logger.warn("No services found for provider ID {}", providerId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        logger.info("Successfully retrieved {} services for provider ID {}", response.getServices().size(), providerId);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Search services",
            description = "Search for services by title, description, location, or category")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved matching services"),
            @ApiResponse(responseCode = "401", description = "Unauthorized - Authentication required"),
            @ApiResponse(responseCode = "404", description = "No matching services found for the given criteria")
    })
    @GetMapping
    public ResponseEntity<ProvidedServiceSearchDto> searchServices(
            @Valid @ModelAttribute ProvidedServiceSearchFilterDto filter) {

        logger.info("GET /service-catalog/services search called with filter: {}", filter);

        ProvidedServiceSearchDto response = providedServiceService.searchServices(filter);
        if (response.getServices().isEmpty()) {
            logger.warn("No matching services found for filter: {}", filter);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        logger.info("Search returned {} results", response.getServices().size());
        return ResponseEntity.ok(response);
    }

    @Operation(
            summary = "Register a new service in the catalog",
            description = "Creates and registers a new service offering with the specified category, " +
                    "pricing, and configuration details. The service becomes immediately available for discovery and booking."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Service successfully registered and added to the catalog"),
            @ApiResponse(responseCode = "401", description = "Unauthorized - Authentication required"),
            @ApiResponse(responseCode = "403", description = "Forbidden - Access denied"),
    })
    @PreAuthorize("hasAuthority('SERVICE_PROVIDER') and @providerAccessChecker.isSameServiceProvider(#createServiceDto.providerId, authentication.principal)")
    @PostMapping
    public ResponseEntity<ProvidedServiceDto> createService(
            @Valid @RequestBody CreateProvidedServiceDto createServiceDto) {

        var auth = SecurityContextHolder.getContext().getAuthentication();
        String principal = auth.getPrincipal().toString();

        logger.info("POST /service-catalog/services received from principal {} for provider ID {}", principal, createServiceDto.getProviderId());

        ProvidedServiceDto created = providedServiceService.createService(createServiceDto);
        logger.info("Service created successfully with ID {} by provider {}", created.getId(), createServiceDto.getProviderId());

        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @Operation(
            summary = "Patch (partial update) an existing service",
            description = "Applies a partial update to a provided service. Only fields included in the request body will be updated. "
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Service successfully updated"),
            @ApiResponse(responseCode = "400", description = "Invalid or missing service ID"),
            @ApiResponse(responseCode = "401", description = "Unauthorized - Authentication required"),
            @ApiResponse(responseCode = "403", description = "Forbidden - Access denied"),
            @ApiResponse(responseCode = "404", description = "No service found with the specified ID"),
            @ApiResponse(responseCode = "422", description = "Business validation failed")
    })
    @PreAuthorize("hasAuthority('SERVICE_PROVIDER') and @providerAccessChecker.isOwnerOfService(#id, authentication.principal)")
    @PatchMapping("{id}")
    public ResponseEntity<ProvidedServiceDto> patchProvidedServiceById(
            @PathVariable String id,
            @RequestBody PatchProvidedServiceDto patchServiceDto) {

        logger.info("PATCH /{} called - patching service", id);

        if (id == null || id.trim().isEmpty()) {
            logger.warn("PATCH /{} failed: ID is null or empty", id);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        Optional<ProvidedServiceDto> existingOpt = providedServiceService.getServiceById(id);
        if (existingOpt.isEmpty()) {
            logger.warn("PATCH /{} failed: No service found for ID", id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        ProvidedServiceDto updatedService = providedServiceService.applyPatch(existingOpt.get(), patchServiceDto);
        logger.info("PATCH /{} succeeded", id);

        return ResponseEntity.status(HttpStatus.OK).body(updatedService);
    }

    @Operation(
            summary = "Delete a service by ID",
            description = "Deletes a provided service from the catalog using its unique identifier. This action is irreversible."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Service successfully deleted"),
            @ApiResponse(responseCode = "400", description = "Invalid or missing service ID"),
            @ApiResponse(responseCode = "401", description = "Unauthorized - Authentication required"),
            @ApiResponse(responseCode = "403", description = "Forbidden - Access denied"),
            @ApiResponse(responseCode = "404", description = "No service found with the specified ID")
    })
    @PreAuthorize("hasAuthority('SERVICE_PROVIDER') and @providerAccessChecker.isOwnerOfService(#id, authentication.principal)")
    @DeleteMapping("{id}")
    public ResponseEntity<Void> deleteServiceById(@PathVariable String id) {
        logger.info("DELETE /{} called - attempting to delete service", id);

        if (id == null || id.trim().isEmpty()) {
            logger.warn("DELETE /{} failed: ID is null or empty", id);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        Optional<ProvidedServiceDto> existingOpt = providedServiceService.getServiceById(id);
        if (existingOpt.isEmpty()) {
            logger.warn("DELETE /{} failed: No service found for ID", id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        providedServiceService.deleteById(id);
        logger.info("DELETE /{} succeeded - service deleted", id);

        return ResponseEntity.noContent().build();
    }
}