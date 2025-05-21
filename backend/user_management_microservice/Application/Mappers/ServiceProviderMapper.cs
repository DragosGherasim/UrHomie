using user_management_microservice.Application.DTOs.ServiceProvider;
using user_management_microservice.Domain.Entities;
using user_management_microservice.Infrastructure.EventBus.Messages;
using ServiceProvider = user_management_microservice.Domain.Entities.ServiceProvider;

namespace user_management_microservice.Application.Mappers;

public static class ServiceProviderMapper
{
    public static ServiceProvider CreateUserProfileToServiceProvider(CreateUserProfileMessage message)
    {
        return new ServiceProvider
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
            },

            Education = message.ServiceProvider!.Education,
            Certifications = message.ServiceProvider!.Certifications,
            ExperienceDescriptions = message.ServiceProvider!.ExperienceDescription,
            WorkSchedule = message.ServiceProvider!.WorkSchedule,
            CoverageArea = message.ServiceProvider!.CoverageArea
        };
    }

    public static ServiceProviderDto ServiceProviderToDto(ServiceProvider serviceProvider)
    {
        var userProfile = serviceProvider.UserProfile;

        return new ServiceProviderDto
        {
            Id = serviceProvider.Id,
            Email = userProfile.Email,
            FirstName = userProfile.FirstName,
            LastName = userProfile.LastName,
            PhoneNumber = userProfile.PhoneNumber,
            Country = userProfile.Country,
            City = userProfile.City,
            Address = userProfile.Address,
            Education = serviceProvider.Education,
            Certifications = serviceProvider.Certifications,
            ExperienceDescriptions = serviceProvider.ExperienceDescriptions,
            WorkSchedule = serviceProvider.WorkSchedule,
            CoverageArea = serviceProvider.CoverageArea
        };
    }
}