using System.ComponentModel.DataAnnotations;
using user_management_microservice.Application.Validations;

namespace user_management_microservice.Application.DTOs.ServiceProvider;

public class UpdateServiceProviderDto
{
    [ValidateIfPresent(typeof(MinLengthAttribute), 1, ErrorMessage = "First name cannot be empty.")]
    [ValidateIfPresent(typeof(MaxLengthAttribute), 64, ErrorMessage = "First name must be at most 64 characters.")]
    [ValidateIfPresent(typeof(RegularExpressionAttribute), @"^[a-zA-Z0-9\s\-_,.]*$",
        ErrorMessage = "First name contains invalid characters.")]
    public string? FirstName { get; set; }

    [ValidateIfPresent(typeof(MinLengthAttribute), 1, ErrorMessage = "Last name cannot be empty.")]
    [ValidateIfPresent(typeof(MaxLengthAttribute), 32, ErrorMessage = "Last name must be at most 32 characters.")]
    [ValidateIfPresent(typeof(RegularExpressionAttribute), @"^[a-zA-Z0-9\s\-_,.]*$",
        ErrorMessage = "Last name contains invalid characters.")]
    public string? LastName { get; set; }

    [ValidateIfPresent(typeof(MinLengthAttribute), 1, ErrorMessage = "Phone number cannot be empty.")]
    [ValidateIfPresent(typeof(MaxLengthAttribute), 20, ErrorMessage = "Phone number must be at most 20 characters.")]
    [ValidateIfPresent(typeof(RegularExpressionAttribute), @"^\+?[0-9]{10,15}$",
        ErrorMessage = "Phone number must be 10–15 digits and may start with '+'.")]
    public string? PhoneNumber { get; set; }

    [ValidateIfPresent(typeof(MinLengthAttribute), 1, ErrorMessage = "Country cannot be empty.")]
    [ValidateIfPresent(typeof(MaxLengthAttribute), 64, ErrorMessage = "Country must be at most 64 characters.")]
    [ValidateIfPresent(typeof(RegularExpressionAttribute), @"^[a-zA-Z0-9\s\-_,.]*$",
        ErrorMessage = "Country contains invalid characters.")]
    public string? Country { get; set; }

    [ValidateIfPresent(typeof(MinLengthAttribute), 1, ErrorMessage = "City cannot be empty.")]
    [ValidateIfPresent(typeof(MaxLengthAttribute), 64, ErrorMessage = "City must be at most 64 characters.")]
    [ValidateIfPresent(typeof(RegularExpressionAttribute), @"^[a-zA-Z0-9\s\-_,.]*$",
        ErrorMessage = "City contains invalid characters.")]
    public string? City { get; set; }

    [ValidateIfPresent(typeof(MinLengthAttribute), 1, ErrorMessage = "Address cannot be empty.")]
    [ValidateIfPresent(typeof(MaxLengthAttribute), 255, ErrorMessage = "Address must be at most 255 characters.")]
    [ValidateIfPresent(typeof(RegularExpressionAttribute), @"^[a-zA-Z0-9\s\-_,.]*$",
        ErrorMessage = "Address contains invalid characters.")]
    public string? Address { get; set; }

    [ValidateIfPresent(typeof(MinLengthAttribute), 1, ErrorMessage = "Education cannot be empty.")]
    [ValidateIfPresent(typeof(MaxLengthAttribute), 255, ErrorMessage = "Education must be at most 255 characters.")]
    [ValidateIfPresent(typeof(RegularExpressionAttribute), @"^[a-zA-Z0-9\s\-_,.]*$",
        ErrorMessage = "Education contains invalid characters.")]
    public string? Education { get; set; }

    [ValidateIfPresent(typeof(MinLengthAttribute), 1, ErrorMessage = "Certifications cannot be empty.")]
    [ValidateIfPresent(typeof(MaxLengthAttribute), 255,
        ErrorMessage = "Certifications must be at most 255 characters.")]
    [ValidateIfPresent(typeof(RegularExpressionAttribute), @"^[a-zA-Z0-9\s\-_,.]*$",
        ErrorMessage = "Certifications contains invalid characters.")]
    public string? Certifications { get; set; }

    [ValidateIfPresent(typeof(RegularExpressionAttribute), @"^[a-zA-Z0-9\s\-_,.]{10,}$",
        ErrorMessage = "Experience description must be at least 10 characters and use safe characters.")]
    public string? ExperienceDescriptions { get; set; }

    [ValidateIfPresent(typeof(RegularExpressionAttribute),
        @"^([01]\d|2[0-3]):[0-5]\d\s*-\s*([01]\d|2[0-3]):[0-5]\d$",
        ErrorMessage = "Work schedule must be in the format HH:mm - HH:mm (e.g., 08:00 - 17:00).")]
    public string? WorkSchedule { get; set; }

    [Validations.AllowedValues(5, 25, 50, 100, ErrorMessage = "Coverage area must be one of: 5, 25, 50, or 100.")]
    public sbyte? CoverageArea { get; set; }
}