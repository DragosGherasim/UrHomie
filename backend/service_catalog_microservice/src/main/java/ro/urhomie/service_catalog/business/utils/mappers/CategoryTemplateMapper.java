package ro.urhomie.service_catalog.business.utils.mappers;

import org.springframework.stereotype.Component;
import ro.urhomie.service_catalog.business.dtos.category_template.CategoryTemplateDto;
import ro.urhomie.service_catalog.persistence.entities.CategoryTemplate;

@Component
public class CategoryTemplateMapper {

    public CategoryTemplateDto toDto(CategoryTemplate template) {
        return CategoryTemplateDto.builder()
                .id(template.getId())
                .categoryId(template.getCategoryId())
                .fields(template.getFields())
                .build();
    }
}
