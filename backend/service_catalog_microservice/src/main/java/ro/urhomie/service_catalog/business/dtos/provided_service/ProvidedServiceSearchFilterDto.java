package ro.urhomie.service_catalog.business.dtos.provided_service;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProvidedServiceSearchFilterDto {

    private String query;

    @Min(0)
    @Builder.Default
    private int page = 0;

    @Min(1)
    @Max(10)
    @Builder.Default
    private int size = 10;
}
