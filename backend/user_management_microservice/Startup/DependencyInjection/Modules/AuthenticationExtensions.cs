using Microsoft.AspNetCore.Authentication;
using user_management_microservice.Infrastructure.Authentication;

namespace user_management_microservice.Startup.DependencyInjection.Modules;

public static class AuthenticationExtensions
{
    public static IServiceCollection AddCustomAuthentication(this IServiceCollection services)
    {
        services.AddAuthentication("ExternalJwt")
            .AddScheme<AuthenticationSchemeOptions, MiddlewareBackedJwtHandler>("ExternalJwt", _ => { });

        return services;
    }
}