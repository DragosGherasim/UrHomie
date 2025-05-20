namespace user_management_microservice.Infrastructure.Grpc.Protos;

public interface IGrpcAuthClient
{
    Task<ValidateJwtResponse> ValidateJwtAsync(string jwt);
}