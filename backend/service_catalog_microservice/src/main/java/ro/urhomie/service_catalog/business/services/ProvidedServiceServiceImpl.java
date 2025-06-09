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
import ro.urhomie.service_catalog.persistence.entities.ProvidedService;
import ro.urhomie.service_catalog.persistence.repositories.ProvidedServiceRepository;
import ro.urhomie.service_catalog.persistence.repositories.ServiceCategoryRepository;
import ro.urhomie.service_catalog.presentation.exceptions.InvalidReferenceException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProvidedServiceServiceImpl implements ProvidedServiceService {

    private final MongoTemplate mongoTemplate;

    private final ProvidedServiceRepository providedServiceRepo;
    private final ServiceCategoryRepository serviceCategoryRepo;

    private final ProvidedServiceMapper mapper;
    private final ProvidedServiceSearchHelper searchHelper;

    @Override
    public ProvidedServiceSearchDto getServicesByProviderId(long providerId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ProvidedService> resultPage = providedServiceRepo.findByProviderId(providerId, pageable);

        return mapper.buildSearchDto(resultPage.getContent(), page, size, resultPage.getTotalElements());
    }


    @Override
    public ProvidedServiceSearchDto searchServices(ProvidedServiceSearchFilterDto filter) {
        String query = filter.getQuery();
        int page = filter.getPage();
        int size = filter.getSize();

        Aggregation aggregation;
        List<ProvidedService> services;

        if (query == null || query.trim().isEmpty()) {
            aggregation = Aggregation.newAggregation(
                    Aggregation.skip((long) page * size),
                    Aggregation.limit(size)
            );

            AggregationResults<ProvidedService> results = mongoTemplate.aggregate(aggregation, "services", ProvidedService.class);
            services = results.getMappedResults();

            long totalCount = providedServiceRepo.count();

            return mapper.buildSearchDto(services, page, size, totalCount);
        }

        aggregation = searchHelper.buildSearchAggregation(query, page, size);
        services = mongoTemplate.aggregate(aggregation, "services", ProvidedService.class).getMappedResults();

        Aggregation countAgg = searchHelper.buildCountAggregation(query);
        long count = mongoTemplate.aggregate(countAgg, "services", CountDocument.class)
                .getMappedResults()
                .stream()
                .findFirst()
                .map(CountDocument::getTotal)
                .orElse(0);

        return mapper.buildSearchDto(services, page, size, count);
    }

    @Override
    public ProvidedServiceDto createService(CreateProvidedServiceRequest dto) {
        String categoryId = dto.getCategoryId();

        if (!serviceCategoryRepo.existsById(categoryId)) {
            throw new InvalidReferenceException("Invalid categoryId: " + categoryId);
        }

        return mapper.entityToDto(providedServiceRepo.save(mapper.createDtoToEntity(dto)));
    }

    @Setter
    @Getter
    private static class CountDocument {
        private int total;
    }
}