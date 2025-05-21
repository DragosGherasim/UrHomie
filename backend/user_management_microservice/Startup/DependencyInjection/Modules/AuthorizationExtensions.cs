using Microsoft.AspNetCore.Authorization;
using user_management_microservice.Security.Handlers;
using user_management_microservice.Security.Requirements;

namespace user_management_microservice.Startup.DependencyInjection.Modules;

public static class AuthorizationExtensions
{
    public static IServiceCollection AddAuthorizationPolicies(this IServiceCollection services)
    {
        services.AddAuthorizationBuilder()
            .AddPolicy("SameClientOnly", policy =>
                policy.Requirements.Add(new SameUserRequirement("CLIENT")))
            .AddPolicy("SameServiceProviderOnly", policy =>
                policy.Requirements.Add(new SameUserRequirement("SERVICE_PROVIDER")));

        services.AddSingleton<IAuthorizationHandler, SameUserHandler>();

        return services;
    }
}