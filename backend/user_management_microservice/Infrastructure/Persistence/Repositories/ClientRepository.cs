using Microsoft.EntityFrameworkCore;
using user_management_microservice.Domain.Entities;
using user_management_microservice.Domain.Repositories;
using user_management_microservice.Infrastructure.Persistence.Context;

namespace user_management_microservice.Infrastructure.Persistence.Repositories;

public class ClientRepository(UserManagementDbContext context) : IClientRepository
{
    public async Task<Client?> CreateAsync(Client client)
    {
        await using var transaction = await context.Database.BeginTransactionAsync();

        await context.Clients.AddAsync(client);
        await context.SaveChangesAsync();

        await transaction.CommitAsync();

        return client;
    }

    public async Task<Client?> ReadById(long id)
    {
        return await context.Clients
            .Include(c => c.UserProfile)
            .FirstOrDefaultAsync(x => x.Id == id);
    }
}