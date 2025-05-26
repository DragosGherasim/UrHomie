using System.ComponentModel.DataAnnotations;

namespace user_management_microservice.Application.Validations;

[AttributeUsage(AttributeTargets.Property, AllowMultiple = true)]
public class ValidateIfPresentAttribute(Type validatorType, params object[] args) : ValidationAttribute
{
    private readonly ValidationAttribute _inner = (ValidationAttribute)Activator.CreateInstance(validatorType, args)!;

    protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
    {
        if (value is null)
            return ValidationResult.Success;

        var result = _inner.GetValidationResult(value, validationContext);

        if (result != ValidationResult.Success && !string.IsNullOrEmpty(ErrorMessage))
            return new ValidationResult(ErrorMessage);

        return result;
    }
}