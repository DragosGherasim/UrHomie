package ro.urhomie.service_catalog.business.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ro.urhomie.service_catalog.business.dtos.service_category.ServiceCategoryDto;
import ro.urhomie.service_catalog.business.utils.mappers.ServiceCategoryMapper;
import ro.urhomie.service_catalog.business.services.interfaces.ServiceCategoryService;
import ro.urhomie.service_catalog.persistence.repositories.ServiceCategoryRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ServiceCategoryServiceImpl implements ServiceCategoryService {

    private final ServiceCategoryRepository categoryRepo;
    private final ServiceCategoryMapper mapper;

    @Override
    public List<ServiceCategoryDto> getAll() {
        return categoryRepo.findAll()
                .stream()
                .map(mapper::toDto)
                .toList();
    }
}