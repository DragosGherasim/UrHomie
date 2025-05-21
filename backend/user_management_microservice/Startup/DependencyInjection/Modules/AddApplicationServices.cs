using user_management_microservice.Application.Services;
using user_management_microservice.Application.Services.Interfaces;
using user_management_microservice.Domain.Repositories;
using user_management_microservice.Infrastructure.Persistence.Repositories;

namespace user_management_microservice.Startup.DependencyInjection.Modules;

public static class AddApplicationServices
{
    public static IServiceCollection AddCoreServices(this IServiceCollection services)
    {
        // Client
        services.AddScoped<IClientRepository, ClientRepository>();
        services.AddScoped<IClientService, ClientService>();

        // Service Provider
        services.AddScoped<IServiceProviderRepository, ServiceProviderRepository>();
        services.AddScoped<IServiceProviderService, ServiceProviderService>();

        return services;
    }
}