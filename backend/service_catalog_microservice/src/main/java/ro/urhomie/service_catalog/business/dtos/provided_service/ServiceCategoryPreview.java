package ro.urhomie.service_catalog.business.dtos.provided_service;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceCategoryPreview {
    private String name;
    private String imagePath;
}
