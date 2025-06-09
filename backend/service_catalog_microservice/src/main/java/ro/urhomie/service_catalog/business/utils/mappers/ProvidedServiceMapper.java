package ro.urhomie.service_catalog.business.utils.mappers;

import org.springframework.stereotype.Component;
import ro.urhomie.service_catalog.business.dtos.provided_service.CreateProvidedServiceRequest;
import ro.urhomie.service_catalog.business.dtos.provided_service.ProvidedServiceDto;
import ro.urhomie.service_catalog.business.dtos.provided_service.ProvidedServiceSearchDto;
import ro.urhomie.service_catalog.persistence.entities.ProvidedService;

import java.util.List;

@Component
public class ProvidedServiceMapper {

    public ProvidedService createDtoToEntity(CreateProvidedServiceRequest dto) {
        return ProvidedService.builder()
                .providerId(dto.getProviderId())
                .categoryId(dto.getCategoryId())
                .title(dto.getTitle())
                .description(dto.getDescription())
                .basePrice(dto.getBasePrice())
                .durationEstimate(dto.getDurationEstimate())
                .city(dto.getCity())
                .address(dto.getAddress())
                .details(dto.getDetails())
                .build();
    }

    public ProvidedServiceDto entityToDto(ProvidedService service) {
        return ProvidedServiceDto.builder()
                .id(service.getId())
                .providerId(service.getProviderId())
                .categoryId(service.getCategoryId())
                .title(service.getTitle())
                .description(service.getDescription())
                .basePrice(service.getBasePrice())
                .durationEstimate(service.getDurationEstimate())
                .city(service.getCity())
                .address(service.getAddress())
                .details(service.getDetails())
                .build();
    }

    public ProvidedServiceSearchDto buildSearchDto(List<ProvidedService> services, int page, int size, long totalCount) {
        return ProvidedServiceSearchDto.builder()
                .services(services.stream().map(this::entityToDto).toList())
                .page(page)
                .size(size)
                .totalElements(totalCount)
                .totalPages((totalCount + size - 1) / size)
                .build();
    }
}
