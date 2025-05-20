using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace user_management_microservice.Authorization.ServiceProvider;

public class SameServiceProviderHandler: AuthorizationHandler<SameServiceProviderRequirement>
{
    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, SameServiceProviderRequirement requirement)
    {
        if (context.Resource is not HttpContext httpContext)
            return Task.CompletedTask;

        var userIdClaim = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var role = context.User.FindFirst(ClaimTypes.Role)?.Value;
        var routeId = httpContext.Request.RouteValues["id"]?.ToString();

        if (string.IsNullOrEmpty(userIdClaim) || string.IsNullOrEmpty(routeId))
            return Task.CompletedTask;

        if (role?.ToUpperInvariant() == "SERVICE_PROVIDER" && userIdClaim == routeId)
            context.Succeed(requirement);

        return Task.CompletedTask;
    }
}