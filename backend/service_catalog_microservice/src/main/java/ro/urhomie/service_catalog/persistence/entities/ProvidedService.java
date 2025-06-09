package ro.urhomie.service_catalog.persistence.entities;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Map;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "services")
public class ProvidedService {

    @Id
    private String id;

    private long providerId;
    private String categoryId;

    private String title;
    private String description;
    private Double basePrice;
    private String durationEstimate;
    private String city;
    private String address;

    private Map<String, Object> details;
}