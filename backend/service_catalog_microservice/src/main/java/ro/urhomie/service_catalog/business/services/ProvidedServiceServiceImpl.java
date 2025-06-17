package ro.urhomie.service_catalog.business.services;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.stereotype.Service;
import ro.urhomie.service_catalog.business.dtos.provided_service.*;
import ro.urhomie.service_catalog.business.utils.helpers.ProvidedServiceSearchHelper;
import ro.urhomie.service_catalog.business.utils.mappers.ProvidedServiceMapper;
import ro.urhomie.service_catalog.business.services.interfaces.ProvidedServiceService;
import ro.urhomie.service_catalog.business.utils.patching.Patchers;
import ro.urhomie.service_catalog.business.utils.validations.PatchValidator;
import ro.urhomie.service_catalog.persistence.entities.ProvidedService;
import ro.urhomie.service_catalog.persistence.entities.ServiceCategory;
import ro.urhomie.service_catalog.persistence.repositories.ProvidedServiceRepository;
import ro.urhomie.service_catalog.persistence.repositories.ServiceCategoryRepository;
import ro.urhomie.service_catalog.presentation.exceptions.InvalidReferenceException;
import ro.urhomie.service_catalog.presentation.exceptions.MultiValidationException;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProvidedServiceServiceImpl implements ProvidedServiceService {

    private final MongoTemplate mongoTemplate;

    private final ProvidedServiceRepository providedServiceRepo;
    private final ServiceCategoryRepository serviceCategoryRepo;

    private final ProvidedServiceMapper mapper;
    private final ProvidedServiceSearchHelper searchHelper;
    private final PatchValidator patchValidator;

    @Override
    public Optional<ProvidedServiceDto> getServiceById(String serviceId) {
        return providedServiceRepo.findById(serviceId).map(mapper::entityToDto);
    }

    @Override
    public ProvidedServiceSearchDto getServicesByProviderId(long providerId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ProvidedService> resultPage = providedServiceRepo.findByProviderId(providerId, pageable);

        List<String> categoryIds = resultPage.getContent().stream()
                .map(ProvidedService::getCategoryId)
                .distinct()
                .toList();

        Map<String, ServiceCategory> categoryMap = serviceCategoryRepo.findAllById(categoryIds).stream()
                .collect(Collectors.toMap(ServiceCategory::getId, category -> category));

        return mapper.buildSearchDto(resultPage.getContent(), categoryMap, page, size, resultPage.getTotalElements());
    }

    @Override
    public ProvidedServiceSearchDto searchServices(ProvidedServiceSearchFilterDto filter) {
        String query = filter.getQuery();
        int page = filter.getPage();
        int size = filter.getSize();

        List<ProvidedService> services;

        if (query == null || query.isBlank()) {
            Aggregation aggregation = Aggregation.newAggregation(
                    Aggregation.skip((long) page * size),
                    Aggregation.limit(size)
            );

            AggregationResults<ProvidedService> results = mongoTemplate.aggregate(aggregation, "services", ProvidedService.class);
            services = results.getMappedResults();
        } else {
            Aggregation aggregation = searchHelper.buildSearchAggregation(query, page, size);
            services = mongoTemplate.aggregate(aggregation, "services", ProvidedService.class).getMappedResults();
        }

        Aggregation countAgg = searchHelper.buildCountAggregation(query);
        long totalCount = mongoTemplate.aggregate(countAgg, "services", CountDocument.class)
                .getMappedResults()
                .stream()
                .findFirst()
                .map(CountDocument::getTotal)
                .orElse(0);

        List<String> categoryIds = services.stream()
                .map(ProvidedService::getCategoryId)
                .distinct()
                .toList();

        Map<String, ServiceCategory> categoryMap = serviceCategoryRepo.findAllById(categoryIds).stream()
                .collect(Collectors.toMap(ServiceCategory::getId, category -> category));

        return mapper.buildSearchDto(services, categoryMap, page, size, totalCount);
    }

    @Override
    public ProvidedServiceDto createService(CreateProvidedServiceDto dto) {
        String categoryId = dto.getCategoryId();

        if (!serviceCategoryRepo.existsById(categoryId)) {
            throw new InvalidReferenceException("Invalid categoryId: " + categoryId);
        }

        return mapper.entityToDto(providedServiceRepo.save(mapper.createDtoToEntity(dto)));
    }

    @Override
    public ProvidedServiceDto applyPatch(ProvidedServiceDto existingDto, PatchProvidedServiceDto patchDto) {
        Map<String, List<String>> errors = patchValidator.validate(patchDto);
        if (!errors.isEmpty()) {
            throw new MultiValidationException(errors);
        }

        if (patchDto.getCategoryId() != null &&
                !serviceCategoryRepo.existsById(patchDto.getCategoryId())) {
            throw new InvalidReferenceException("Invalid categoryId: " + patchDto.getCategoryId());
        }

        Patchers.patcherProvidedService(existingDto, patchDto);
        ProvidedService updated = mapper.dtoToEntity(existingDto);
        ProvidedService saved = providedServiceRepo.save(updated);

        return mapper.entityToDto(saved);
    }

    @Override
    public void deleteById(String id) {
        providedServiceRepo.deleteById(id);
    }

    @Setter
    @Getter
    private static class CountDocument {
        private int total;
    }
}