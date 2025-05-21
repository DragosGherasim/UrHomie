using user_management_microservice.Infrastructure.Grpc.Protos;

namespace user_management_microservice.Startup.DependencyInjection.Modules;

public static class GrpcClientExtensions
{
    public static IServiceCollection AddGrpcClients(this IServiceCollection services, IConfiguration configuration)
    {
        var userAuthUri = configuration["Grpc:Uri"];

        if (string.IsNullOrWhiteSpace(userAuthUri))
            throw new InvalidOperationException("Missing configuration: Grpc:Uri");

        services.AddGrpcClient<UserAuthentication.UserAuthenticationClient>(options =>
        {
            options.Address = new Uri(userAuthUri);
        });

        services.AddScoped<IGrpcAuthClient, GrpcAuthClient>();

        return services;
    }
}