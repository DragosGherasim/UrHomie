using ServiceProvider = user_management_microservice.Domain.Entities.ServiceProvider;

namespace user_management_microservice.Domain.Repositories;

public interface IServiceProviderRepository
{
    Task<ServiceProvider?> CreateAsync(ServiceProvider serviceProvider);
    Task<ServiceProvider?> ReadById(long id);
}