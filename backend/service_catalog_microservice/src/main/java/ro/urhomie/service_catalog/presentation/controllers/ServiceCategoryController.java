package ro.urhomie.service_catalog.presentation.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ro.urhomie.service_catalog.business.dtos.service_category.ServiceCategoryDto;
import ro.urhomie.service_catalog.business.services.interfaces.ServiceCategoryService;

import java.util.List;

@RestController
@RequestMapping("service-catalog/service-categories")
@RequiredArgsConstructor
public class ServiceCategoryController {

    private static final Logger logger = LoggerFactory.getLogger(ServiceCategoryController.class);
    private final ServiceCategoryService categoryService;

    @Operation(
            summary = "Browse available service categories",
            description = "Retrieves all service categories available in the catalog for classification and filtering purposes"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "List of service categories with names and details returned successfully")
    })
    @GetMapping
    public ResponseEntity<List<ServiceCategoryDto>> getAllCategories() {
        logger.info("GET /service-catalog/service-categories called to retrieve all categories");

        List<ServiceCategoryDto> categories = categoryService.getAll();
        logger.info("Successfully retrieved {} service categories", categories.size());

        return ResponseEntity.ok(categories);
    }
}