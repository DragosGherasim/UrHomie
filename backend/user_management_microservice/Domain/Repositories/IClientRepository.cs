using user_management_microservice.Domain.Entities;

namespace user_management_microservice.Domain.Repositories;

public interface IClientRepository
{
    Task<Client?> CreateAsync(Client client);
    Task<Client?> ReadById(long id);
}