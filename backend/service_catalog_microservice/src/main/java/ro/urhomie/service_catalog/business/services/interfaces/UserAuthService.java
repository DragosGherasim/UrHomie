package ro.urhomie.service_catalog.business.services.interfaces;

import ro.urhomie.service_catalog.business.services.grpc.ValidateJwtResponse;

public interface UserAuthService {

    ValidateJwtResponse validateJwt(String token);
}
