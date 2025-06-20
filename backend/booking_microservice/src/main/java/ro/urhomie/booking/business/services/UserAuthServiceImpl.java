package ro.urhomie.booking.business.services;

import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import ro.urhomie.booking.business.services.grpc.UserAuthenticationGrpc;
import ro.urhomie.booking.business.services.grpc.ValidateJwtRequest;
import ro.urhomie.booking.business.services.grpc.ValidateJwtResponse;
import ro.urhomie.booking.business.services.interfaces.UserAuthService;

@Service
public class UserAuthServiceImpl implements UserAuthService {

    private final UserAuthenticationGrpc.UserAuthenticationBlockingStub userAuthBlockingStub;

    public UserAuthServiceImpl(
            @Value("${grpc.auth-server.host}") String host,
            @Value("${grpc.auth-server.port}") int port) {

        ManagedChannel channel = ManagedChannelBuilder.forAddress(host, port)
                .usePlaintext()
                .build();

        userAuthBlockingStub = UserAuthenticationGrpc.newBlockingStub(channel);
    }

    @Override
    public ValidateJwtResponse validateJwt(String token) {
        ValidateJwtRequest request = ValidateJwtRequest.newBuilder()
                .setJwt(token)
                .build();

        return userAuthBlockingStub.validateJwt(request);
    }
}
