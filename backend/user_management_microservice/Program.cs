using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Serilog;
using user_management_microservice.Authorization;
using user_management_microservice.Authorization.Client;
using user_management_microservice.Authorization.ServiceProvider;
using user_management_microservice.Infrastructure.Grpc.Protos;
using user_management_microservice.Middleware;
using user_management_microservice.Startup.DependencyInjection;
using user_management_microservice.Startup.DependencyInjection.Configurations;

var builder = WebApplication.CreateBuilder(args);

// ---- Serilog config ----
builder.Host.UseSerilog((context, configuration) =>
    configuration.ReadFrom.Configuration(context.Configuration));

// ---- Config from appsettings ----
builder.Services.Configure<RabbitMqSettings>(
    builder.Configuration.GetSection("RabbitMq"));
builder.Services.Configure<MariadbSettings>(
    builder.Configuration.GetSection("Mariadb"));

// ---- Internal service dependencies ----
builder.Services
    .AddDatabaseServices(builder.Configuration)
    .AddCoreServices()
    .AddRabbitMq(builder.Configuration);

// gRPC client către serverul Python user-auth
builder.Services.AddGrpcClient<UserAuthentication.UserAuthenticationClient>(options =>
{
    options.Address = new Uri("http://user-auth-envoy-proxy:8000"); // adresa corectă către serverul Python gRPC
});
builder.Services.AddScoped<IGrpcAuthClient, GrpcAuthClient>();

// Politica SameClientOnly (client autenticat + propriul ID)
builder.Services.AddAuthorizationBuilder()
    .AddPolicy("SameClientOnly", policy =>
        policy.Requirements.Add(new SameClientRequirement()))
    .AddPolicy("SameServiceProviderOnly", policy =>
        policy.Requirements.Add(new SameServiceProviderRequirement()));

builder.Services.AddSingleton<IAuthorizationHandler, SameClientHandler>();
builder.Services.AddSingleton<IAuthorizationHandler, SameServiceProviderHandler>();

builder.Services.AddAuthentication("ExternalJwt")
    .AddScheme<AuthenticationSchemeOptions, DummyExternalJwtHandler>("ExternalJwt", options => {});


// ---- Controller + Swagger ----
builder.Services.AddControllers();
builder.Services.AddOpenApi();

var app = builder.Build();

// ---- Middleware & Endpoints ----
if (app.Environment.IsDevelopment())
    app.MapOpenApi();

app.UseSerilogRequestLogging();
app.UseHttpsRedirection();

// Middleware pentru validarea JWT prin gRPC
app.UseMiddleware<ExternalJwtValidationMiddleware>();

app.UseAuthorization();
app.MapControllers();

app.Run();