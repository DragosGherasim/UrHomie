using user_management_microservice.Domain.Entities;
using user_management_microservice.Infrastructure.EventBus.Messages;

namespace user_management_microservice.Application.Services.Interfaces;

public interface IClientService
{
    Task<Client?> GetClientAsync(long clientId);
    Task<Client?> AddClientAsync(CreateUserProfileMessage clientProfile);
}