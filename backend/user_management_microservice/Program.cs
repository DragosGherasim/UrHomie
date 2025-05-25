using Microsoft.AspNetCore.Mvc;
using Serilog;
using user_management_microservice.Middleware;
using user_management_microservice.Startup.DependencyInjection.ConfigBindings;
using user_management_microservice.Startup.DependencyInjection.Modules;

var builder = WebApplication.CreateBuilder(args);

// ---------------------------
// Logging Configuration (Serilog)
// ---------------------------
builder.Host.UseSerilog((context, configuration) =>
    configuration.ReadFrom.Configuration(context.Configuration));

// ---------------------------
// Bind configuration sections to strongly-typed settings
// ---------------------------
builder.Services.Configure<RabbitMqSettings>(
    builder.Configuration.GetSection("RabbitMq"));
builder.Services.Configure<MariadbSettings>(
    builder.Configuration.GetSection("Mariadb"));

// ---------------------------
// Register application-specific services
// ---------------------------
builder.Services
    .AddDatabaseServices(builder.Configuration)
    .AddCoreServices()
    .AddRabbitMq(builder.Configuration);

// ---------------------------
// Register infrastructure and communication dependencies
// ---------------------------
builder.Services.AddGrpcClients(builder.Configuration);
builder.Services.AddAuthorizationPolicies();
builder.Services.AddCustomAuthentication();


// ---------------------------
// Controllers and Swagger/OpenAPI
// ---------------------------
builder.Services
    .AddControllers()
    .ConfigureApiBehaviorOptions(options =>
    {
        options.InvalidModelStateResponseFactory = context =>
        {
            var errors = context.ModelState
                .Where(e => e.Value?.Errors.Count > 0)
                .ToDictionary(
                    kvp => kvp.Key,
                    kvp => kvp.Value!.Errors.Select(e => e.ErrorMessage).ToArray()
                );

            return new UnprocessableEntityObjectResult(new { errors });
        };
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi();

var app = builder.Build();

// ---------------------------
// Development-only Middleware
// ---------------------------
if (app.Environment.IsDevelopment())
    app.MapOpenApi();

// ---------------------------
// HTTP Pipeline configuration
// ---------------------------
app.UseSerilogRequestLogging();
app.UseHttpsRedirection();

// JWT validation using external gRPC middleware
app.UseMiddleware<ExternalJwtValidationMiddleware>();

app.UseAuthorization();
app.MapControllers();

app.Run();