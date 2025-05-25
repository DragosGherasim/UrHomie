using System.ComponentModel.DataAnnotations;

namespace user_management_microservice.Application.DTOs.Client;

public class UpdateClientDto
{
    [MaxLength(64)]
    [RegularExpression(@"^[a-zA-Z0-9\s\-_,.]*$", ErrorMessage = "Invalid FirstName. Avoid special characters.")]
    public string? FirstName { get; set; }

    [MaxLength(32)]
    [RegularExpression(@"^[a-zA-Z0-9\s\-_,.]*$", ErrorMessage = "Invalid LastName. Avoid special characters.")]
    public string? LastName { get; set; }

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
}