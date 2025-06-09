package ro.urhomie.service_catalog.security;

import org.springframework.stereotype.Service;

@Service("providerAccessChecker")
public class ServiceProviderAccessChecker {

    public boolean isOwnerServiceProvider(Long providerIdFromRequest, Object principal) {
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
}
