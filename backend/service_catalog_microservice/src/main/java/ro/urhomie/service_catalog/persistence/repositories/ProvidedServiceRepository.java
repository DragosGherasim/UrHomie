package ro.urhomie.service_catalog.persistence.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import ro.urhomie.service_catalog.persistence.entities.ProvidedService;

public interface ProvidedServiceRepository extends MongoRepository<ProvidedService, String> {
    Page<ProvidedService> findByProviderId(long providerId, Pageable pageable);
}