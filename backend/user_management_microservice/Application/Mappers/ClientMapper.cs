using user_management_microservice.Application.DTOs.Client;
using user_management_microservice.Domain.Entities;
using user_management_microservice.Infrastructure.EventBus.Messages;

namespace user_management_microservice.Application.Mappers;

public static class ClientMapper
{
    public static Client CreateUserProfileToClient(CreateUserProfileMessage message)
    {
        return new Client
        {
            Id = message.UserId,
            UserProfileId = message.UserId,

            UserProfile = new UserProfile
            {
                Id = message.UserId,
                Email = message.Email,
                FirstName = message.FirstName,
                LastName = message.LastName,
                PhoneNumber = message.PhoneNumber,
                Country = message.Country,
                City = message.City,
                Address = message.Address
            }
        };
    }

    public static ClientDto ClientToDto(Client client)
    {
        var userProfile = client.UserProfile;

        return new ClientDto
        {
            Id = client.Id,
            Email = userProfile.Email,
            FirstName = userProfile.FirstName,
            LastName = userProfile.LastName,
            PhoneNumber = userProfile.PhoneNumber,
            Country = userProfile.Country,
            City = userProfile.City,
            Address = userProfile.Address
        };
    }
}