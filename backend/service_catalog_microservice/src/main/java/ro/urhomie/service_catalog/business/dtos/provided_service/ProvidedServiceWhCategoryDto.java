package ro.urhomie.service_catalog.business.dtos.provided_service;

import lombok.*;

import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProvidedServiceWhCategoryDto {

    private String id;

    private long providerId;

    private ServiceCategoryPreview categoryPreview;

    private String title;
    private String description;
    private Double basePrice;
    private String durationEstimate;

    private String city;
    private String address;

    private Map<String, Object> details;
}


