using user_management_microservice.Application.DTOs.Client;
using user_management_microservice.Application.Mappers;
using user_management_microservice.Application.Services.Interfaces;
using user_management_microservice.Domain.Entities;
using user_management_microservice.Domain.Repositories;
using user_management_microservice.Infrastructure.EventBus.Messages;
using user_management_microservice.Utils;

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
    
    public async Task<Client?> UpdateClientAsync(long id, UpdateClientDto dto)
    {
        var client = await clientRepository.ReadById(id);
        if (client == null) return null;

        PatchHelper.PatchObject(client.UserProfile, dto);

        var updatedClient = await clientRepository.UpdateAsync(client);
        return updatedClient;
    }
}