package ro.urhomie.service_catalog.business.dtos.service_category;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceCategoryDto {
    private String id;
    private String name;
    private String description;
    private String imagePath;
}