package ro.urhomie.booking.business.services.interfaces;

import ro.urhomie.booking.business.services.grpc.ValidateJwtResponse;

public interface UserAuthService {
    ValidateJwtResponse validateJwt(String token);
}
