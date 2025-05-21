using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using user_management_microservice.Security.Requirements;

namespace user_management_microservice.Security.Handlers;

public class SameUserHandler : AuthorizationHandler<SameUserRequirement>
{
    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, SameUserRequirement requirement)
    {
        if (context.Resource is not HttpContext httpContext)
            return Task.CompletedTask;

        var userIdClaim = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var role = context.User.FindFirst(ClaimTypes.Role)?.Value;
        var routeId = httpContext.Request.RouteValues["id"]?.ToString();

        if (string.IsNullOrEmpty(userIdClaim) || string.IsNullOrEmpty(routeId))
            return Task.CompletedTask;

        if ((role?.ToUpperInvariant()!).Equals(requirement.RequiredRole, StringComparison.InvariantCultureIgnoreCase) &&
            userIdClaim == routeId)
            context.Succeed(requirement);

        return Task.CompletedTask;
    }
}