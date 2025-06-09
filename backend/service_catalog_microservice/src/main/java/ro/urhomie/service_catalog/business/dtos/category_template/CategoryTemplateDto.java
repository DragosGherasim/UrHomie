package ro.urhomie.service_catalog.business.dtos.category_template;

import lombok.*;
import ro.urhomie.service_catalog.persistence.entities.CategoryTemplate;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryTemplateDto {

    private String id;

    private String categoryId;

    private List<CategoryTemplate.TemplateField> fields;
}
