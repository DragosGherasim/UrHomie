using System.Security.Claims;
using user_management_microservice.Infrastructure.Grpc.Protos;

namespace user_management_microservice.Middleware;

public class ExternalJwtValidationMiddleware(RequestDelegate next)
{
    public async Task Invoke(HttpContext context, IGrpcAuthClient grpcAuthClient)
    {
        var authHeader = context.Request.Headers.Authorization.FirstOrDefault();

        if (!string.IsNullOrEmpty(authHeader) && authHeader.StartsWith("Bearer "))
        {
            var token = authHeader["Bearer ".Length..].Trim();
            var result = await grpcAuthClient.ValidateJwtAsync(token);

            if (!result.IsValid)
            {
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                await context.Response.WriteAsync("Unauthorized: Invalid token");
                return;
            }

            var claims = new List<Claim>
            {
                new(ClaimTypes.NameIdentifier, result.Sub),
                new(ClaimTypes.Role, result.Role)
            };

            var identity = new ClaimsIdentity(claims, "ExternalJwt");
            context.User = new ClaimsPrincipal(identity);
        }

        await next(context);
    }
}