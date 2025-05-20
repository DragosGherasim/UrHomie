using user_management_microservice.Infrastructure.EventBus.Messages;
using ServiceProvider = user_management_microservice.Domain.Entities.ServiceProvider;

namespace user_management_microservice.Application.Services.Interfaces;

public interface IServiceProviderService
{
    Task<ServiceProvider?> GetServiceProviderAsync(long serviceProviderId);
    Task<ServiceProvider?> AddServiceProviderAsync(CreateUserProfileMessage providerProfile);
}