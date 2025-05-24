using user_management_microservice.Application.DTOs.ServiceProvider;
using user_management_microservice.Application.Mappers;
using user_management_microservice.Application.Services.Interfaces;
using user_management_microservice.Domain.Repositories;
using user_management_microservice.Infrastructure.EventBus.Messages;
using user_management_microservice.Utils;
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
    
    public async Task<ServiceProvider?> UpdateServiceProviderAsync(long id, UpdateServiceProviderDto dto)
    {
        var serviceProvider = await serviceProviderRepository.ReadById(id);
        
        if (serviceProvider == null) return null;
        
        PatchHelper.PatchObject(serviceProvider.UserProfile, dto);
        PatchHelper.PatchObject(serviceProvider, dto);
        
        var updatedServiceProvider = await serviceProviderRepository.UpdateAsync(serviceProvider);
        return updatedServiceProvider;
    }
}