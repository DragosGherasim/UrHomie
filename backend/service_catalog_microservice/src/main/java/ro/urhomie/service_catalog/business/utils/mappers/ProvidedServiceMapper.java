package ro.urhomie.service_catalog.business.utils.mappers;

import org.springframework.stereotype.Component;
import ro.urhomie.service_catalog.business.dtos.provided_service.*;
import ro.urhomie.service_catalog.persistence.entities.ProvidedService;
import ro.urhomie.service_catalog.persistence.entities.ServiceCategory;

import java.util.List;
import java.util.Map;

@Component
public class ProvidedServiceMapper {

    public ProvidedService createDtoToEntity(CreateProvidedServiceDto dto) {
        return ProvidedService.builder()
                .providerId(dto.getProviderId())
                .categoryId(dto.getCategoryId())
                .title(dto.getTitle())
                .description(dto.getDescription())
                .basePrice(Double.parseDouble(dto.getBasePrice()))
                .durationEstimate(dto.getDurationEstimate())
                .city(dto.getCity())
                .address(dto.getAddress())
                .details(dto.getDetails())
                .build();
    }

    public ProvidedService dtoToEntity(ProvidedServiceDto dto) {
        return ProvidedService.builder()
                .id(dto.getId())
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

    public ProvidedServiceWhCategoryDto toWhCategoryDto(ProvidedService service, Map<String, ServiceCategory> categoryMap) {
        ServiceCategory category = categoryMap.get(service.getCategoryId());

        return ProvidedServiceWhCategoryDto.builder()
                .id(service.getId())
                .providerId(service.getProviderId())
                .categoryPreview(category != null
                        ? ServiceCategoryPreview.builder()
                                .name(category.getName())
                                .imagePath(category.getImagePath())
                                .build()
                        : null)
                .title(service.getTitle())
                .description(service.getDescription())
                .basePrice(service.getBasePrice())
                .durationEstimate(service.getDurationEstimate())
                .city(service.getCity())
                .address(service.getAddress())
                .details(service.getDetails())
                .build();
    }

    public ProvidedServiceSearchDto buildSearchDto(List<ProvidedService> services,
                                                   Map<String, ServiceCategory> categoryMap,
                                                   int page, int size, long totalCount) {

        List<ProvidedServiceWhCategoryDto> servicesWithCategory = services.stream()
                .map(service -> toWhCategoryDto(service, categoryMap))
                .toList();

        return ProvidedServiceSearchDto.builder()
                .services(servicesWithCategory)
                .page(page)
                .size(size)
                .totalElements(totalCount)
                .totalPages((int) Math.ceil((double) totalCount / size))
                .build();
    }
}