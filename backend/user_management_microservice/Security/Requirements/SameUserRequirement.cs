using Microsoft.AspNetCore.Authorization;

namespace user_management_microservice.Security.Requirements;

public class SameUserRequirement(string requiredRole) : IAuthorizationRequirement
{
    public string RequiredRole { get; } = requiredRole;
}