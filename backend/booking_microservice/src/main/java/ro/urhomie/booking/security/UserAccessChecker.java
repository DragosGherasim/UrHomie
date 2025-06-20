package ro.urhomie.booking.security;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ro.urhomie.booking.persistence.entities.Booking;
import ro.urhomie.booking.persistence.repositories.BookingRepository;

import java.util.Optional;

@Service("userAccessChecker")
@RequiredArgsConstructor
public class UserAccessChecker {

    private final BookingRepository bookingRepo;

    public boolean isSameClient(Long clientIdFromRequest, Object principal) {
        return matchPrincipalId(clientIdFromRequest, principal);
    }

    public boolean isSameProvider(Long providerIdFromRequest, Object principal) {
        return matchPrincipalId(providerIdFromRequest, principal);
    }

    private boolean matchPrincipalId(Long idFromRequest, Object principal) {
        if (principal instanceof String principalId) {
            try {
                long currentUserId = Long.parseLong(principalId);
                return currentUserId == idFromRequest;
            } catch (NumberFormatException e) {
                return false;
            }
        }
        return false;
    }

    public boolean isOwnerAsProvider(Long bookingId, Object principal) {
        if (principal instanceof String principalId) {
            try {
                long currentUserId = Long.parseLong(principalId);

                Optional<Booking> bookingOpt = bookingRepo.findById(bookingId);

                if (bookingOpt.isEmpty())
                    return true;

                return bookingOpt.map(b -> b.getProviderId() == currentUserId).orElse(false);
            } catch (NumberFormatException e) {
                return false;
            }
        }
        return false;
    }

    public boolean isOwnerAsClient(Long bookingId, Object principal) {
        if (principal instanceof String principalId) {
            try {
                long currentUserId = Long.parseLong(principalId);

                Optional<Booking> bookingOpt = bookingRepo.findById(bookingId);

                if (bookingOpt.isEmpty())
                    return true;

                return bookingOpt.map(b -> b.getClientId() == currentUserId).orElse(false);
            } catch (NumberFormatException e) {
                return false;
            }
        }
        return false;
    }
}
