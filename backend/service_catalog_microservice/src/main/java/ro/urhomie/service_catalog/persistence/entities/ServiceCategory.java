package ro.urhomie.service_catalog.persistence.entities;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "service_categories")
public class ServiceCategory {

    @Id
    private String id;

    private String name;
    private String description;

    private String imagePath;
}
