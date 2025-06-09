package ro.urhomie.service_catalog.persistence.entities;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "category_templates")
public class CategoryTemplate {

    @Id
    private String id;

    private String categoryId;

    private List<TemplateField> fields;

    @Getter
    @Setter
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class TemplateField {
        private String name;
        private String label;
        private String type; // e.g., "text", "select", "checkbox", etc.
        private List<String> options; // nullable if type doesn't require options
    }
}
