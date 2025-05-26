using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.EntityFrameworkCore;

namespace user_management_microservice.Utils;

public static class ValidationExtensions
{
    public static IDictionary<string, string[]> ToErrorDictionary(this ModelStateDictionary modelState)
    {
        return modelState
            .Where(e => e.Value?.Errors.Count > 0)
            .ToDictionary(
                kvp => kvp.Key,
                kvp => kvp.Value!.Errors.Select(e => e.ErrorMessage).ToArray()
            );
    }

    public static bool HasAtLeastOnePopulatedField<T>(this T dto)
    {
        if (dto == null)
            return false;

        var props = typeof(T).GetProperties();

        foreach (var prop in props)
        {
            var value = prop.GetValue(dto);

            switch (value)
            {
                case string str when !string.IsNullOrWhiteSpace(str):
                case sbyte sbyteVal when sbyteVal != 0:
                case int intVal when intVal != 0:
                case long longVal when longVal != 0:
                case true:
                    return true;
            }

            if (value is not null && prop.PropertyType.IsValueType)
                return true;
        }

        return false;
    }

    public static bool IsUniqueConstraintViolation(this DbUpdateException dbEx)
    {
        var msg = dbEx.InnerException?.Message;
        return msg is not null && (msg.Contains("Duplicate") || msg.Contains("UNIQUE"));
    }
}