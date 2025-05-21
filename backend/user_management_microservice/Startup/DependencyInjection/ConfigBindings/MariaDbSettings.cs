namespace user_management_microservice.Startup.DependencyInjection.ConfigBindings;

public class MariadbSettings
{
    public string Server { get; set; } = null!;
    public string Database { get; set; } = null!;
    public string User { get; set; } = null!;
    public string Password { get; set; } = null!;
    public int Port { get; set; } 
}