using Microsoft.EntityFrameworkCore;
using user_management_microservice.Domain.Repositories;
using user_management_microservice.Infrastructure.Persistence.Context;
using ServiceProvider = user_management_microservice.Domain.Entities.ServiceProvider;

namespace user_management_microservice.Infrastructure.Persistence.Repositories;

public class ServiceProviderRepository(UserManagementDbContext context) : IServiceProviderRepository
{
    public async Task<ServiceProvider?> CreateAsync(ServiceProvider serviceProvider)
    {
        await using var transaction = await context.Database.BeginTransactionAsync();

        await context.ServiceProviders.AddAsync(serviceProvider);
        await context.SaveChangesAsync();

        await transaction.CommitAsync();

        return serviceProvider;
    }

    public async Task<ServiceProvider?> ReadById(long id)
    {
        return await context.ServiceProviders
            .Include(c => c.UserProfile)
            .FirstOrDefaultAsync(x => x.Id == id);
    }
}