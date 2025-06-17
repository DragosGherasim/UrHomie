package ro.urhomie.service_catalog.security;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ro.urhomie.service_catalog.persistence.entities.ProvidedService;
import ro.urhomie.service_catalog.persistence.repositories.ProvidedServiceRepository;

import java.util.Optional;

@Service("providerAccessChecker")
@RequiredArgsConstructor
public class ServiceProviderAccessChecker {

    private final ProvidedServiceRepository providedServiceRepo;

    public boolean isSameServiceProvider(Long providerIdFromRequest, Object principal) {
        if (principal instanceof String principalId) {
            try {
                long currentUserId = Long.parseLong(principalId);
                return currentUserId == providerIdFromRequest;
            } catch (NumberFormatException e) {
                return false;
            }
        }
        return false;
    }

    public boolean isOwnerOfService(String serviceId, Object principal) {
        if (principal instanceof String principalId) {
            try {
                long currentUserId = Long.parseLong(principalId);

                Optional<ProvidedService> serviceOpt = providedServiceRepo.findById(serviceId);
                return serviceOpt.map(s -> s.getProviderId() == currentUserId).orElse(false);
            } catch (NumberFormatException e) {
                return false;
            }
        }
        return false;
    }
}
