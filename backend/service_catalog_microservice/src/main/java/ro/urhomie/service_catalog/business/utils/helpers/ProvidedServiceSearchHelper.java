package ro.urhomie.service_catalog.business.utils.helpers;

import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class ProvidedServiceSearchHelper {

    public Aggregation buildSearchAggregation(String query, int page, int size) {
        return Aggregation.newAggregation(
                Aggregation.lookup("service_categories", "categoryId", "_id", "category"),
                Aggregation.unwind("category"),
                Aggregation.match(buildSearchCriteria(query)),
                Aggregation.skip((long) page * size),
                Aggregation.limit(size)
        );
    }

    public Aggregation buildCountAggregation(String query) {
        return Aggregation.newAggregation(
                Aggregation.lookup("service_categories", "categoryId", "_id", "category"),
                Aggregation.unwind("category"),
                Aggregation.match(buildSearchCriteria(query)),
                Aggregation.count().as("total")
        );
    }

    private Criteria buildSearchCriteria(String query) {
        String[] tokens = query.trim().split("\\s+");
        List<Criteria> andCriteria = new ArrayList<>();

        for (String token : tokens) {
            String pattern = ".*" + token + ".*";
            List<Criteria> orCriteria = List.of(
                    Criteria.where("title").regex(pattern, "i"),
                    Criteria.where("description").regex(pattern, "i"),
                    Criteria.where("city").regex(pattern, "i"),
                    Criteria.where("address").regex(pattern, "i"),
                    Criteria.where("category.name").regex(pattern, "i")
            );
            andCriteria.add(new Criteria().orOperator(orCriteria));
        }

        return new Criteria().andOperator(andCriteria);
    }
}