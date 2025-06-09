package ro.urhomie.service_catalog.business.dtos.provided_service;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.*;

import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateProvidedServiceRequest {

    @Min(value = 1, message = "Provider ID must be a positive number")
    private long providerId;

    @NotBlank(message = "Category ID cannot be empty")
    private String categoryId;

    @NotBlank(message = "Title cannot be empty")
    private String title;

    @NotBlank(message = "Description cannot be empty")
    private String description;

    @NotNull(message = "Base price is required")
    @PositiveOrZero(message = "Base price must be zero or a positive number")
    private Double basePrice;

    @NotBlank(message = "Duration estimate cannot be empty")
    private String durationEstimate;

    @NotBlank(message = "City cannot be empty")
    private String city;

    @NotBlank(message = "Address cannot be empty")
    private String address;

    private Map<String, Object> details;
}
