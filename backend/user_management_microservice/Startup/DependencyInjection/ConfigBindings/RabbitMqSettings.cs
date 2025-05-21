namespace user_management_microservice.Startup.DependencyInjection.ConfigBindings;

public class RabbitMqSettings
{
    public string Host { get; set; } = null!;
    public string Username { get; set; } = null!;
    public string Password { get; set; } = null!;
}