using System.ComponentModel.DataAnnotations;

namespace user_management_microservice.Application.DTOs.ServiceProvider;

public class UpdateServiceProviderDto
{
    [MaxLength(64)]
    [RegularExpression(@"^[a-zA-Z0-9\s\-_,.]*$", ErrorMessage = "Invalid FirstName. Avoid special characters.")]
    public string? FirstName { get; set; }

    [MaxLength(32)]
    [RegularExpression(@"^[a-zA-Z0-9\s\-_,.]*$", ErrorMessage = "Invalid LastName. Avoid special characters.")]
    public string? LastName { get; set; }

    [MaxLength(20)]
    [RegularExpression(@"^\+?[0-9]{10,15}$", ErrorMessage = "Invalid phone number format.")]
    [MinLength(1, ErrorMessage = "Phone number cannot be empty.")]
    public string? PhoneNumber { get; set; }

    [MaxLength(64)]
    [RegularExpression(@"^[a-zA-Z0-9\s\-_,.]*$", ErrorMessage = "Invalid Country. Avoid special characters.")]
    public string? Country { get; set; }

    [MaxLength(64)]
    [RegularExpression(@"^[a-zA-Z0-9\s\-_,.]*$", ErrorMessage = "Invalid City. Avoid special characters.")]
    public string? City { get; set; }

    [MaxLength(255)]
    [RegularExpression(@"^[a-zA-Z0-9\s\-_,.]*$", ErrorMessage = "Invalid Address. Avoid special characters.")]
    public string? Address { get; set; }

    [MaxLength(255)]
    [RegularExpression(@"^[a-zA-Z0-9\s\-_,.]*$", ErrorMessage = "Invalid Education field.")]
    public string? Education { get; set; }

    [MaxLength(255)]
    [RegularExpression(@"^[a-zA-Z0-9\s\-_,.]*$", ErrorMessage = "Invalid Certifications field.")]
    public string? Certifications { get; set; }

    [RegularExpression(@"^[a-zA-Z0-9\s\-_,.]{10,}$", ErrorMessage = "Experience description must be at least 10 characters long and contain only safe characters.")]
    public string? ExperienceDescriptions { get; set; }

    [MaxLength(64)]
    [RegularExpression(@"^[a-zA-Z0-9\s\-_,.]*$", ErrorMessage = "Invalid Work Schedule.")]
    public string? WorkSchedule { get; set; }

    [Range(1, 10, ErrorMessage = "Coverage area must be between 1 and 10.")]
    public sbyte? CoverageArea { get; set; }
}