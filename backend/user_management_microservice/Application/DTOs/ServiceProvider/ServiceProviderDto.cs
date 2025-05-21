namespace user_management_microservice.Application.DTOs.ServiceProvider;

public class ServiceProviderDto
{
    public long Id { get; set; }

    public string Email { get; set; } = null!;

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public string PhoneNumber { get; set; } = null!;

    public string Country { get; set; } = null!;

    public string City { get; set; } = null!;

    public string Address { get; set; } = null!;

    public string Education { get; set; } = null!;

    public string Certifications { get; set; } = null!;

    public string ExperienceDescriptions { get; set; } = null!;

    public string WorkSchedule { get; set; } = null!;

    public sbyte CoverageArea { get; set; }
}