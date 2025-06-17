package ro.urhomie.service_catalog.business.services.interfaces;

import ro.urhomie.service_catalog.business.dtos.provided_service.*;

import java.util.Optional;

public interface ProvidedServiceService {

    Optional<ProvidedServiceDto> getServiceById(String serviceId);
    ProvidedServiceSearchDto getServicesByProviderId(long providerId, int page, int size);
    ProvidedServiceSearchDto searchServices(ProvidedServiceSearchFilterDto filter);
    ProvidedServiceDto createService(CreateProvidedServiceDto request);
    ProvidedServiceDto applyPatch(ProvidedServiceDto existingDto, PatchProvidedServiceDto patchDto);
    void deleteById(String id);
}