package ro.urhomie.service_catalog.business.services.interfaces;

import ro.urhomie.service_catalog.business.dtos.service_category.ServiceCategoryDto;

import java.util.List;

public interface ServiceCategoryService {

    List<ServiceCategoryDto> getAll();
}
