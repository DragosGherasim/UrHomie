using user_management_microservice.Application.Mappers;
using user_management_microservice.Application.Services.Interfaces;
using user_management_microservice.Domain.Repositories;
using user_management_microservice.Infrastructure.EventBus.Messages;
using ServiceProvider = user_management_microservice.Domain.Entities.ServiceProvider;


namespace user_management_microservice.Application.Services;

public class ServiceProviderService(
    IServiceProviderRepository serviceProviderRepository) : IServiceProviderService
{
    public async Task<ServiceProvider?> AddServiceProviderAsync(CreateUserProfileMessage providerProfile)
    {
        var serviceProvider = ServiceProviderMapper.CreateUserProfileToServiceProvider(providerProfile);

        return await serviceProviderRepository.CreateAsync(serviceProvider);
    }

    public async Task<ServiceProvider?> GetServiceProviderAsync(long id)
    {
        return await serviceProviderRepository.ReadById(id);
    }
}