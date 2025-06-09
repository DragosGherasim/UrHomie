package ro.urhomie.service_catalog.persistence.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import ro.urhomie.service_catalog.persistence.entities.CategoryTemplate;

import java.util.Optional;

public interface CategoryTemplateRepository extends MongoRepository<CategoryTemplate, String> {

    Optional<CategoryTemplate> findByCategoryId(String categoryId);
}
