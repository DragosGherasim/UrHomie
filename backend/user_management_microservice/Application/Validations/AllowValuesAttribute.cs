using System.ComponentModel.DataAnnotations;

namespace user_management_microservice.Application.Validations;

public class AllowedValuesAttribute(params object[] allowedValues) : ValidationAttribute
{
    private readonly HashSet<object> _allowedValues = [..allowedValues];

    protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
    {
        switch (value)
        {
            case null:
                return ValidationResult.Success;
            case IConvertible convertibleValue:
            {
                var numeric = Convert.ToInt32(convertibleValue);
                if (_allowedValues.Contains(numeric))
                    return ValidationResult.Success;
                break;
            }
        }

        return new ValidationResult(ErrorMessage ??
                                    $"The value '{value}' is not among the allowed values: {string.Join(", ", _allowedValues)}.");
    }

}