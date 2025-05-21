using Microsoft.EntityFrameworkCore;
using user_management_microservice.Infrastructure.Persistence.Context;
using user_management_microservice.Startup.DependencyInjection.ConfigBindings;

namespace user_management_microservice.Startup.DependencyInjection.Modules;

public static class AddDatabase
{
    public static IServiceCollection AddDatabaseServices(this IServiceCollection services, IConfiguration config)
    {
        var mariadbSection = config.GetSection("Mariadb");
        var mariadb = mariadbSection.Get<MariadbSettings>();

        var connectionString = $"Server={mariadb!.Server};" +
                               $"Port={mariadb.Port};" +
                               $"Database={mariadb!.Database};" +
                               $"User={mariadb.User};" +
                               $"Password={mariadb.Password};";

        services.AddDbContext<UserManagementDbContext>(options =>
            options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

        return services;
    }
}