package ro.urhomie.service_catalog.business.services.interfaces;

import ro.urhomie.service_catalog.business.dtos.provided_service.*;

public interface ProvidedServiceService {

    ProvidedServiceSearchDto getServicesByProviderId(long providerId, int page, int size);
    ProvidedServiceSearchDto searchServices(ProvidedServiceSearchFilterDto filter);
    ProvidedServiceDto createService(CreateProvidedServiceRequest request);
}