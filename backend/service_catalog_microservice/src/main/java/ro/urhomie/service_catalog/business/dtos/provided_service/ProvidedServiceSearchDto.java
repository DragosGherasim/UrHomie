package ro.urhomie.service_catalog.business.dtos.provided_service;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProvidedServiceSearchDto {
    private List<ProvidedServiceDto> services;
    private int page;
    private int size;
    private long totalElements;
    private long totalPages;
}
