package ro.urhomie.service_catalog.business.dtos.provided_service;

import lombok.*;
import ro.urhomie.service_catalog.business.utils.validations.PatchableDto;

import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PatchProvidedServiceDto implements PatchableDto {

    private Long providerId;

    private String categoryId;

    private String title;

    private String description;

    private String basePrice;

    private String durationEstimate;

    private String city;

    private String address;

    private Map<String, Object> details;
}