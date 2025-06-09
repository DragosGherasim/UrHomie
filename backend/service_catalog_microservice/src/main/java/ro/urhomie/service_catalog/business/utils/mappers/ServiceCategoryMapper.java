package ro.urhomie.service_catalog.business.utils.mappers;

import org.springframework.stereotype.Component;
import ro.urhomie.service_catalog.business.dtos.service_category.ServiceCategoryDto;
import ro.urhomie.service_catalog.persistence.entities.ServiceCategory;

@Component
public class ServiceCategoryMapper {

    public ServiceCategoryDto toDto(ServiceCategory category) {
        return ServiceCategoryDto.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .imagePath(category.getImagePath())
                .build();
    }
}
