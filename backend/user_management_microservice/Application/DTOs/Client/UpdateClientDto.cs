using System.ComponentModel.DataAnnotations;
using user_management_microservice.Application.Validations;

namespace user_management_microservice.Application.DTOs.Client;

public class UpdateClientDto
{
    [ValidateIfPresent(typeof(MinLengthAttribute), 1, ErrorMessage = "First name cannot be empty.")]
    [ValidateIfPresent(typeof(MaxLengthAttribute), 64, ErrorMessage = "First name must be at most 64 characters.")]
    [ValidateIfPresent(typeof(RegularExpressionAttribute), @"^[a-zA-Z0-9\s\-_,.]*$", ErrorMessage = "First name contains invalid characters.")]
    public string? FirstName { get; set; }

    [ValidateIfPresent(typeof(MinLengthAttribute), 1, ErrorMessage = "Last name cannot be empty.")]
    [ValidateIfPresent(typeof(MaxLengthAttribute), 32, ErrorMessage = "Last name must be at most 32 characters.")]
    [ValidateIfPresent(typeof(RegularExpressionAttribute), @"^[a-zA-Z0-9\s\-_,.]*$", ErrorMessage = "Last name contains invalid characters.")]
    public string? LastName { get; set; }

    [ValidateIfPresent(typeof(MinLengthAttribute), 1, ErrorMessage = "Phone number cannot be empty.")]
    [ValidateIfPresent(typeof(RegularExpressionAttribute), @"^\+?[0-9]{10,15}$", ErrorMessage = "Phone number must be 10–15 digits and may start with '+'.")]
    public string? PhoneNumber { get; set; }

    [ValidateIfPresent(typeof(MinLengthAttribute), 1, ErrorMessage = "Country cannot be empty.")]
    [ValidateIfPresent(typeof(MaxLengthAttribute), 64, ErrorMessage = "Country must be at most 64 characters.")]
    [ValidateIfPresent(typeof(RegularExpressionAttribute), @"^[a-zA-Z0-9\s\-_,.]*$", ErrorMessage = "Country contains invalid characters.")]
    public string? Country { get; set; }

    [ValidateIfPresent(typeof(MinLengthAttribute), 1, ErrorMessage = "City cannot be empty.")]
    [ValidateIfPresent(typeof(MaxLengthAttribute), 64, ErrorMessage = "City must be at most 64 characters.")]
    [ValidateIfPresent(typeof(RegularExpressionAttribute), @"^[a-zA-Z0-9\s\-_,.]*$", ErrorMessage = "City contains invalid characters.")]
    public string? City { get; set; }

    [ValidateIfPresent(typeof(MinLengthAttribute), 1, ErrorMessage = "Address cannot be empty.")]
    [ValidateIfPresent(typeof(MaxLengthAttribute), 255, ErrorMessage = "Address must be at most 255 characters.")]
    [ValidateIfPresent(typeof(RegularExpressionAttribute), @"^[a-zA-Z0-9\s\-_,.]*$", ErrorMessage = "Address contains invalid characters.")]
    public string? Address { get; set; }
}