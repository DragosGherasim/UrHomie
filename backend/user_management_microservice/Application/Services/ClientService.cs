using user_management_microservice.Application.Mappers;
using user_management_microservice.Application.Services.Interfaces;
using user_management_microservice.Domain.Entities;
using user_management_microservice.Domain.Repositories;
using user_management_microservice.Infrastructure.EventBus.Messages;

namespace user_management_microservice.Application.Services;

public class ClientService(IClientRepository clientRepository) : IClientService
{
    public async Task<Client?> AddClientAsync(CreateUserProfileMessage profile)
    {
        var client = ClientMapper.CreateUserProfileToClient(profile);

        return await clientRepository.CreateAsync(client);
    }

    public async Task<Client?> GetClientAsync(long id)
    {
        return await clientRepository.ReadById(id);
    }
}