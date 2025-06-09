package ro.urhomie.service_catalog.persistence.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import ro.urhomie.service_catalog.persistence.entities.ServiceCategory;

public interface ServiceCategoryRepository extends MongoRepository<ServiceCategory, String> {
}
