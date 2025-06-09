package ro.urhomie.service_catalog.business.services.interfaces;

import ro.urhomie.service_catalog.business.dtos.category_template.CategoryTemplateDto;

import java.util.Optional;

public interface CategoryTemplateService {

    Optional<CategoryTemplateDto> getTemplate(String categoryId);
}
