namespace user_management_microservice.Startup.DependencyInjection.Configurations;

public class MariadbSettings
{
    public string Server { get; set; } = "localhost";
    public string Database { get; set; } = "user-management";
    public string User { get; set; } = "user-management-manager";
    public string Password { get; set; } = "manager-pass";
    public int Port { get; set; } = 3307;
}