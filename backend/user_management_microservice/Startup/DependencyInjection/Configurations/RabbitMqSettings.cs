namespace user_management_microservice.Startup.DependencyInjection.Configurations;

public class RabbitMqSettings
{
    public string Host { get; set; } = "localhost";
    public string Username { get; set; } = "guest";
    public string Password { get; set; } = "guest";
}