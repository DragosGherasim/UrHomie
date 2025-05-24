namespace user_management_microservice.Application.DTOs.ServiceProvider;

public class UpdateServiceProviderDto
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Country { get; set; }
    public string? City { get; set; }
    public string? Address { get; set; }
    
    public string? Education { get; set; }
    public string? Certifications { get; set; }
    public string? ExperienceDescriptions { get; set; }
    public string? WorkSchedule { get; set; }
    public sbyte? CoverageArea { get; set; }
}