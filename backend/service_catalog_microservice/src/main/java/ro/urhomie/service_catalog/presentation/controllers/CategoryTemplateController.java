package ro.urhomie.service_catalog.presentation.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import ro.urhomie.service_catalog.business.dtos.category_template.CategoryTemplateDto;
import ro.urhomie.service_catalog.business.services.interfaces.CategoryTemplateService;

import java.util.Optional;

@Validated
@RestController
@RequestMapping("service-catalog/category-templates")
@RequiredArgsConstructor
public class CategoryTemplateController {

    private static final Logger logger = LoggerFactory.getLogger(CategoryTemplateController.class);
    private final CategoryTemplateService templateService;

    @Operation(
            summary = "Get category template by category ID",
            description = "Retrieves the category template configuration for a specific service category"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Category template found and returned successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid category ID format"),
            @ApiResponse(responseCode = "401", description = "Unauthorized - Authentication required"),
            @ApiResponse(responseCode = "404", description = "No template found for the specified category ID")
    })
    @GetMapping("/{categoryId}")
    public ResponseEntity<CategoryTemplateDto> getTemplateByCategoryId(
            @Parameter(description = "The unique identifier of the service category", required = true)
            @PathVariable
            @NotBlank(message = "Category ID cannot be blank")
            String categoryId) {

        logger.info("GET request received for category template with ID {}", categoryId);

        Optional<CategoryTemplateDto> templateOpt = templateService.getTemplate(categoryId);

        if (templateOpt.isEmpty()) {
            logger.warn("GET failed: No template found for category ID {}", categoryId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        logger.info("GET succeeded: Template for category ID {} retrieved successfully", categoryId);
        return ResponseEntity.ok(templateOpt.get());
    }
}