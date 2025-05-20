using Microsoft.AspNetCore.Authorization;

namespace user_management_microservice.Authorization.Client;

public class SameClientRequirement: IAuthorizationRequirement;