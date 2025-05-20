namespace user_management_microservice.Infrastructure.Grpc.Protos;

public class GrpcAuthClient(UserAuthentication.UserAuthenticationClient client) : IGrpcAuthClient
{
    public async Task<ValidateJwtResponse> ValidateJwtAsync(string jwt)
    {
        var request = new ValidateJwtRequest { Jwt = jwt };
        return await client.ValidateJwtAsync(request);
    }
}