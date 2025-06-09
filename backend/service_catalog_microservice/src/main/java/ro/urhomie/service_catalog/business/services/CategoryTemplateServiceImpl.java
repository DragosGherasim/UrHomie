package ro.urhomie.service_catalog.business.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ro.urhomie.service_catalog.business.dtos.category_template.CategoryTemplateDto;
import ro.urhomie.service_catalog.business.utils.mappers.CategoryTemplateMapper;
import ro.urhomie.service_catalog.business.services.interfaces.CategoryTemplateService;
import ro.urhomie.service_catalog.persistence.repositories.CategoryTemplateRepository;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CategoryTemplateServiceImpl implements CategoryTemplateService {

    private final CategoryTemplateRepository templateRepo;
    private final CategoryTemplateMapper mapper;

    @Override
    public Optional<CategoryTemplateDto> getTemplate(String categoryId) {
        return templateRepo.findByCategoryId(categoryId)
                .map(mapper::toDto);
    }
}