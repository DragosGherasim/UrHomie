package ro.urhomie.service_catalog.business.dtos.provided_service;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import ro.urhomie.service_catalog.business.utils.validations.ValidDetails;
import ro.urhomie.service_catalog.business.utils.validations.ValidPrice;

import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateProvidedServiceDto {

    @Min(value = 1, message = "Provider ID must be a positive number")
    private long providerId;

    @NotBlank(message = "Category ID cannot be empty")
    private String categoryId;

    @NotBlank(message = "Title cannot be empty")
    private String title;

    @NotBlank(message = "Description cannot be empty")
    private String description;

    @NotBlank(message = "Base price must not be empty")
    @ValidPrice
    private String basePrice;

    @NotBlank(message = "Duration estimate cannot be empty")
    private String durationEstimate;

    @NotBlank(message = "City cannot be empty")
    private String city;

    @NotBlank(message = "Address cannot be empty")
    private String address;

    @ValidDetails
    private Map<String, Object> details;
}
